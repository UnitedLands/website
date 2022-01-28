import { UUIDModel, UUIDModelData } from '@server/database/Model'
import { Column, Entity, TableInheritance } from 'typeorm'

export interface FileData extends UUIDModelData {
	readonly type: string
	name: string
	encoding: string
	mimetype: string
	filename: string
	url?: string
}

@Entity()
@TableInheritance({ column: { name: 'type' } })
export default class File extends UUIDModel<FileData> {
	@Column('varchar')
	declare readonly type: string

	@Column('varchar', { length: 100 })
	declare name: string

	@Column('varchar')
	declare encoding: string

	@Column('varchar')
	declare mimetype: string

	@Column('varchar')
	declare filename: string

	@Column('varchar', { nullable: true })
	declare url: string

	toJSON() {
		const data = super.toJSON()

		if (process.env.BACKEND_URL && !data.url) {
			data.url = `${process.env.BACKEND_URL}/api/files/${data.filename}`
		}

		return data
	}
}
