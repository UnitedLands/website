<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'Map'
})
</script>

<script lang="ts" setup>
type Props = {
	interactable?: boolean
	loading?: 'eager' | 'lazy'
	ui?: boolean
	cords?: {
		world: string
		x: number
		z: number
		zoom?: number
	}
}

const props = withDefaults(defineProps<Props>(), {
	interactable: false,
	loading: 'lazy',
	ui: false
})

const cords = computed(() => props.cords)

const mapURL = computed(() => {
	if (!cords.value) return `https://map.unitedlands.org/?ui=${props.ui}`
	const { world, x, z } = cords.value
	const zoom = cords.value.zoom ?? 1

	return `https://map.unitedlands.org/?ui=${props.ui}#${world};flat;${x},64,${z};${zoom}`
})
</script>

<template>
	<div class="world-map" :class="{ interactable: props.interactable }">
		<iframe :src="mapURL" :loading="props.loading" />
	</div>
</template>

<style lang="scss" scoped>
.world-map {
	iframe {
		width: 100%;
		height: 100%;

		border: none;
		outline: none;

		user-select: none;
		pointer-events: none;
	}

	&.interactable {
		iframe {
			user-select: all;
			pointer-events: all;
		}
	}
}
</style>
