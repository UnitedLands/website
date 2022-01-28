<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'PageTitle'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const props = withDefaults(defineProps<Props>(), {
	element: 'h1'
})
</script>

<template>
	<component :is="props.element" class="page-title">
		<slot />
	</component>
</template>

<style lang="scss" scoped>
.page-title {
	padding-top: 0px;
	padding-bottom: 1em;
}
</style>
