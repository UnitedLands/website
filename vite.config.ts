import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSSR from 'vite-ssr/plugin'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

const ssrOptions = {
	ssr: {
		noExternal: ['typeorm']
	}
}

// https://vitejs.dev/config/
export default defineConfig({
	envPrefix: 'CLIENT',

	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:4000'
			}
		}
	},

	resolve: {
		alias: {
			'@server': path.resolve('./server'),
			'@client': path.resolve('./client'),
			'@lib': path.resolve('./lib'),
			typeorm: path.resolve('./lib/utils/typeorm-model-shim.ts')
		}
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "sassy";`,
				includePaths: ['client/styles']
			}
		}
	},

	plugins: [
		viteSSR(),
		vue(),
		Pages({
			dirs: ['client/pages'],
			routeBlockLang: 'yaml'
		}),
		Layouts({ layoutsDir: 'client/layouts' }),
		Components({
			dts: true,
			directoryAsNamespace: true,
			dirs: ['client/components']
		})
		// VitePWA({
		// 	manifest: {
		// 		name: 'UnitedLands'
		// 	}
		// })
	],

	optimizeDeps: {
		include: [
			'dayjs',
			'axios',
			'lodash',
			'vue-router',
			'dayjs/plugin/duration',
			'dayjs/plugin/relativeTime',
			'dayjs/plugin/isBetween',
			'markdown-it'
		]
	},

	...ssrOptions
})
