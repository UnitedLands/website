import { ClientStore, defineStore, ProvidedStoreItem } from '@client'
import { useAPI } from '@client/modules/api'
import date from '@lib/utils/date'
import NationsAPIRoute from '@server/api/nations'
import { TownyNationData } from '@server/database/models/Towny/Nation'
import { merge } from 'lodash'
import { inject, provide, ref } from 'vue'

declare module '@client' {
	export interface ClientState {
		nations: NationsState
	}
}

export interface NationsState {
	items: TownyNationData[]
}

export class NationsStore extends ClientStore('nations') {
	api = useAPI()

	add<Items extends TownyNationData | TownyNationData[]>(items: Items): Items {
		let i: TownyNationData[]
		if (!Array.isArray(items)) i = [items]
		else i = items

		for (const item of i) {
			const existing = this.state.items.find(nation => nation.name === item.name)
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
		return new Promise<TownyNationData>(async resolve => {
			const existing = this.get(name)
			if (existing) {
				if (cache && (existing as any).__die) {
					const fetchedAt = new Date((existing as any).__die)
					if (Date.now() < fetchedAt.valueOf()) return resolve(existing)
				}
			}

			const { data } = await this.api.get<TownyNationData>(`nations/${name}`)

			if (cache) (data as any).__die = date().add(60, 'minutes').valueOf()
			return resolve(this.add(data))
		})
	}

	async list(params: NationsAPIRoute.Query = {}) {
		const { data } = await this.api.get<{
			total: number
			items: TownyNationData[]
		}>('nations', { params })

		data.items = this.add(data.items)
		return data
	}
}

export function useNations() {
	return new NationsStore()
}

export function provideNation(nation: ProvidedStoreItem<TownyNationData>) {
	return provide('nation', nation)
}

export function injectNation() {
	return inject('nation', ref()) as ProvidedStoreItem<TownyNationData>
}

export default defineStore(state => {
	if (!state.nations)
		state.nations = {
			items: []
		}
})
