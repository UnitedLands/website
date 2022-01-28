import type { SessionData } from '@mgcrea/fastify-session'
import UserSession from '@server/database/models/UserSession'
import dayjs from 'dayjs'
import { getRepository } from 'typeorm'

export function createSessionStore() {
	const repo = getRepository(UserSession)
	return {
		// dont catch because cookie isn't deleted for some reason
		get: async (id: string): Promise<[SessionData, number]> => {
			if (!repo) return [{}, 0]

			const session = await repo.findOneOrFail({ id }, { relations: ['user'] })
			const expires = dayjs(Number(session.expires)).valueOf()
			const data = {
				...session.data,
				auth: {
					current: session.user.toJSON()
				}
			}

			return [data as any, expires]
		},
		set: async (id: string, data: any, expir: number) => {
			if (!repo) return

			const user = data.auth.current
			if (!user) {
				console.log('no user for session')
				return
			}

			const expires = expir ? dayjs(expir).valueOf() : dayjs().add(7, 'day').valueOf()

			const create = () =>
				repo.create({
					id,
					expires,
					user,
					data
				})
			const find = () =>
				repo
					.findOneOrFail({ where: { id, user: { id: user.id } } })
					.then(session => {
						return session.assign({ expires, data })
					})
					.catch(create)

			const session = await find()
			await repo.save(session)
		},
		destroy: async (id: string) => {
			if (!repo) return

			try {
				console.log('DESTROY SESSION ', id)
				const session = await repo.findOne({ id })
				if (session) await repo.delete(session.id)
			} catch (e) {
				console.error('failed to destroy session!', e)
			}
		}
	}
}

export const SessionOptions = () => ({
	cookie: {
		maxAge: 604800,
		httpOnly: true
	},
	secret: process.env.SESSION_SECRET,
	cookieName: 'sa-session-id',
	saveUninitialized: false,
	store: createSessionStore()
})
