import { BaseModel } from '@server/database/Model'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm'
import TownyNation from '@server/database/models/Towny/Nation'
import TownyResident from '@server/database/models/Towny/Resident'
import { OneToOneRelation } from '@server/includes/typeorm'

export interface TownyTownData {
	name: string
	mayor: OneToOneRelation<TownyResident>
	nation: OneToOneRelation<TownyNation>
	assistants: string
	board: string
	tag: string
	protection_status: string
	bonus: number
	purchased: number
	tax_percent: number
	max_tax_percent: number
	taxes: number
	has_upkeep: number
	plot_price: number
	plot_tax: number
	commercial_plot_price: number
	commerical_plot_tax: number
	embassy_plot_price: number
	embassy_plot_tax: number
	open: number | boolean
	public: number | boolean
	admin_disabled_pvp: number | boolean
	admin_enabled_pvp: number | boolean
	home_block: string
	spawn: string
	jail_spawns: string
	outlaws: string
	uuid: string
	registered: number
	spawn_cost: number
	metadata: string
	conquered_days: number
	conquered: number | boolean
	ruined: number | boolean
	ruined_time: number
	neutral: number | boolean
	debt: number
	joined_nation_at: number
	balance?: number
}

@Entity({
	name: 'TOWNY_TOWNS',
	synchronize: false
})
export default class TownyTown extends BaseModel<TownyTownData, string> {
	@Column('varchar', { length: 32, primary: true })
	declare name: string

	@Column('text')
	@ManyToOne(() => TownyResident)
	@JoinColumn({ name: 'mayor', referencedColumnName: 'name' })
	declare mayor: OneToOneRelation<TownyResident>

	@Column('text', { nullable: true })
	@ManyToOne(() => TownyNation)
	@JoinColumn({ name: 'nation', referencedColumnName: 'name' })
	declare nation: OneToOneRelation<TownyNation>

	@Column('text')
	declare assistants: string

	@Column('text', { name: 'townBoard' })
	declare board: string

	@Column('text')
	declare tag: string

	@Column('text', { name: 'protectionStatus' })
	declare protection_status: string

	@Column('int')
	declare bonus: number

	@Column('int')
	declare purchased: number

	@Column('tinyint', { width: 1, default: 0, name: 'taxpercent' })
	declare tax_percent: number

	@Column('float', { name: 'maxPercentTaxAmount' })
	declare max_tax_percent: number

	@Column('float', { default: 0 })
	declare taxes: number

	@Column('tinyint', { width: 1, default: 0, name: 'hasUpkeep' })
	declare has_upkeep: number

	@Column('float', { name: 'plotPrice' })
	declare plot_price: number

	@Column('float', { name: 'plotTax' })
	declare plot_tax: number

	@Column('float', { name: 'commercialPlotPrice' })
	declare commercial_plot_price: number

	@Column('float', { name: 'commercialPlotTax' })
	declare commerical_plot_tax: number

	@Column('float', { name: 'embassyPlotPrice' })
	declare embassy_plot_price: number

	@Column('float', { name: 'embassyPlotTax' })
	declare embassy_plot_tax: number

	@Column('tinyint', { width: 1, default: 0 })
	declare open: number | boolean

	@Column('tinyint', { width: 1, default: 0 })
	declare public: number | boolean

	@Column('tinyint', { width: 1, default: 0, name: 'admindisabledpvp' })
	declare admin_disabled_pvp: number | boolean

	@Column('tinyint', { width: 1, default: 0, name: 'adminenabledpvp' })
	declare admin_enabled_pvp: number | boolean

	@Column('text', { name: 'homeblock' })
	declare home_block: string

	@Column('text')
	declare spawn: string

	@Column('text', { name: 'outpostSpawns' })
	declare outpost_spawns: string

	@Column('text', { name: 'jailSpawns' })
	declare jail_spawns: string

	@Column('text')
	declare outlaws: string

	@Column('varchar', { length: 36 })
	declare uuid: string

	@Column('bigint')
	declare registered: number

	@Column('float', { name: 'spawnCost' })
	declare spawn_cost: number

	@Column('text')
	declare metadata: string

	@Column('mediumint', { name: 'conqueredDays' })
	declare conquered_days: number

	@Column('tinyint', { width: 1, default: 0 })
	declare conquered: number | boolean

	@Column('tinyint', { width: 1, default: 0 })
	declare ruined: number | boolean

	@Column('bigint', { default: 0, name: 'ruinedTime' })
	declare ruined_time: number

	@Column('tinyint', { width: 1, default: 0 })
	declare neutral: number | boolean

	@Column('float', { name: 'debtBalance' })
	declare debt: number

	@Column('bigint', { name: 'joinedNationAt' })
	declare joined_nation_at: number
}

@ViewEntity({
	expression: `
		SELECT town.*, xcon.balance as balance
		FROM TOWNY_TOWNS town
		LEFT JOIN xconomynon xcon ON xcon.account = CONCAT("town-", town.name)
		ORDER BY balance DESC
	`
})
export class TownyTownWithBalance extends TownyTown {
	@ViewColumn()
	declare balance: number
}
