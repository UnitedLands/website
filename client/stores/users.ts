import { ClientStore, defineStore } from '@client'
import { useAPI } from '@client/modules/api'
import UsersAPIRoute from '@server/api/users'
import { UserData } from '@server/database/models/User'
import { merge } from 'lodash'
import { ComputedRef, inject, provide, Ref } from 'vue'

declare module '@client' {
	export interface ClientState {
		users: UsersState
	}
}

export interface UsersState {
	items: UserData[]
}

export class UsersStore extends ClientStore('users') {
	api = useAPI()

	add(items: UserData | UserData[]) {
		if (!Array.isArray(items)) items = [items]

		for (const item of items) {
			const existing = this.state.items.find(i => i.name === item.name)
			if (existing) merge(existing, item)
			else this.state.items.push(item)
		}
	}

	get(name: string): Promise<UserData> {
		return new Promise<UserData>(async (resolve, reject) => {
			const existing = this.state.items.find(user => user.name === name)
			if (existing) resolve(existing)

			try {
				const { data: user } = await this.api.get<UserData>(`users/${name}`)
				this.add(user)
				return resolve(user)
			} catch (e) {
				reject(e)
			}
		})
	}

	async list(params?: Partial<UsersAPIRoute.Query>) {
		const { data } = await this.api.get<{
			total: number
			items: UserData[]
		}>('users', { params })

		this.add(data.items)

		return data
	}

	async create(data: Partial<UserData>) {
		const { data: user } = await this.api.post<UserData>('users', data)

		this.add(user)
		return user
	}
}

export function useUsers() {
	return new UsersStore()
}

export function provideUser(user: ComputedRef<UserData | null> | Ref<UserData | null>) {
	return provide('user', user)
}

export function injectUser() {
	return inject('user') as ComputedRef<UserData | null> | Ref<UserData | null>
}

export default defineStore(state => {
	if (!state.users)
		state.users = {
			items: []
		}
})
