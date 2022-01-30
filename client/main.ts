import viteSSR, { ClientOnly } from 'vite-ssr'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'
import is from '@lib/utils/is'
import { createHead } from '@vueuse/head'
import { ClientContext } from '@client'
import { createState } from '@client/includes/state'
import { useRegisterSW } from 'virtual:pwa-register/vue'

// if (!import.meta.env.SSR) {
// 	useRegisterSW({
// 		immediate: true,
// 		onRegistered(d) {
// 			console.log(d)
// 		},
// 		onRegisterError(error) {
// 			console.log(error)
// 		}
// 	})
// }

const routes = setupLayouts(generatedRoutes)

for (const route of routes) {
	const c = route.component as any

	// if (c.ssrRender) {
	// 	const oldRender = c.ssrRender
	// 	c.ssrRender = function (...args: any[]) {
	// 		return oldRender.apply(this, args)
	// 	}
	// }

	if (is.Undefined(c)) continue
	if (is.Undefined(route.meta)) route.meta = {}
	if (is.aObject(c.meta)) {
		route.meta = {
			...c.meta,
			...route.meta
		}
	}
}

async function loadModules(context: ClientContext) {
	const modules = import.meta.globEager('./modules/*.ts')

	for (const [mpath, module] of Object.entries(modules)) {
		console.debug(`loading module ${mpath}`)
		if (is.aFunction(module?.default)) await module.default(context)
		else if (is.aFunction(module?.install)) await module.install(context)
		else console.warn(`${mpath} is missing a install function, skipping`)
	}
}

async function loadPlugins(context: ClientContext) {
	const plugins = import.meta.globEager('./plugins/*.ts')

	for (const [ppath, plugin] of Object.entries(plugins)) {
		console.debug(`loading plugin ${ppath}`)
		if (is.aFunction(plugin)) await plugin(context)
		else if (is.aFunction(plugin?.install)) await plugin.install(context)
		else console.warn(`${ppath} is missing a install function, skipping`)
	}
}

export default viteSSR(
	App,
	{
		routes
	},
	async (c: any) => {
		const context = c as ClientContext
		const head = createHead()
		context.app.component(ClientOnly)

		await loadModules(context)
		await createState(context)

		await loadPlugins(context)

		return { head }
	}
)
