import TownyResident from '@server/database/models/Towny/Resident'
import { TownyTownWithBalance } from '@server/database/models/Towny/Town'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

namespace TownsSingleAPIRoute {}

@api.route('/towns/:name')
class TownsSingleAPIRoute extends api.Route<{
	Params: {
		name: string
	}
}> {
	declare town: TownyTownWithBalance

	get town_name() {
		return this.request.params.name
	}

	async middleware() {
		try {
			this.town = await TownyTownWithBalance.findOneOrFail({
				name: this.town_name
			})

			this.reply.header('cache-control', 'public, max-age=43200')
		} catch (e) {
			throw new ServerError('town not found', 404)
		}
	}

	@api.endpoint
	get() {
		return this.town
	}

	@api.endpoint('get', '/residents')
	async getResidents() {
		try {
			const [items, total] = await TownyResident.findAndCount({
				where: {
					town: TownyTownWithBalance.getId(this.town)
				}
			})

			return {
				items,
				total
			}
		} catch (error) {
			this.console.error(error)
			return new ServerError('unexpected error')
		}
	}
}

export default TownsSingleAPIRoute
