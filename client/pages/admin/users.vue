<script lang="ts">
import { useUsers } from '@client/stores/users'
import { UserData } from '@server/database/models/User'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'AdminUsersPage'
})
</script>

<script lang="ts" setup>
const users = useUsers()
const route = useRoute()

let queryTimeout: any
const query = reactive({
	search: ''
})
const items = ref<UserData[]>([])

async function fetch() {
	try {
		const results = await users.list(query)
		items.value = results.items
	} catch (e) {
		console.log(e)
	}
}

function fetchMore() {
	console.log('fetch more')
}

onMounted(async () => {
	await fetch()
})

watch([query], () => {
	clearTimeout(queryTimeout)
	setTimeout(() => fetch(), 500)
})
</script>

<template>
	<Layout class="admin-users-page">
		<div class="user-list">
			<FormInput v-model="query.search" label="Search" />
			<Link class="create-btn" to="/admin/users/create">
				<FormButton>Create User</FormButton>
			</Link>

			<div class="users">
				<template v-for="user of items" :key="user.name">
					<Link :to="`/admin/users/${user.name}`">
						<UserProvider :user="user">
							<UserAvatar />
							<UserName />
						</UserProvider>
					</Link>
				</template>
			</div>
		</div>

		<RouterView :key="route.path" class="users-page" />
	</Layout>
</template>

<style lang="scss" scoped>
.admin-users-page {
	@include flex(row);
	width: 100%;

	.user-list {
		@include flex(column);
		row-gap: 1em;
		width: 300px;
		height: 100%;
		padding: 1em;

		border-right: 1px solid gray;

		.form-input {
			width: 100%;
		}

		.create-btn {
			width: 100%;
			color: white;
			text-decoration: none;

			.form-button {
				width: 100%;
			}
		}

		.users {
			@include flex(column);
			width: 100%;
			flex: 1;
			row-gap: 1em;

			.link {
				--user-avatar-size: 40px;
				--user-avatar-background-color: black;
				--user-avatar-text-color: white;

				@include flex(row, flex-start, center);
				width: 100%;
				padding: 0.5em;
				column-gap: 1em;

				background-color: white;
				color: black;
				text-decoration: none;

				border-radius: var(--border-radius, 5px);

				&.router-link-exact-active {
					background-color: var(--color-primary, lightgray);
					color: var(--color-primary-text, black);
				}
			}
		}
	}
}
</style>
