import { ClientStore, defineStore, DIE, ProvidedStoreItem } from '@client'
import { useAPI } from '@client/modules/api'
import date from '@lib/utils/date'
import ResidentsAPIRoute from '@server/api/residents'
import { TownyResidentData, TownyResidentWithKDData } from '@server/database/models/Towny/Resident'
import { defaults, merge } from 'lodash'
import { inject, provide, reactive } from 'vue'

declare module '@client' {
	export interface ClientState {
		residents: ResidentsState
	}
}

export interface ResidentsState {
	items: TownyResidentData[]
	kd: {
		[name: string]: TownyResidentWithKDData
	}
}

export class ResidentsStore extends ClientStore('residents') {
	api = useAPI()

	add<Items extends TownyResidentData | TownyResidentData[]>(items: Items): Items {
		let i: TownyResidentData[]
		if (!Array.isArray(items)) i = [items]
		else i = items

		for (const item of i) {
			const existing = this.get(item.name)
			if (existing) merge(existing, item)
			else this.state.items.push(item)
		}

		if (!Array.isArray(items)) return this.get(items.name) as Items
		const names = items.map(i => i.name)
		return this.state.items.filter(i => names.includes(i.name)) as Items
	}

	get(name: string) {
		return this.state.items.find(item => item.name === name)
	}

	// removes item from state
	release(name: string) {
		const index = this.state.items.findIndex(item => item.name === name)
		if (index > -1) delete this.state.items[index]
	}

	fetch(name: string, cache = true) {
		return new Promise<TownyResidentData>(async resolve => {
			const existing = this.get(name)
			if (existing) {
				if (cache && (existing as any).__die) {
					const fetchedAt = new Date((existing as any).__die)
					if (Date.now() < fetchedAt.valueOf()) return resolve(existing)
				}
			}

			const { data } = await this.api.get(`residents/${name}`)

			if (cache) {
				const d = data as any

				d.__die = date()
					.add(date.duration({ hours: 1 }))
					.valueOf()
			}
			return resolve(this.add(data))
		})
	}

	async list(params: ResidentsAPIRoute.Query = {}) {
		const { data } = await this.api.get<{
			total: number
			items: TownyResidentData[]
		}>('residents', { params })

		data.items = this.add(data.items)

		return data
	}

	async fetchKD(name: string) {
		const existing = this.state.kd[name]
		if (existing) return Promise.resolve(existing)

		const { data } = await this.api.get<{
			uuid: string
			kills: number
			deaths: number
		}>(`residents/${name}/killsdeaths`)

		this.state.kd[name] = reactive(data)
		return data
	}
}

export function useResidents() {
	return new ResidentsStore()
}

export function provideResident(item: ProvidedStoreItem<TownyResidentData>) {
	return provide('resident', item)
}

export function injectResident() {
	return inject('resident') as ProvidedStoreItem<TownyResidentData>
}

export default defineStore(state => {
	state.residents = defaults(state.residents ?? {}, {
		items: [],
		kd: {}
	})
})
