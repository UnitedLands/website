import { TownyNationWithBalance } from '@server/database/models/Towny/Nation'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'
import { FindManyOptions } from 'typeorm'

namespace NationsAPIRoute {
	export type Query = {
		limit?: number
		page?: number
		idsOnly?: boolean
	}
}

@api.route('/nations')
class NationsAPIRoute extends api.Route<{
	Querystring: NationsAPIRoute.Query
}> {
	get limit() {
		const limit = Number(this.request.query.limit)
		return isNaN(limit) ? 10 : limit
	}

	get page() {
		const page = Number(this.request.query.page)
		return isNaN(page) ? 0 : page
	}

	get take() {
		return this.limit <= 10 ? this.limit : 10
	}

	get skip() {
		return this.page === 1 ? 0 : this.page * this.take
	}

	get idsOnly() {
		return Boolean(this.request.query.idsOnly ?? false)
	}

	get findWhere() {
		return {}
	}

	get findOptions() {
		const opts: FindManyOptions<TownyNationWithBalance> = {
			where: this.findWhere,
			skip: this.skip,
			take: this.take,
			order: {
				balance: 'DESC'
			}
		}

		if (this.idsOnly) opts.select = ['name', 'balance']

		return opts
	}

	@api.endpoint
	async get() {
		try {
			const opts = this.findOptions
			const [items, total] = await TownyNationWithBalance.findAndCount(opts)

			if (!items.length) return new ServerError('no more items', 404)
			return {
				total,
				items
			}
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error')
		}
	}
}

export default NationsAPIRoute
