import { ClientContext, ClientState } from '@client'
import date from '@lib/utils/date'
import is from '@lib/utils/is'
import { merge } from 'lodash'
import { inject, reactive, UnwrapNestedRefs } from 'vue'

declare module '@client' {
	export interface ClientContext {
		state: UnwrapNestedRefs<ClientState>
	}
}

function loadCachedState(context: ClientContext) {
	const cachedState = localStorage.getItem('ul_state')
	if (!cachedState) return

	let parsedState: any
	try {
		parsedState = JSON.parse(cachedState)

		if (!parsedState.state || !parsedState.die) {
			console.warn('cached state is missing properties... clearing')
			localStorage.removeItem('ul_state')
			return
		} else if (Date.now() > Number(parsedState.die) || isNaN(Number(parsedState.die))) {
			console.info('stale state, clearing')
			localStorage.removeItem('ul_state')
			return
		}

		merge(context.initialState, parsedState.state)
		console.log('loaded state from cache', parsedState.state)
	} catch (error) {
		console.error(error)
	}
}

export async function createState(context: ClientContext) {
	if (context.isClient) {
		loadCachedState(context)
		window.addEventListener('beforeunload', function () {
			console.log('unload')
			delete (context.state as any).auth
			localStorage.setItem(
				'ul_state',
				JSON.stringify({
					state: context.state,
					die: date()
						.add(date.duration({ minutes: 60 }))
						.valueOf()
				})
			)
		})
	}

	const stores = import.meta.globEager('../stores/*.ts')
	context.state = reactive(context.initialState) as any

	for (const { default: store } of Object.values(stores)) {
		if (!store || !is.aFunction(store)) continue
		await store.call(context, context.state)
	}

	context.app.config.globalProperties.$state = context.state
	context.app.provide('state', context.state)
}

export function useState() {
	return inject('state') as ClientState
}
