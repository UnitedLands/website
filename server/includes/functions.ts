import { hash } from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import { glob } from 'glob'
import path from 'path'

export function resolveFromCWD(p: string) {
	return path.resolve(process.cwd(), p)
}

export function globFiles(pattern: string): Promise<string[]> {
	return new Promise((resolve, reject) =>
		glob(path.resolve(process.cwd(), pattern), (err, matches) =>
			!err ? resolve(matches) : reject(err)
		)
	)
}

export function hashIt(data: string | Buffer) {
	return hash(data, process.env.PASSWORD_SALT as string)
}

export const definePlugin = (plugin: (server: FastifyInstance) => Promise<void>) => plugin

export function rootImport(p: string) {
	return import(resolveFromCWD(p))
}
