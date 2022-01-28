<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileName'
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
	<UserName v-if="user" :element="props.element" class="profile-name" />
</template>

<style lang="scss" scoped>
.profile-name {
}
</style>
