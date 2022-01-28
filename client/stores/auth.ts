import { ClientStore, defineStore } from '@client'
import { useAPI } from '@client/modules/api'
import { UserData } from '@server/database/models/User'
import { ref, Ref } from 'vue'

declare module '@client' {
	export interface ClientState {
		auth: AuthState
	}
}

export interface AuthState {
	current: UserData | null
}

export interface AuthLoginCreds {
	username: string
	password: string
}

export class AuthStore extends ClientStore('auth') {
	protected api = useAPI()

	get isLoggedIn() {
		return !!this.state?.current
	}

	get isAdmin() {
		return this.isLoggedIn && !!this.state.current?.roles.find(role => role.name === 'admin')
	}

	async fetch() {
		const res = await this.api.get('auth')
		this.state.current = res.data
		return this.state.current
	}

	async login(creds: AuthLoginCreds) {
		const res = await this.api.post('auth', creds)

		this.state.current = res.data
		return this.state.current
	}

	async logout() {
		await this.api.delete('auth')
		this.state.current = null
	}
}

export function useAuth() {
	return new AuthStore()
}

export default defineStore(async function (state) {
	if (!state.auth)
		state.auth = {
			current: null
		}

	try {
		const res = await this.api.get('auth')
		state.auth.current = res.data
	} catch (e) {
		if (state.auth.current) state.auth.current = null
		console.log('user is unauthed')
	}
})
