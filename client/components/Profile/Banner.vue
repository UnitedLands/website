<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileBanner'
})
</script>

<script lang="ts" setup>
const auth = useAuth()

const user = computed(() => auth.state.current!)

provideUser(user)
</script>

<template>
	<UserBanner v-if="user" class="profile-banner" />
</template>

<style lang="scss" scoped>
.profile-banner {
}
</style>
