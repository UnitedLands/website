<script lang="ts">
import { injectTown } from '@client/stores/towns'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TownName'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const town = injectTown()
const townName = computed(() => {
	const name = town.value?.name
	if (!name) return ''
	return name.replaceAll('_', ' ')
})
</script>

<template>
	<component :is="props.element" class="town-name">
		<slot :town="town" :townName="townName">
			{{ townName }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.town-name {
	text-transform: capitalize;
}
</style>
