/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
import is from '@lib/utils/is'
import Logger from '@lib/utils/Logger'
import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyReply,
	FastifyRequest,
	RouteHandler,
	RouteOptions,
	RouteShorthandOptionsWithHandler
} from 'fastify'
import type { RouteGenericInterface } from 'fastify/types/route'
import _ from 'lodash'

module api {
	export type METHODS = 'post' | 'patch' | 'delete' | 'put' | 'get' | 'head'

	type RH<
		RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
		Context extends object = any
	> =
		| OmitThisParameter<RouteHandler<RouteGeneric, any, any, any, Context>>
		| RouteShorthandOptionsWithHandler<any, any, any, RouteGeneric, Context>

	type FastHookKeys = 'onError' | 'onRequest' | 'onResponse' | 'onSend' | 'onTimeout'
	type FastHooks = Pick<RouteOptions, FastHookKeys>

	export type MiddlewareDefinition<Hook extends FastHookKeys = FastHookKeys> =
		| FastHooks
		| FastHooks[Hook]

	export interface RouteSchema {
		context: any
		get: RouteGenericInterface
		post: RouteGenericInterface
		patch: RouteGenericInterface
		put: RouteGenericInterface
		delete: RouteGenericInterface
	}

	export interface RouteDefinition<RDefs extends RouteSchema = RouteSchema> {
		install?: (this: RDefs['context'], instance: FastifyInstance) => Promise<void> | void
		get?: RH<RDefs['get'], RDefs['context']>
		post?: RH<RDefs['post'], RDefs['context']>
		patch?: RH<RDefs['patch'], RDefs['context']>
		put?: RH<RDefs['put'], RDefs['context']>
		delete?: RH<RDefs['delete'], RDefs['context']>
	}

	export const definePlugin = (plugin: FastifyPluginAsync) => plugin

	export function defineMiddleware<Hook extends FastHookKeys>(
		def: MiddlewareDefinition<Hook>,
		hook?: Hook
	) {
		if (is.aFunction(def) && is.Undefined(hook)) {
			throw new Error('Can not create middleware, missing hook in definition')
		} else if (typeof def === 'function' && hook) {
			def = {
				[hook]: [def]
			}
		} else if (is.aObject(def)) {
			for (const [key, value] of Object.entries(def)) {
				if (is.notaArray(value)) (def as any)[key] = [value]
			}
		}

		return def
	}

	export function withMiddleware<H extends RH>(handler: H, middlewares: MiddlewareDefinition[]): H {
		let config: MiddlewareDefinition = {}

		for (const middleware of middlewares) {
			config = _.merge(config, middleware)
		}

		if (is.aFunction(handler)) {
			return {
				...config,
				handler
			} as any
		} else {
			return _.merge(handler, config) as any
		}
	}

	export function defineRoute<RDefs extends RouteSchema = RouteSchema>(
		route: string,
		def: RouteDefinition<RDefs> & ThisType<RDefs['context']>,
		context: RDefs['context'] = {} as any
	) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return async (instance: FastifyInstance, _opts?: any) => {
			instance.decorate('context', context)
			if (is.aFunction(def?.install)) {
				try {
					await def.install.call(context, instance)
					delete def.install
				} catch {
					return
				}
			}

			for (const [method, handler] of Object.entries(def)) {
				let opts: RouteOptions
				if (is.aFunction(handler)) {
					opts = {
						url: route,
						method: method.toUpperCase() as any,
						handler: (...args: any[]) => handler.apply(context, args)
					}
				} else {
					if (is.aFunction(handler.handler)) {
						const oldHandler = handler.handler
						handler.handler = (...args: any[]) => oldHandler.apply(context, args)
					}

					opts = {
						url: route,
						method: method.toUpperCase() as any,
						...handler
					}
				}

				instance.route(opts)
			}
		}
	}

	export function route(url: string): any {
		return (Class: any) => {
			Class.register = async (instance: FastifyInstance) => {
				if (is.aFunction(Class.install)) {
					await Class.install(instance)
				}

				const t = new Class()
				const opts = Reflect.getMetadata('api', t)
				if (!opts) return

				// fuckers need to check both variables
				// eslint-disable-next-line prefer-const
				for (let [actor, route] of Object.entries<any>(opts)) {
					if (Class.middleware) route = withMiddleware(route, Class.middleware)
					route.url = `${url}${route.url}`

					route.handler = async function (...args: any[]) {
						const controller = new Class(...args)

						if (controller.middleware) {
							if (is.aFunction(controller.middleware)) await controller.middleware()
							else if (is.aArray(controller.middleware))
								for (const middleware of controller.middleware) {
									if (is.aFunction(middleware)) await middleware.call(controller)
								}
						}

						return controller[actor]()
					}

					instance.route(route as any)
				}
			}

			return Class
		}
	}

	export function endpoint(t: object, prop: METHODS): any
	export function endpoint(
		method: METHODS,
		route?: string | RouteOptions
	): (t: any, prop: any) => any
	export function endpoint(method?: METHODS | object, route: string | RouteOptions = '') {
		const dec = (m: METHODS) => (t: any, prop: any) => {
			const proto = t
			const opts: any = Reflect.getMetadata('api', proto) ?? {}

			if (!opts[prop]) opts[prop] = {}
			opts[prop].method = m.toUpperCase()

			if (is.aString(route)) {
				opts[prop].url = route
			} else opts[prop] = route

			Reflect.defineMetadata('api', opts, proto)
		}

		if (typeof method === 'string') return dec(method)
		else if (method && typeof route === 'string') {
			const target = method
			method = route as any
			route = ''
			return dec(method as any)(target, method)
		}
		return (t: any, prop: METHODS) => dec(prop)(t, prop)
	}

	export function use(middleware: MiddlewareDefinition[]): MethodDecorator {
		return (t, prop) => {
			const proto = t
			const opts: any = Reflect.getMetadata('api', proto) ?? {}

			if (!opts[prop]) opts[prop] = {}
			opts[prop] = withMiddleware(opts[prop], middleware)

			Reflect.defineMetadata('api', opts, proto)
		}
	}

	export abstract class Route<RG extends RouteGenericInterface = RouteGenericInterface> {
		// console = new Logger(this.constructor.name)

		protected get session() {
			return this.request.session
		}

		protected get authed() {
			return this.session.data?.auth?.current ?? null
		}

		protected get console() {
			return this.request.log
		}

		constructor(
			protected request: FastifyRequest<RG>,
			protected reply: FastifyReply<any, any, any, RG>
		) {}
	}
}

export default api
