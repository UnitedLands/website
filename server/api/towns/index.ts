import helpers from '@lib/utils/helpers'
import { TownyTownWithBalance } from '@server/database/models/Towny/Town'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'
import { FindCondition, FindManyOptions } from 'typeorm'

namespace TownsAPIRoute {
	export type Query = {
		limit?: number
		page?: number
		idsOnly?: boolean
		nation?: string
	}
}

@api.route('/towns')
class TownsAPIRoute extends api.Route<{
	Querystring: TownsAPIRoute.Query
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
		return this.page <= 0 ? 0 : (this.page - 1) * this.take
	}

	get idsOnly() {
		return Boolean(this.request.query.idsOnly ?? false)
	}

	get findWhere() {
		const query = helpers.extract(this.request.query, ['nation'])
		const where: FindCondition<TownyTownWithBalance> = {}

		if (query.nation) where.nation = query.nation

		return where
	}

	get findOptions() {
		const opts: FindManyOptions<TownyTownWithBalance> = {
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
			const [items, total] = await TownyTownWithBalance.findAndCount(opts)

			if (!items.length) return new ServerError('no more items', 404)
			this.reply.header('cache-control', 'public, max-age=43200')
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

export default TownsAPIRoute
