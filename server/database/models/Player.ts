import { BaseModel } from '@server/database/Model'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import User, { UserData } from '@server/database/models/User'
import TownyResident from '@server/database/models/Towny/Resident'
import Xconomy, { XconomyData } from '@server/database/models/Xconomy'
import { OneToOneRelation } from '@server/includes/typeorm'

export interface PlayerData {
	name: string
	uid: string
	resident?: OneToOneRelation<TownyResident>
	balance?: XconomyData | number
}

@Entity()
export default class Player extends BaseModel<PlayerData, string> {
	@Column('varchar', { length: 50 })
	declare name: string

	@Column('varchar', { length: 50, primary: true, unique: true })
	declare uid: string

	// @OneToOne(() => Character, m => m.player, {
	// 	onDelete: 'CASCADE'
	// })
	// @JoinColumn()
	// declare character?: CharacterData

	@OneToOne(() => Xconomy, m => m.player, { eager: true })
	declare balance?: XconomyData | number

	@OneToOne(() => TownyResident, m => m.player)
	declare resident?: OneToOneRelation<TownyResident>

	@OneToOne(() => User, m => m.player, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	declare user?: UserData
}
