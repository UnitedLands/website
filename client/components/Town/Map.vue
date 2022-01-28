<script lang="ts">
import { injectTown } from '@client/stores/towns'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TownMap'
})
</script>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		zoom?: number
	}>(),
	{
		zoom: 5
	}
)

const town = injectTown()
const townSpawn = computed(() => {
	if (!town.value) return
	const parsed = town.value.spawn.split('#')

	return {
		world: parsed[0],
		x: Number(parsed[1]),
		z: Number(parsed[3]),
		zoom: props.zoom
	}
})
</script>

<template>
	<WorldMap :cords="townSpawn" class="town-map" v-bind="$attrs" />
</template>

<style lang="scss" scoped>
.town-map {
}
</style>
