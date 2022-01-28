import helpers from '@lib/utils/helpers'
import User from '@server/database/models/User'
import api from '@server/includes/api'
import { hashIt } from '@server/includes/functions'
import mailer from '@server/includes/mailer'
import ServerError from '@server/includes/ServerError'
import { v4 as uuidv4 } from 'uuid'

@api.route('/register')
class RegisterAPIRoute extends api.Route<{
	Params: RegisterAPIRoute.Params
	Body: RegisterAPIRoute.Body
}> {
	get body() {
		return helpers.extract(this.request.body, ['email', 'name'])
	}

	get password() {
		return this.request.body.password
	}

	get code() {
		return this.request.params.code
	}

	@api.endpoint
	async post() {
		try {
			await this.#checkForExistingUser()

			const user = User.init(this.body)
			user.password = uuidv4()

			await user.save()

			await mailer.send({
				to: user.email,
				subject: 'Complete your UnitedLands Registration',
				text: `To complete your registration, please visit the following link:\n${process.env.CLIENT_URL}/register/${user.password}`
			})

			return true
		} catch (e) {
			this.console.error(e)
			if (e instanceof ServerError) return e
			return new ServerError('unexpected error')
		}
	}

	@api.endpoint('post', '/:code')
	async complete() {
		try {
			if (!this.password) return new ServerError('missing password', 400)
			else if (this.password.length < 8) return new ServerError('password is too short', 400)

			const user = await this.#findUserByCode()
			user.password = await hashIt(this.password)

			await user.save()
			delete user.password

			return user
		} catch (e) {
			this.console.error(e)
			if (e instanceof ServerError) return e
			return new ServerError('unexpected error')
		}
	}

	async #checkForExistingUser() {
		const body = this.body
		const existing = await User.findOne({
			where: [{ name: body.name }, { email: body.email }]
		})

		if (existing) throw new ServerError('user with name or email already exists', 400)
	}

	async #findUserByCode() {
		try {
			return await User.findOneOrFail({
				where: {
					password: this.code
				}
			})
		} catch {
			throw new ServerError('code does not match any pending registrations', 404)
		}
	}
}

namespace RegisterAPIRoute {
	export interface Params {
		code: string
	}

	export interface Body {
		name: string
		email: string
		password: string
	}
}

export default RegisterAPIRoute
