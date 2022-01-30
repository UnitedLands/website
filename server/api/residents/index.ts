import helpers from '@lib/utils/helpers'
import { TownyResidentWithBalance } from '@server/database/models/Towny/Resident'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'
import { FindCondition, FindManyOptions, Like } from 'typeorm'

namespace ResidentsAPIRoute {
	export type Query = {
		town?: string
		idsOnly?: boolean
		limit?: number
		page?: number
		name?: string
		search?: string
	}
}

@api.route('/residents')
class ResidentsAPIRoute extends api.Route<{
	Querystring: ResidentsAPIRoute.Query
}> {
	get query() {
		return helpers.extract(this.request.query, [
			'town',
			'idsOnly',
			'limit',
			'page',
			'name',
			'search'
		])
	}

	get idsOnly() {
		return Boolean(this.query.idsOnly ?? false)
	}

	get limit() {
		const limit = Number(this.query.limit)
		return isNaN(limit) ? 10 : limit <= 50 ? limit : 50
	}

	get page() {
		const page = Number(this.query.page)
		return isNaN(page) ? 0 : page <= 1 ? 0 : page
	}

	get findWhere() {
		const query = helpers.extract(this.query, ['town', 'name', 'search'])
		const where: FindCondition<TownyResidentWithBalance> = {}

		if (query.town) where.town = query.town
		if (query.name) where.name = query.name
		if (query.search) where.name = Like(`%${query.search}%`)

		return where
	}

	get findOptions() {
		const where = this.findWhere
		const opts: FindManyOptions<TownyResidentWithBalance> = {
			where,
			order: {
				balance: 'DESC'
			},
			skip: this.page * this.limit,
			take: this.limit
		}

		if (this.idsOnly) opts.select = ['name']

		return opts
	}

	@api.endpoint
	async get() {
		try {
			const opts = this.findOptions
			const [items, total] = await TownyResidentWithBalance.findAndCount(opts)

			if (!items.length) return new ServerError('no more residents', 404)
			this.reply.header('cache-control', 'public, max-age=43200')
			return { total, items }
		} catch (error) {
			this.console.error(error)
			return new ServerError('unexpected error')
		}
	}
}

export default ResidentsAPIRoute
