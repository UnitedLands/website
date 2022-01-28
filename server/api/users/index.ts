import helpers from '@lib/utils/helpers'
import User, { UserData } from '@server/database/models/User'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'
import isAdmin from '@server/middleware/isAdmin'
import { hashSync } from 'bcrypt'
import { defaults } from 'lodash'
import { FindConditions, Like } from 'typeorm'

@api.route('/users')
class UsersAPIRoute extends api.Route<{
	Querystring: UsersAPIRoute.Query
	Body: UsersAPIRoute.Body
}> {
	get query() {
		const query = helpers.extract(this.request.query, ['search', 'page', 'limit'])
		return defaults(query, {
			page: 1,
			limit: 10
		})
	}

	get whereQuery(): FindConditions<User> | FindConditions<User>[] {
		const query = helpers.extract(this.query, ['search'])
		const conditions: FindConditions<User> = {}

		if (query.search) {
			const search = Like(`%${query.search}%`)
			return [{ name: search }, { email: search }, { display_name: search }]
		}

		return conditions
	}

	get body() {
		const body = helpers.extract(this.request.body, [
			'display_name',
			'email',
			'name',
			'password',
			'roles'
		])

		return body
	}

	@api.endpoint
	async get() {
		try {
			const results = await User.findAndCount({
				where: this.whereQuery,
				skip: this.query.page === 1 ? 0 : this.query.page * this.query.limit,
				take: this.query.limit
			})

			return {
				total: results[1],
				items: results[0]
			}
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error')
		}
	}

	@api.endpoint
	@api.use([isAdmin])
	async post() {
		try {
			const user = User.init(this.body)

			user.password = hashSync(user.password!, process.env.PASSWORD_SALT!)

			return await user.save()
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error')
		}
	}
}

namespace UsersAPIRoute {
	export interface Query {
		search?: string
		page?: number
		limit?: number
	}

	export type Body = Pick<UserData, 'display_name' | 'name' | 'email' | 'password' | 'roles'>
}

export default UsersAPIRoute
