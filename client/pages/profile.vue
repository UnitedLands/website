<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfilePage'
})
</script>

<script lang="ts" setup>
const auth = useAuth()
const user = computed(() => auth.state.current)

provideUser(user)
</script>

<template>
	<Page class="profile-layout">
		<UserBanner />
		<UserAvatar />
		<UserDisplayName element="h1" v-slot="{ displayName }">
			{{ displayName }}
			<UserName v-slot="{ username }">({{ username }})</UserName>
		</UserDisplayName>

		<RouterView class="profile-pages" />
	</Page>
</template>

<style lang="scss" scoped>
.profile-layout {
	@include flex(column, flex-start, center);
	width: 100%;
	padding: 0px;
	padding-bottom: 1em;

	& > * {
		z-index: 1;
	}

	.user-banner {
		width: 100%;
		height: 200px;

		position: relative;
		z-index: 0;

		&::after {
			content: ' ';
			width: 100%;
			height: 100%;

			position: absolute;
			left: 0px;
			top: 0px;

			background-color: rgba(#000, 0.43);
		}
	}

	.user-avatar {
		--user-avatar-size: 200px;
		margin-top: -100px;
		flex-shrink: 0;
	}

	.profile-pages {
		height: auto;
		overflow: unset;
	}
}
</style>

<route>
meta:
  middleware:
    - authed
</route>
