import { ClientContext, defineModule } from '@client'
import is from '@lib/utils/is'
import { RouteLocationNormalized } from 'vue-router'

type RedirectObject = { location: string; status?: number }

type RedirectFunc = (re: RedirectObject) => void

export type Middleware = (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	context: ClientContext,
	redirect: RedirectFunc
) => Promise<any>

export const defineMiddleware = <T extends Middleware>(middleware: T) => middleware

export default defineModule(async context => {
	const middleware: Record<string, Middleware> = {}

	for (const [fp, im] of Object.entries(import.meta.glob('../middleware/*.ts'))) {
		const regx = /.*\/(?<name>.*)\.ts$/g
		const name = regx.exec(fp)?.groups?.name
		const i = await im()

		if (!name || !i?.default) continue
		middleware[name] = i.default
	}

	context.router.beforeEach(async function (to, from, next) {
		const middlewares: string[] = []

		if (is.aArray(to.meta?.middleware)) {
			middlewares.push(...to.meta.middleware)
		}

		for (const mid of middlewares) {
			if (is.notaString(mid) || is.Undefined(middleware[mid])) {
				console.warn('unable to run middleware', mid)
				continue
			}

			try {
				await new Promise((resolve, reject) => {
					return middleware[mid](to, from, context, reject as any).then(resolve)
				})
			} catch (e) {
				console.log(e)
				if (is.aObject(e) && e.location) {
					context.redirect(e.location, e?.status)
					return next(e.location)
				}
				return next(e as any)
			}
		}

		if (context.isClient && is.aString(to.meta.title)) {
			document.title = to.meta.title
		}

		return next()
	})
})
