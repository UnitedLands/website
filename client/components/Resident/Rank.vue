<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ResidentRank'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
	rank?: string
}

const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const rank = computed(() => {
	switch (props.rank) {
		default:
			return props.rank
	}
})
</script>

<template>
	<component :is="props.element" class="resident-rank">
		<slot v-bind="{ rank }">
			{{ rank }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.resident-rank {
	text-transform: capitalize;
}
</style>
