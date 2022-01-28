<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'NavigationProfile'
})
</script>

<script lang="ts" setup>
const auth = useAuth()

const user = computed(() => auth.state.current!)
</script>

<template>
	<Link v-if="user" to="/profile" class="navigation-profile">
		<ProfileDisplayName element="h3" />
		<ProfileAvatar />
	</Link>
</template>

<style lang="scss" scoped>
.navigation-profile {
	--user-avatar-size: 40px;

	@include flex(row, flex-end, center);
	column-gap: 1em;
	color: white;
	text-decoration: none;
}
</style>
