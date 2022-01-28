<script lang="ts">
import { injectUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'UserName'
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

const name = computed(() => user.value?.name ?? '[unknown]')
</script>

<template>
	<component :is="props.element" class="user-name">
		<slot :user="user" :username="name">
			{{ name }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.user-name {
}
</style>
