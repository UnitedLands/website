import helpers from '@lib/utils/helpers'
import Post, { PostData } from '@server/database/models/Post'
import User from '@server/database/models/User'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'
import authed from '@server/middleware/authed'
import { isNumber } from 'lodash'
import { FindManyOptions } from 'typeorm'

namespace PostsAPIRoute {
	export type Params = {
		uuid: string
	}

	export type Body = Pick<PostData, 'content' | 'title' | 'deleted'>

	export type Query = {
		page?: number
		limit?: number
		author?: string
		withDeleted?: boolean
	}
}

@api.route('/posts')
class PostsAPIRoute extends api.Route<{
	Params: PostsAPIRoute.Params
	Body: PostsAPIRoute.Body
	Querystring: PostsAPIRoute.Query
}> {
	get uuid() {
		return this.request.params.uuid
	}

	get body() {
		return helpers.extract(this.request.body, ['content', 'title', 'deleted'])
	}

	get query() {
		return helpers.extract(this.request.query, ['author'])
	}

	get page() {
		const pageQuery = Number(this.request.query.page)
		const page = !isNaN(pageQuery) ? pageQuery : 0

		if (page < 0) return 0
		return page !== 1 ? page : 0
	}

	get limit() {
		const limit = Number(this.request.query.limit)
		if (isNaN(limit)) return 10
		if (limit && limit > 50) return 50
		return limit ?? 10
	}

	get withDeleted() {
		return Boolean(this.request.query.withDeleted) ?? false
	}

	get findOptions(): FindManyOptions<Post> {
		const isAdmin = !!this.authed?.roles.find(role => role.name === 'admin')
		const where = this.query
		let withDeleted = this.withDeleted

		// checks if withDeleted is enabled and if the user is authed. bypassed if user is a admin
		if (withDeleted && !isAdmin)
			if (this.authed) where.author = this.authed.name
			else withDeleted = false

		return {
			where,
			withDeleted,
			take: this.limit,
			skip: this.page * this.limit,
			order: {
				created: 'DESC'
			}
		}
	}

	@api.endpoint
	async get() {
		const options = this.findOptions
		console.log(options)
		const results = await Post.findAndCount(options)

		if (!results[0].length) return new ServerError('page not found', 404)
		return {
			total: results[1],
			items: results[0]
		}
	}

	@api.endpoint
	@api.use([authed])
	post() {
		return Post.create(this.body)
			.assign({
				author: this.authed!
			})
			.save()
	}

	@api.endpoint('patch', '/:uuid')
	@api.use([authed])
	async update() {
		const isAdmin = !!this.authed?.roles.find(role => role.name === 'admin')
		try {
			const post = await Post.findOneOrFail(this.uuid, { relations: ['author'], withDeleted: true })

			if (this.authed?.name !== post.author?.name && !isAdmin)
				return new ServerError('unauthorized to update post', 401)

			post.assign(this.body)

			return await post.save()
		} catch (e) {
			console.log(e)
			return new ServerError('unexpected error')
		}
	}

	@api.endpoint('delete', '/:uuid')
	@api.use([authed])
	async delete() {
		const isAdmin = !!this.authed?.roles.find(role => role.name === 'admin')
		try {
			const post = await Post.findOneOrFail(this.uuid, { relations: ['author'] })

			if (this.authed?.name !== post.author?.name && !isAdmin)
				return new ServerError('unauthorized to update post', 401)

			await post.remove()
			return true
		} catch (e) {
			console.log(e)
			return new ServerError('unexpected error')
		}
	}

	@api.endpoint('delete', '/:uuid/trash')
	@api.use([authed])
	async trash() {
		const isAdmin = !!this.authed?.roles.find(role => role.name === 'admin')
		try {
			const post = await Post.findOneOrFail(this.uuid, { relations: ['author'] })

			if (this.authed?.name !== post.author?.name && !isAdmin)
				return new ServerError('unauthorized to update post', 401)

			return await post.softRemove()
		} catch (e) {
			console.log(e)
			return new ServerError('unexpected error')
		}
	}
}

export default PostsAPIRoute
