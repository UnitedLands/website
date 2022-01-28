import User from '@server/database/models/User'
import UserRole from '@server/database/models/UserRole'
import { hashIt } from '@server/includes/functions'
import { createConnection } from 'typeorm'

export default async function startDatabase() {
	const connection = await createConnection({
		type: 'mysql',
		database: process.env.DB_NAME!,
		username: process.env.DB_USER!,
		password: process.env.DB_PASS!,
		synchronize: true,
		entities: ['./server/database/models/**/*'],
		subscribers: ['./server/database/subscribers/**/*'],
		migrations: ['./server/database/migrations/**/*']
	})

	if (process.env.NODE_ENV === 'development') await createRootUser()

	return connection
}

async function createRootUser() {
	console.info('creating root user')
	const user = User.create({
		name: 'root',
		email: 'root@localhost',
		password: await hashIt('password'),
		roles: [
			UserRole.create({
				name: 'admin',
				display_name: 'Admin'
			})
		]
	})

	return User.save(user)
}
