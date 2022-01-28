import fs from 'fs'
import path from 'path'
import api from '@server/includes/api'
import fastifyStatic from 'fastify-static'
import { resolveFromCWD } from '@server/includes/functions'

const dist = resolveFromCWD('dist')

interface Schema extends api.RouteSchema {
	context: {
		render: (
			url: string,
			opts: {
				manifest: any
				request: any
				response: any
				preload: boolean
				[index: string]: any
			}
		) => Promise<{
			html: string
			status: number
			statusText: string
			headers: any
		}>
		manifest: any
	}
}

export default api.definePlugin(async function (instance) {
	const route = api.defineRoute<Schema>('/*', {
		async install(instance) {
			const stats = fs.statSync(dist)
			if (!stats.isDirectory) throw new Error('missing dist directory')

			const serverPkg = await import(path.resolve(dist, 'server/package.json'))
			const { default: render } = await import(path.resolve(dist, 'server', serverPkg.main))

			this.render = render
			this.manifest = await import(path.resolve(dist, 'client/ssr-manifest.json'))

			instance.register(fastifyStatic, {
				root: path.resolve(dist, 'client'),
				wildcard: false,
				decorateReply: false,
				allowedPath(pathname, root) {
					return !pathname.includes('ssr-manifest.json')
				}
			})
		},
		async get(request, reply) {
			const url = `${request.protocol}://${request.hostname}${request.url}`
			console.log(request.url)

			const results = await this.render(url, {
				manifest: this.manifest,
				preload: true,
				request: request.raw,
				response: reply.raw
			})

			console.log(results)

			if (results.status) reply.status(results.status)
			if (results.headers) {
				reply.headers(results.headers)

				if (results.headers.location) {
					reply.redirect(results.status ?? 302, results.headers.location)
				}
			}

			reply.type('text/html')
			return results.html
		}
	})

	await route(instance)
})
