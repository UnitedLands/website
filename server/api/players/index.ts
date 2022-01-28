import Player from '@server/database/models/Player'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

namespace PlayersAPIRoute {
	export type Query = {
		limit?: number
		page?: number
	}
}

@api.route('/players')
class PlayersAPIRoute extends api.Route<{
	Querystring: PlayersAPIRoute.Query
}> {
	@api.endpoint
	async get() {
		try {
			const results = await Player.findAndCount()
			return {
				total: results[1],
				items: results[0]
			}
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error')
		}
	}
}

export default PlayersAPIRoute
