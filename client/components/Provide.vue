<script lang="ts">
import { defineComponent, provide } from 'vue'

export default defineComponent({
	name: 'Provide'
})
</script>

<script lang="ts" setup>
const props = defineProps<{
	name: string
	value: any
}>()

provide(props.name, props.value)
</script>

<template>
	<slot />
</template>
