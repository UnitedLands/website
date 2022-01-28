import FilesAPIRoute from '@server/api/files'
import Post from '@server/database/models/Post'
import User from '@server/database/models/User'
import UserAvatar from '@server/database/models/UserAvatar'
import UserBanner from '@server/database/models/UserBanner'
import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

@api.route('/users/:name')
export default class SingleUserAPIRoute extends api.Route<{
	Params: {
		name: string
	}
}> {
	declare user: User

	get username() {
		return this.request.params.name
	}

	async middleware() {
		try {
			this.user = await User.findOneOrFail(this.username)
		} catch (e) {
			return new ServerError('user not found', 404)
		}
	}

	@api.endpoint
	get() {
		return this.user
	}

	@api.endpoint('get', '/posts')
	async getPosts() {
		try {
			const results = await Post.findAndCount({
				where: {
					author: User.getId(this.user)
				}
			})

			return {
				total: results[1],
				items: results[0]
			}
		} catch (e) {
			this.console.error(e)
			return new ServerError('expected error listing user posts')
		}
	}

	@api.endpoint('post', '/avatar')
	async uploadAvatar() {
		const uploader = new FilesAPIRoute(this.request, this.reply, UserAvatar)

		try {
			let file = await uploader.upload()
			if (Array.isArray(file)) file = file[0]

			this.user.avatar = file
			return await this.user.save()
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error uploading avatar')
		}
	}

	@api.endpoint('post', '/banner')
	async uploadBanner() {
		const uploader = new FilesAPIRoute(this.request, this.reply, UserBanner)

		try {
			let file = await uploader.upload()
			if (Array.isArray(file)) file = file[0]

			this.user.banner = file
			return await this.user.save()
		} catch (e) {
			this.console.error(e)
			return new ServerError('unexpected error uploading avatar')
		}
	}
}
