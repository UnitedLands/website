import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseModel } from '@server/database/Model'
import Player from '@server/database/models/Player'
import { OneToOneRelation } from '@server/includes/typeorm'
import TownyResident from '@server/database/models/Towny/Resident'

export interface XconomyData {
	UID: string
	balance: number
	player?: OneToOneRelation<Player>
	resident?: OneToOneRelation<Player>
}

@Entity({
	name: 'xconomy',
	synchronize: false
})
export default class Xconomy extends BaseModel<XconomyData> {
	@Column('varchar', { primary: true })
	declare UID: string

	@OneToOne(() => Player, m => m.name)
	@JoinColumn({ name: 'UID', referencedColumnName: 'uid' })
	declare player?: OneToOneRelation<Player>

	@OneToOne(() => TownyResident, m => m.balance)
	@JoinColumn({ name: 'player', referencedColumnName: 'name' })
	declare resident?: OneToOneRelation<TownyResident>

	@Column('float')
	declare balance: number
}

export interface XconomyNonData {
	account: string
	balance: number
}

@Entity({
	name: 'xconomynon',
	synchronize: false
})
export class XconomyNon extends BaseModel<XconomyNonData> {
	@Column('varchar', { length: 50, primary: true })
	declare account: string

	@Column('double', { precision: 20, scale: 2 })
	declare balance: number
}
