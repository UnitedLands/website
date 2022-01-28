import { ClientStore, defineStore, ProvidedStoreItem } from '@client'
import { useAPI } from '@client/modules/api'
import date from '@lib/utils/date'
import TownsAPIRoute from '@server/api/towns'
import { TownyTownData } from '@server/database/models/Towny/Town'
import { merge } from 'lodash'
import { inject, provide } from 'vue'

declare module '@client' {
	export interface ClientState {
		towns: TownsState
	}
}

export interface TownsState {
	items: TownyTownData[]
}

export class TownsStore extends ClientStore('towns') {
	api = useAPI()

	add<Items extends TownyTownData | TownyTownData[]>(items: Items): Items {
		let i: TownyTownData[]
		if (!Array.isArray(items)) i = [items]
		else i = items

		for (const item of i) {
			const existing = this.state.items.find(town => town.name === item.name)
			if (existing) merge(existing, item)
			else this.state.items.push(item)
		}

		if (!Array.isArray(items)) return this.get(items.name) as any
		else {
			const names = items.map(item => item.name)
			return this.state.items.filter(item => names.includes(item.name)) as any
		}
	}

	get(name: string) {
		return this.state.items.find(item => item.name === name)
	}

	fetch(name: string, cache = true) {
		return new Promise<TownyTownData>(async resolve => {
			const existing = this.get(name)
			if (existing) {
				if (cache && (existing as any).__die) {
					const fetchedAt = new Date((existing as any).__die)
					if (Date.now() < fetchedAt.valueOf()) return resolve(existing)
				}
			}

			const { data } = await this.api.get<TownyTownData>(`towns/${name}`)

			if (cache)
				(data as any).__die = date()
					.add(date.duration({ hours: 1 }))
					.valueOf()
			return resolve(this.add(data))
		})
	}

	async list(params: TownsAPIRoute.Query = {}) {
		const { data } = await this.api.get<{
			total: number
			items: TownyTownData[]
		}>('towns', { params })

		data.items = this.add(data.items)
		return data
	}
}

export function useTowns() {
	return new TownsStore()
}

export function provideTown(town: ProvidedStoreItem<TownyTownData>) {
	return provide('town', town)
}

export function injectTown() {
	return inject('town') as ProvidedStoreItem<TownyTownData>
}

export default defineStore(state => {
	if (!state.towns)
		state.towns = {
			items: []
		}
})
