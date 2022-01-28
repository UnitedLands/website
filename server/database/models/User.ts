import Model, { ModelData } from '@server/database/Model'
import Player from '@server/database/models/Player'
import Post, { PostData } from '@server/database/models/Post'
import UserAvatar, { UserAvatarData } from '@server/database/models/UserAvatar'
import UserBanner, { UserBannerData } from '@server/database/models/UserBanner'
import UserRole, { UserRoleData } from '@server/database/models/UserRole'
import type {
	ManyToManyRelation,
	OneToManyRelation,
	OneToOneRelation
} from '@server/includes/typeorm'
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'

export interface UserData extends ModelData {
	name: string
	email: string
	password?: string
	display_name: string | null
	avatar: UserAvatarData | null
	banner: UserBannerData | null
	roles: UserRoleData[]
	posts?: PostData[]
	player?: OneToOneRelation<Player>
}

@Entity()
export default class User extends Model<UserData> {
	@PrimaryColumn({ type: 'varchar', length: 50, unique: true })
	declare name: string

	@Column({ type: 'varchar', length: 50, unique: true })
	declare email: string

	@Column('varchar', { length: 150, nullable: true })
	declare display_name: UserData['display_name']

	@Column('varchar', { nullable: true, select: false })
	declare password?: string

	@OneToOne(() => UserAvatar, m => m.user, {
		eager: true,
		orphanedRowAction: 'nullify',
		onDelete: 'SET NULL',
		cascade: true
	})
	@JoinColumn()
	declare avatar: OneToOneRelation<UserAvatar>

	@OneToOne(() => UserBanner, m => m.user, {
		eager: true,
		orphanedRowAction: 'nullify',
		onDelete: 'SET NULL',
		cascade: true
	})
	@JoinColumn()
	declare banner: OneToOneRelation<UserBanner>

	@ManyToMany(() => UserRole, m => m.users, { eager: true, cascade: true })
	declare roles: ManyToManyRelation<UserRole>

	@OneToMany(() => Post, m => m.author)
	declare posts?: OneToManyRelation<Post>

	@OneToOne(() => Player, m => m.user)
	declare player?: OneToOneRelation<Player>

	isAdmin() {
		return !!this.roles.find(role => role.name === 'admin')
	}
}
