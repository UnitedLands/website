<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileDisplayName',
	inheritAttrs: false
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const auth = useAuth()
const user = computed(() => auth.state.current!)

provideUser(user)
</script>

<template>
	<UserDisplayName
		v-if="user"
		:element="props.element"
		class="profile-display-name"
		v-slot="{ displayName }"
	>
		<slot :user="user" :displayName="displayName">
			{{ displayName }}
		</slot>
	</UserDisplayName>
</template>

<style lang="scss" scoped>
.profile-display-name {
}
</style>
