<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { defineComponent, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
	name: 'LoginPage'
})
</script>

<script lang="ts" setup>
const router = useRouter()
const route = useRoute()
const auth = useAuth()
const creds = reactive({
	username: '',
	password: ''
})

async function login() {
	try {
		await auth.login(creds)

		const redirect = route.query.redirect

		// use window location to ensure state is refreshed
		if (Array.isArray(redirect) && redirect[0]) router.push(redirect[0])
		else if (typeof redirect === 'string') router.push(redirect)
		else router.push('/')
	} catch (e) {
		console.log(e)
	}
}
</script>

<template>
	<Page class="login-page">
		<form @submit.prevent="login">
			<FormInput v-model="creds.username" label="Username" required />
			<FormInput v-model="creds.password" label="Password" type="password" required />
			<FormButton type="submit">Login</FormButton>
		</form>
	</Page>
</template>

<style lang="scss" scoped>
.login-page {
	@include flex(column, center, center);

	form {
		@include flex(column);
		row-gap: 1em;

		.form-button {
			width: 100%;
		}
	}
}
</style>

<route>
meta:
  middleware:
    - loginRedirect
</route>
