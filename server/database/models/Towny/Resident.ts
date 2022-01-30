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
	declare uuid: string

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

export interface TownyResidentWithFavoriteWeaponData {
	uuid: string
	weapon: string
	kills: number
}

@ViewEntity({
	expression: `
		SELECT resident.uuid as uuid, k.weapon as weapon, k.count as kills
		FROM TOWNY_RESIDENTS resident
		INNER JOIN (
			SELECT killer_uuid as uuid, weapon, COUNT(weapon) as count
			FROM plan_kills
			GROUP BY killer_uuid, weapon
		) k ON k.uuid = resident.uuid
	`
})
export class TownyResidentWithFavoriteWeapon extends BaseModel<TownyResidentWithFavoriteWeaponData> {
	@ViewColumn()
	declare uuid: string

	@ViewColumn()
	declare weapon: string

	@ViewColumn()
	declare kills: number
}

export interface TownyResidentWithKDData {
	uuid: string
	kills: number
	deaths: number
	favorite?: TownyResidentWithFavoriteWeaponData
}

@ViewEntity({
	expression: `
		SELECT resident.uuid as uuid, kills.count as kills, deaths.count as deaths
		FROM TOWNY_RESIDENTS resident
		INNER JOIN (
			SELECT k.killer_uuid as uuid, COUNT(k.killer_uuid) count
			FROM plan_kills k
			GROUP BY k.killer_uuid
		) kills ON kills.uuid = resident.uuid
		INNER JOIN (
			SELECT d.victim_uuid as uuid, COUNT(d.victim_uuid) count
			FROM plan_kills d
			GROUP BY d.victim_uuid
		) deaths ON deaths.uuid = resident.uuid
		GROUP BY resident.uuid
	`
})
export class TownyResidentWithKD extends BaseModel<TownyResidentWithKDData> {
	@ViewColumn()
	declare uuid: string

	@ViewColumn()
	declare kills: number

	@ViewColumn()
	declare deaths: number

	declare favorite?: TownyResidentWithFavoriteWeapon
}
