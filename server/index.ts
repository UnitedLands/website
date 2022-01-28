import fs from 'fs'
import startDatabase from '@server/database'
import fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyCookie from 'fastify-cookie'
import fastifyMultipart from 'fastify-multipart'
import FastifySessionPlugin from '@mgcrea/fastify-session'
import { SessionOptions } from '@server/includes/session'
import { globFiles, resolveFromCWD } from '@server/includes/functions'
import is from '@lib/utils/is'
import { config as dotenv } from 'dotenv'

dotenv({})

function setupBin() {
	const binpath = resolveFromCWD('bin')
	const uploadspath = resolveFromCWD('bin/uploads')

	if (!fs.existsSync(binpath)) {
		fs.mkdirSync(binpath)
	}

	if (!fs.existsSync(uploadspath)) {
		fs.mkdirSync(uploadspath)
	}
}

async function loadAPIRoutes(server: FastifyInstance) {
	server.register(fastifyCors, {
		credentials: true,
		origin: [process.env.CLIENT_URL as string]
	})
	server.register(fastifyCookie)
	server.register(FastifySessionPlugin, SessionOptions())
	server.register(fastifyMultipart)

	const files = await globFiles('./server/api/**/*.ts')

	for (const file of files) {
		const { default: route } = await import(file)
		console.log(`registering api route ${file}`)
		if (is.aFunction(route?.register)) {
			await server.register(route.register)
		} else if (is.aFunction(route)) {
			await server.register(route)
		} else console.warn(`skipped ${file}`)
	}
}

async function loadPlugins(server: FastifyInstance) {
	const files = await globFiles('./server/plugins/*')

	for (const file of files) {
		const { default: plugin } = await import(file)
		console.log(`registering plugin ${file}`)
		if (is.aFunction(plugin?.register)) {
			await server.register(plugin.register)
		} else if (is.aFunction(plugin)) {
			await server.register(plugin)
		} else console.warn(`skipped ${file}`)
	}
}

async function start() {
	setupBin()

	const server = fastify({
		logger: {
			prettyPrint: true
		}
	})

	try {
		await startDatabase()

		await loadPlugins(server)
		await server.register(loadAPIRoutes, {
			prefix: '/api'
		})

		await server.listen(4000)
	} catch (e) {
		console.error(e)
		process.exit()
	}
}

start()
