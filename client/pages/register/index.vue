<script lang="ts">
import { useAPI } from '@client/modules/api'
import { useAuth } from '@client/stores/auth'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'RegisterPage'
})
</script>

<script lang="ts" setup>
const auth = useAuth()
const router = useRouter()
const api = useAPI()
const data = reactive({
	name: '',
	email: ''
})

async function register() {
	try {
		await api.post('register', data)
		alert('Please check your email for a registration link')
		router.push('/')
	} catch (e: any) {
		console.log(e)
		if (e?.response?.data?.message) alert(e.response.data.message)
	}
}

onBeforeMount(() => {
	if (auth.isLoggedIn) router.push('/')
})
</script>

<template>
	<Page class="register-page">
		<PageTitle>Register</PageTitle>

		<form @submit.prevent="register">
			<FormInput v-model="data.name" label="Username" required />
			<FormInput v-model="data.email" label="Email" type="email" required />

			<FormButton type="submit">Register</FormButton>
		</form>
	</Page>
</template>

<style lang="scss" scoped>
.register-page {
	@include flex(column, center, center);

	form {
		@include flex(column, flex-start, center);
		row-gap: 1em;
	}
}
</style>
