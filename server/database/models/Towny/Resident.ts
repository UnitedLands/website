import { BaseModel } from '@server/database/Model'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, ViewColumn, ViewEntity } from 'typeorm'
import Player from '@server/database/models/Player'
import TownyTown from '@server/database/models/Towny/Town'
import Xconomy from '@server/database/models/Xconomy'
import { OneToOneRelation } from '@server/includes/typeorm'

export interface TownyResidentData {
	name: string
	town: OneToOneRelation<TownyTown>
	town_ranks: string
	nation_ranks: string
	last_online: number
	registered: number
	is_npc: boolean
	is_jailed: boolean
	jail_spawn: number
	jail_days: number
	jail_town: string
	title: string
	surname: string
	protection_status: string
	friends: string
	metadata: string
	uuid: string
	joined_town_at: number
	balance: number
}

@Entity({
	name: 'TOWNY_RESIDENTS',
	synchronize: false
})
export default class TownyResident extends BaseModel<TownyResidentData, string> {
	@Column('varchar', { primary: true })
	declare name: string

	@Column('text', { nullable: true })
	@ManyToOne(() => TownyTown)
	@JoinColumn({ name: 'town', referencedColumnName: 'name' })
	declare town: OneToOneRelation<TownyTown>

	@Column('text', { name: 'town-ranks', nullable: true })
	declare town_ranks: string

	@Column('text', { name: 'nation-ranks', nullable: true })
	declare nation_ranks: string

	@Column('bigint', {
		name: 'lastOnline'
	})
	declare last_online: number

	@Column('bigint')
	declare registered: number

	@Column('tinyint', { width: 1, name: 'isNPC', default: 0 })
	declare is_npc: boolean

	// @Column('tinyint', { width: 1, name: 'isJailed', default: 0 })
	declare is_jailed: boolean

	// @Column('mediumint', { name: 'JailSpawn', nullable: true })
	declare jail_spawn: any

	// @Column('mediumint', { name: 'JailDays', nullable: true })
	declare jail_days: any

	// @Column('text', { name: 'JailTown', nullable: true })
	declare jail_town: any

	@Column('text', { nullable: true })
	declare title: string

	@Column('text', { nullable: true })
	declare surname: string

	@Column('text', {
		name: 'protectionStatus',
		nullable: true,
		select: false
	})
	declare protection_status?: string

	@Column('text', { nullable: true })
	declare friends: string

	@Column('text', { nullable: true })
	declare metadata: string

	@Column('text', { nullable: true })
	declare uuid?: string

	@Column('bigint', { name: 'joinedTownAt' })
	declare joined_town_at: number

	@OneToOne(() => Player, m => m.resident)
	@JoinColumn({ name: 'uuid', referencedColumnName: 'uid' })
	declare player?: OneToOneRelation<Player>

	declare balance: number
}

@ViewEntity({
	expression: `
		SELECT resident.*, xcon.balance as balance
		FROM TOWNY_RESIDENTS resident
		LEFT JOIN xconomy xcon ON xcon.player = resident.name
		ORDER BY balance DESC
	`
})
export class TownyResidentWithBalance extends TownyResident {
	@ViewColumn()
	declare balance: number
}
