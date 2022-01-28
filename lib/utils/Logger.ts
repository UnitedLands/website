export default class Logger extends console.Console {
	constructor(public namespace: string) {
		super(process?.stdout)
	}

	log(message: any, ...extra: any[]) {
		return super.log(`[${this.namespace}]`, message, ...extra)
	}

	info(message: any, ...extra: any[]) {
		return this.log(message, ...extra)
	}
}
