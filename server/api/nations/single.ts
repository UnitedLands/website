import TownyResident from '@server/database/models/Towny/Resident'
import { TownyNationWithBalance } from '@server/database/models/Towny/Nation'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

namespace NationsSingleAPIRoute {}

@api.route('/nations/:name')
class NationsSingleAPIRoute extends api.Route<{
	Params: {
		name: string
	}
}> {
	declare nation: TownyNationWithBalance

	get nation_name() {
		return this.request.params.name
	}

	async middleware() {
		try {
			this.nation = await TownyNationWithBalance.findOneOrFail({
				name: this.nation_name
			})
		} catch (e) {
			return new ServerError('nation not found', 404)
		}
	}

	@api.endpoint
	get() {
		return this.nation
	}

	@api.endpoint('get', '/residents')
	async getResidents() {
		try {
			const [items, total] = await TownyResident.findAndCount({
				where: {
					nation: TownyNationWithBalance.getId(this.nation)
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

export default NationsSingleAPIRoute
