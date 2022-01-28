import helpers from '@lib/utils/helpers'
import UserSession from '@server/database/models/UserSession'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'
import { merge } from 'lodash'

@api.route('/session')
export default class SessionAPIEndpoint extends api.Route<{
	Body: UserSession['data']
}> {
	get body() {
		return helpers.exclude(this.request.body, ['auth'])
	}

	@api.endpoint
	get() {
		return this.request.session.data
	}

	@api.endpoint
	async patch() {
		try {
			const session = await UserSession.findOneOrFail(this.request.session.id)
			session.data = merge(session.data, this.body)

			await session.save()
			return session.data
		} catch (e) {
			console.log('failed pulling session from db', e)
			return new ServerError('unexpected error')
		}
	}
}
