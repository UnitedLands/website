import { defineModule } from '@client'
import axios, { AxiosInstance } from 'axios'
import * as vue from 'vue'

declare module '@client' {
	export interface ClientContext {
		api: AxiosInstance
	}
}

export function useAPI() {
	return vue.inject('api') as AxiosInstance
}

export default defineModule(ctx => {
	const api = axios.create({
		baseURL: `${import.meta.env.CLIENT_URL}/api`,
		withCredentials: true
	})

	if (!ctx.isClient) {
		api.defaults.headers.common = ctx.request.headers
	}

	ctx.api = api
	ctx.app.provide('api', api)
})
