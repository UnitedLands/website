<script lang="ts">
import { injectNation } from '@client/stores/nations'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'NationName'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const nation = injectNation()
const nationName = computed(() => {
	const name = nation.value?.name
	if (!name) return ''
	return name.replaceAll('_', ' ')
})
</script>

<template>
	<component :is="props.element" class="nation-name">
		<slot :nation="nation" :nationName="nationName">
			{{ nationName }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.nation-name {
	text-transform: capitalize;
}
</style>
