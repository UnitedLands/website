<script lang="ts">
import { useAPI } from '@client/modules/api'
import { useAuth } from '@client/stores/auth'
import { UserData } from '@server/database/models/User'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'RegisterCodePage'
})
</script>

<script lang="ts" setup>
const api = useAPI()
const auth = useAuth()
const router = useRouter()
const props = defineProps<{
	code: string
}>()

const pass = reactive({
	value: '',
	check: ''
})

async function setPassword() {
	if (pass.value !== pass.check) return alert('passwords do not match')
	const password = pass.value
	try {
		const { data } = await api.post<UserData>(`register/${props.code}`, { password })
		await auth.login({
			username: data.name,
			password
		})

		router.push('/')
	} catch (e) {
		console.log(e)
	}
}
</script>

<template>
	<Page class="register-code-page">
		<PageTitle>Please set a Password</PageTitle>

		<form @submit.prevent="setPassword">
			<FormInput v-model="pass.value" label="Password" type="password" required min="8" />
			<FormInput v-model="pass.check" label="Password (Again)" type="password" required min="8" />
			<FormButton type="submit">Set Password</FormButton>
		</form>
	</Page>
</template>

<style lang="scss" scoped>
.register-code-page {
	@include flex(column, center, center);

	form {
		@include flex(column, flex-start, center);
		row-gap: 1em;
	}
}
</style>
