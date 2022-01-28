import { TownyResidentWithBalance } from '@server/database/models/Towny/Resident'
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
		} catch (e) {
			return new ServerError('resident not found', 404)
		}
	}

	@api.endpoint
	get() {
		this.reply.header('cache-control', 'public, max-age=7200')
		return this.resident
	}
}

export default ResidentsSingleAPIRoute
