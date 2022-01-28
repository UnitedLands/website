import type { ModelData } from '@server/database/Model'
import Model from '@server/database/Model'
import type { UserData } from '@server/database/models/User'
import User from '@server/database/models/User'
import type { ManyToManyRelation } from '@server/includes/typeorm'
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm'

export interface UserRoleData extends ModelData {
	name: string
	display_name: string
	users?: UserData[]
}

@Entity()
export default class UserRole extends Model<UserRoleData> {
	@PrimaryColumn({ unique: true, type: 'varchar', length: 50 })
	declare name: string

	@Column('varchar', { length: 50 })
	declare display_name: string

	@ManyToMany(() => User, m => m.roles)
	@JoinTable({ name: 'user_roles' })
	declare users?: ManyToManyRelation<User>
}
