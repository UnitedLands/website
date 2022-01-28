<script lang="ts">
import { provideUser, useUsers } from '@client/stores/users'
import { UserData } from '@server/database/models/User'
import { defineComponent, onBeforeMount, ref } from 'vue'

export default defineComponent({
	name: 'AdminUsersSinglePage'
})
</script>

<script lang="ts" setup>
const users = useUsers()
const props = defineProps<{
	username: string
}>()

const user = ref<UserData>(null as any)

onBeforeMount(async () => {
	user.value = await users.get(props.username)
})

provideUser(user)
</script>

<template>
	<Page v-if="user" class="admin-users-single-page">
		<UserBanner />
		<UserAvatar />
		<UserDisplayName element="h1" v-slot="{ displayName }">
			{{ displayName }}
			<UserName v-if="displayName !== username" v-slot="{ username }">({{ username }})</UserName>
		</UserDisplayName>

		<UserPosts />
	</Page>
</template>

<style lang="scss" scoped>
.admin-users-single-page {
	@include flex(column, flex-start, center);
	padding: 0px;
	padding-bottom: 1em;

	& > * {
		z-index: 1;
		flex-shrink: 0;
	}

	.user-banner {
		width: 100%;
		height: 200px;

		position: relative;
		z-index: 0;

		transition: height 0.5s 0.25s;

		&::after {
			content: ' ';
			width: 100%;
			height: 100%;

			position: absolute;
			left: 0px;
			top: 0px;
			opacity: 1;

			background-color: rgba(#000, 0.43);
			transition: opacity 0.5s 0.25s;
		}

		&:hover {
			height: 400px;

			&::after {
				opacity: 0;
			}
		}
	}

	.user-avatar {
		--user-avatar-size: 200px;
		margin-top: -100px;
	}
}
</style>
