<script lang="ts">
import { injectNation } from '@client/stores/nations'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'NationMap'
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

const nation = injectNation()
const nationSpawn = computed(() => {
	if (!nation.value) return
	const parsed = nation.value.spawn.split('#')

	return {
		world: parsed[0],
		x: Number(parsed[1]),
		z: Number(parsed[3]),
		zoom: props.zoom
	}
})
</script>

<template>
	<WorldMap :cords="nationSpawn" class="nation-map" v-bind="$attrs" />
</template>

<style lang="scss" scoped>
.nation-map {
}
</style>
