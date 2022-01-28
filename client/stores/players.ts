import { ClientStore, defineStore, ProvidedStoreItem } from '@client'
import { useAPI } from '@client/modules/api'
import PlayersAPIRoute from '@server/api/players'
import { PlayerData } from '@server/database/models/Player'
import { merge } from 'lodash'
import { inject, provide } from 'vue'

declare module '@client' {
	export interface ClientState {
		players: PlayersState
	}
}

export interface PlayersState {
	items: PlayerData[]
}

export class PlayersStore extends ClientStore('players') {
	api = useAPI()

	add(items: PlayerData | PlayerData[]) {
		if (!Array.isArray(items)) items = [items]

		for (const item of items) {
			const existing = this.state.items.find(player => player.uid === item.uid)
			if (existing) merge(existing, item)
			else this.state.items.push(item)
		}
	}

	async list(params: PlayersAPIRoute.Query = {}) {
		const { data } = await this.api.get<{
			total: number
			items: PlayerData[]
		}>('players', { params })

		this.add(data.items)
		return data
	}
}

export function usePlayers() {
	return new PlayersStore()
}

export function providePlayer(player: ProvidedStoreItem<PlayerData>) {
	return provide('player', player)
}

export function injectPlayer() {
	return inject('player') as ProvidedStoreItem<PlayerData>
}

export default defineStore(state => {
	if (!state.players)
		state.players = {
			items: []
		}
})
