import {
	BaseEntity,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

export abstract class BaseModel<Data extends object, PrimaryKey = any> extends BaseEntity {
	static init<M extends BaseModel<any>>(this: { new (): M }, data: Partial<M['$data']>) {
		const m = new this()
		return m.assign(data)
	}

	// used to identify the type of the primary key. this property does not and should not exist
	declare $pk: PrimaryKey

	// for types only, property does not and should not exist
	declare $data: Data

	assign(data: Partial<Data>): this {
		return Object.assign(this, data)
	}

	toJSON(): Data {
		const raw = Object.assign({}, this) as any
		const data: any = {}

		for (const [key, value] of Object.entries(raw)) {
			if (key.startsWith('_')) continue
			data[key] = value
		}

		return data
	}
}

export interface ModelData {
	created: string
	updated: string | null
	deleted: string | null
}

export default class Model<Data extends ModelData> extends BaseModel<Data> {
	@CreateDateColumn()
	declare created: string

	@UpdateDateColumn()
	declare updated: string | null

	@DeleteDateColumn()
	declare deleted: string | null
}

export interface UUIDModelData extends ModelData {
	uuid: string
}

export class UUIDModel<Data extends UUIDModelData> extends Model<Data> {
	@PrimaryGeneratedColumn('uuid')
	declare uuid: string
}

export interface IDModelData extends ModelData {
	id: number
}

export class IDModel<Data extends IDModelData> extends Model<Data> {
	@PrimaryGeneratedColumn()
	declare id: string
}
