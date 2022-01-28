<script lang="ts">
import { injectUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'UserDisplayName',
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

const user = injectUser()
const displayName = computed(() => user.value?.display_name ?? user.value?.name ?? '[unknown]')
</script>

<template>
	<component :is="props.element" class="user-display-name">
		<slot :user="user" :displayName="displayName">
			{{ displayName }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.user-display-name {
}
</style>
