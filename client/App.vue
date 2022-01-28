<script lang="ts">
import * as vue from 'vue'
import '@client/styles/global.scss'
import { useAuth } from '@client/stores/auth'

export default vue.defineComponent({
	name: 'App'
})
</script>

<script lang="ts" setup>
const auth = useAuth()

vue.onMounted(() => {
	console.log(auth)
})
</script>

<template>
	<RouterView />
</template>
