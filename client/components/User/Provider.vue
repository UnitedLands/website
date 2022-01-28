<script lang="ts">
import { provideUser } from '@client/stores/users'
import { UserData } from '@server/database/models/User'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'UserProvider'
})
</script>

<script lang="ts" setup>
const props = defineProps<{
	user: UserData | null
}>()

const user = computed(() => props.user)

provideUser(user)
</script>

<template>
	<slot />
</template>
