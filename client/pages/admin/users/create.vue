<script lang="ts">
import { useUsers } from '@client/stores/users'
import User from '@server/database/models/User'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
	name: 'AdminUsersCreatePage'
})
</script>

<script lang="ts" setup>
const users = useUsers()

const data = reactive(
	User.init({
		name: '',
		email: '',
		display_name: '',
		password: ''
	}).toJSON()
)

async function createUser() {
	try {
		const user = await users.create(data)
		console.log(user)
	} catch (e) {
		console.log(e)
	}
}
</script>

<template>
	<Page class="admin-users-create-page">
		<PageTitle>Create User</PageTitle>

		<form @submit.prevent="createUser">
			<FormInput v-model="data.name" class="expanded" label="Username" required />
			<FormInput v-model="data.email" class="expanded" label="Email" required />
			<FormInput v-model="data.display_name" class="expanded" label="Display Name" required />
			<FormInput v-model="data.password" class="expanded" label="Password" required />

			<FormButton type="submit">Create</FormButton>
		</form>
	</Page>
</template>

<style lang="scss" scoped>
.admin-users-create-page {
	form {
		@include flex(column);
		row-gap: 1em;
	}
}
</style>
