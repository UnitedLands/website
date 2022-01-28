import { TypedObject } from '@lib/types/TypedObject'
import { SharedContext } from 'vite-ssr/utils/types'
import { App, ComputedRef, inject, Ref } from 'vue'
import { Router } from 'vue-router'

export const DIE = Symbol('cache-die')

export interface ClientState {}

export interface ClientContext extends SharedContext {
	router: Router
	app: App
}

export const defineModule = (def: (context: ClientContext) => void | Promise<void>) => def
export const definePlugin = (def: (context: ClientContext) => void | Promise<void>) => def
export const defineStore = (
	def: (this: Omit<ClientContext, 'initalState' | 'state'>, state: ClientState) => void
) => def

export function ClientStore<Namespace extends keyof ClientState>(namespace: Namespace) {
	return class Store {
		private _global = inject('state') as ClientState

		get state() {
			return this._global[namespace]
		}

		set state(v) {
			this._global[namespace] = v
		}
	}
}

export type ProvidedStoreItem<Thing> = Ref<Thing | undefined> | ComputedRef<Thing | undefined>
