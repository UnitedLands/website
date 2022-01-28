import fs from 'fs'
import path from 'path'
import File from '@server/database/models/File'
import api from '@server/includes/api'
import { MultipartFile } from 'fastify-multipart'
import ServerError from '@server/includes/ServerError'
import { resolveFromCWD } from '@server/includes/functions'
import { DeepPartial, EntityTarget, getRepository, Repository } from 'typeorm'

// cwd resolves to the server folder, traverse up one to get to correct location
const uploads_dir = resolveFromCWD('bin/uploads')

@api.route('/files')
export default class FilesAPIRoute<FileModel extends File> extends api.Route<{
	Params: {
		filename: string
	}
}> {
	protected repo: Repository<FileModel>

	protected get filename() {
		return this.request.params.filename
	}

	constructor(request: any, reply: any, Model: EntityTarget<FileModel> = File) {
		super(request, reply)
		this.repo = getRepository(Model)
	}

	@api.endpoint('post')
	async upload() {
		const files = await this.request.saveRequestFiles()

		try {
			const uploaded: FileModel[] = []
			for (const file_data of files) {
				await this.moveFile(file_data)
				const file = await this.saveFile(file_data)
				uploaded.push(file)
			}

			if (uploaded.length === 1) return uploaded[0]
			return uploaded
		} catch (e) {
			console.error(e)
			throw new Error('There was a issue saving the requested files, please try again later.')
		}
	}

	@api.endpoint('get', '/:filename')
	async getFile() {
		try {
			const file = await this.repo.findOneOrFail({
				where: {
					filename: this.filename
				}
			})

			const filepath = path.resolve(uploads_dir, file.filename)
			if (!fs.existsSync(filepath)) throw new Error('not found')
			const stream = fs.createReadStream(filepath)

			this.reply.type(file.mimetype)
			return stream
		} catch (e) {
			throw new ServerError('file not found', 404)
		}
	}

	private moveFile(file_data: MultipartFile) {
		const fileext = path.extname(file_data.filename)
		const filename = `${Date.now()}${fileext}`
		const filepath = path.resolve(uploads_dir, filename)

		try {
			// fs.copyFileSync(file_data.filepath, filepath)
			// fs.unlinkSync(file_data.filepath)

			const read = fs.createReadStream(file_data.filepath)
			const write = fs.createWriteStream(filepath)
			read.pipe(write)

			return new Promise<void>((resolve, reject) => {
				read.on('end', () => {
					file_data.filepath = filepath
					resolve()
				})
				read.on('error', reject)
			})
		} catch (e) {
			console.log(e)
			throw new Error('failed moving file')
		}
	}

	private async saveFile(file_data: MultipartFile) {
		this.console.info('saving file', file_data)
		const fp = path.parse(file_data.filepath)

		const data: DeepPartial<FileModel> = {
			name: file_data.filename,
			encoding: file_data.encoding,
			mimetype: file_data.mimetype,
			type: file_data.fieldname,
			filename: `${fp.name}${fp.ext}`
		} as any

		try {
			const file = await this.repo.save(data)
			console.info(`file saved: ${file.filename}`)
			return file
		} catch (e) {
			console.error(e)
			throw new Error('failed saving file to database')
		}
	}
}
