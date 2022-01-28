import helpers from '@lib/utils/helpers'
import User from '@server/database/models/User'
import api from '@server/includes/api'
import { hashIt } from '@server/includes/functions'
import ServerError from '@server/includes/ServerError'

@api.route('/auth')
export default class AuthAPIRoute extends api.Route<{
	Body: {
		username: string
		password: string
	}
}> {
	get creds() {
		return helpers.extract(this.request.body, ['username', 'password'])
	}

	@api.endpoint
	async get() {
		this.console.info('authing')
		if (this.request.session.data.auth?.current) return this.request.session.data.auth.current
		this.console.info('unauthed')
		return new ServerError('unauthed', 401)
	}

	@api.endpoint
	async post() {
		const { username, password } = this.creds

		try {
			const user = await User.findOneOrFail({
				name: username,
				password: await hashIt(password)
			})

			this.request.session.data.auth = {
				current: user.toJSON()
			}

			return user
		} catch (e) {
			return new ServerError('invalid username or password', 401)
		}
	}

	@api.endpoint
	async delete() {
		await this.request.session.destroy()
		return true
	}
}
