import { BaseModel } from '@server/database/Model'
import { Column, Entity, ViewColumn, ViewEntity } from 'typeorm'
import { XconomyNon } from '@server/database/models/Xconomy'

export interface TownyNationData {
	name: string
	capital: string
	tag: string
	allies: string
	enemies: string
	taxes: number
	spawn_cost: number
	neutral: number
	uuid: string
	registered: number
	board: string
	map_color_hex_code: string
	spawn: string
	public: number
	open: number
	metadata: string
	balance?: number
}

@Entity({ name: 'TOWNY_NATIONS', synchronize: false })
export default class TownyNation extends BaseModel<TownyNationData, string> {
	@Column('varchar', { length: 32, primary: true })
	declare name: string

	@Column('text')
	declare capital: string

	@Column('text')
	declare tag: string

	@Column('text')
	declare allies: string

	@Column('text')
	declare enemies: string

	@Column('float')
	declare taxes: number

	@Column('float', { name: 'spawnCost' })
	declare spawn_cost: number

	@Column('tinyint', { width: 1, default: 0 })
	declare neutral: number

	@Column('varchar', { length: 36 })
	declare uuid: string

	@Column('bigint')
	declare registered: number

	@Column('text', { name: 'nationBoard' })
	declare board: string

	@Column('text', { name: 'mapColorHexCode' })
	declare map_color_hex_code: string

	@Column('text', { name: 'nationSpawn' })
	declare spawn: string

	@Column('tinyint', { width: 1, default: 0, name: 'isPublic' })
	declare public: number

	@Column('tinyint', { width: 1, default: 0, name: 'isOpen' })
	declare open: number

	@Column('text')
	declare metadata: string

	balance: number = 0

	loadBalance() {
		const query = XconomyNon.findOne({
			where: { account: `nation-${this.name}` }
		})

		return query.then(eco => {
			if (eco) this.balance = eco.balance
			return this
		})
	}
}

@ViewEntity({
	expression: `
		SELECT nation.*, xcon.balance as balance
		FROM TOWNY_NATIONS nation
		LEFT JOIN xconomynon xcon ON xcon.account = CONCAT("nation-", nation.name)
		ORDER BY balance DESC
	`
})
export class TownyNationWithBalance extends TownyNation {
	@ViewColumn()
	declare balance: number
}
