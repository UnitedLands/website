import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import type { SessionData } from '@mgcrea/fastify-session'
import User, { UserData } from '@server/database/models/User'
import Model, { ModelData } from '@server/database/Model'

declare module '@mgcrea/fastify-session' {
	export interface SessionData {
		// @ts-ignore ts-node throw error that doesn't show in vscode
		auth?: {
			current: UserData
		}
	}
}

export interface UserSessionData extends ModelData {
	id: string
	expires: number
	user: UserData
	data: SessionData
}

@Entity()
export default class UserSession extends Model<UserSessionData> {
	@Column('varchar', { length: 250, primary: true, unique: true })
	declare id: string

	@Column('bigint')
	declare expires: number

	@ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
	@JoinColumn()
	declare user: User

	@Column('simple-json')
	declare data: SessionData
}
