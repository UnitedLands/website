<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
	name: 'Link'
})
</script>

<script lang="ts" setup>
const props = defineProps<{
	to: string
}>()

const type = computed(() => (props.to.startsWith('/') ? 'RouterLink' : 'a'))

const attrs = computed(() => {
	if (type.value === 'a') return { href: props.to }
	else return { to: props.to }
})
</script>

<template>
	<component :is="type" class="link" v-bind="attrs">
		<slot />
	</component>
</template>

<style lang="scss" scoped></style>
