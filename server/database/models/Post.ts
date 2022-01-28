import { UUIDModel, UUIDModelData } from '@server/database/Model'
import User, { UserData } from '@server/database/models/User'
import type { ManyToOneRelation } from '@server/includes/typeorm'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

export interface PostData extends UUIDModelData {
	title?: string
	content: string
	author: UserData
}

@Entity()
export default class Post extends UUIDModel<PostData> {
	@Column('varchar', { nullable: true })
	declare title?: string

	@Column('varchar')
	declare content: string

	@ManyToOne(() => User, m => m.posts, { eager: true, onDelete: 'SET NULL' })
	@JoinColumn()
	declare author: ManyToOneRelation<User>
}
