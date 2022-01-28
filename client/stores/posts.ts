import { ClientStore, defineStore } from '@client'
import { useAPI } from '@client/modules/api'
import PostsAPIRoute from '@server/api/posts'
import { PostData } from '@server/database/models/Post'
import { merge, uniqBy } from 'lodash'
import { ComputedRef, inject, provide, Ref } from 'vue'

declare module '@client' {
	export interface ClientState {
		posts: PostsState
	}
}

export interface PostsState {
	items: PostData[]
}

export class PostsStore extends ClientStore('posts') {
	protected api = useAPI()

	addPosts(items: PostData | PostData[]) {
		if (!Array.isArray(items)) items = [items]

		for (const item of items) {
			const existing = this.state.items.find(i => i.uuid === item.uuid)

			if (!item.deleted) item.deleted = null

			if (existing) merge(existing, item)
			else this.state.items.push(item)
		}
	}

	async fetch(params: PostsAPIRoute.Query = {}) {
		const res = await this.api.get<{
			total: number
			items: PostData[]
		}>('posts', { params })
		const items = res.data.items

		this.addPosts(items)

		return res.data
	}

	async listByUser(name: string, params: PostsAPIRoute.Query = {}) {
		params.author = name

		const { data } = await this.api.get<{
			total: number
			items: PostData[]
		}>('posts', { params })
		const items = data.items

		this.addPosts(items)
		return data
	}

	async create(data: Partial<PostData>) {
		const res = await this.api.post<PostData>('posts', data)
		const item = res.data

		this.addPosts(item)
		return item
	}

	async update(data: PostData) {
		const res = await this.api.patch<PostData>(`posts/${data.uuid}`, data)
		const item = res.data

		this.addPosts(item)
		return item
	}

	async delete(post: PostData) {
		await this.api.delete(`posts/${post.uuid}`)
		this.state.items = this.state.items.filter(p => p.uuid !== post.uuid)
	}

	async trash(post: PostData) {
		const { data } = await this.api.delete<PostData>(`posts/${post.uuid}/trash`)

		console.log(data)
		this.addPosts(data)
		return data
	}

	restore(post: PostData) {
		post.deleted = null
		return this.update(post)
	}
}

export function usePosts() {
	return new PostsStore()
}

export function providePost(post: ComputedRef<PostData> | Ref<PostData>) {
	return provide('post', post)
}

export function injectPost() {
	return inject('post') as ComputedRef<PostData> | Ref<PostData>
}

export default defineStore(state => {
	if (!state.posts)
		state.posts = {
			items: []
		}
})
