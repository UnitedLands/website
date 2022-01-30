import {
	TownyResidentWithBalance,
	TownyResidentWithFavoriteWeapon,
	TownyResidentWithKD
} from '@server/database/models/Towny/Resident'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

namespace ResidentsSingleAPIRoute {}

@api.route('/residents/:name')
class ResidentsSingleAPIRoute extends api.Route<{
	Params: {
		name: string
	}
}> {
	declare resident: TownyResidentWithBalance

	get resident_name() {
		return this.request.params.name
	}

	async middleware() {
		try {
			this.resident = await TownyResidentWithBalance.findOneOrFail({
				where: {
					name: this.resident_name
				}
			})

			this.reply.header('cache-control', 'public, max-age=43200')
		} catch (e) {
			throw new ServerError('resident not found', 404)
		}
	}

	@api.endpoint
	get() {
		return this.resident
	}

	@api.endpoint('get', '/killsdeaths')
	async getKD() {
		try {
			const kd = await TownyResidentWithKD.findOneOrFail({
				where: {
					uuid: this.resident.uuid
				}
			})

			kd.favorite = await TownyResidentWithFavoriteWeapon.findOne({
				where: {
					uuid: this.resident.uuid
				},
				order: {
					kills: 'DESC'
				}
			})

			return kd
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error')
		}
	}
}

export default ResidentsSingleAPIRoute
