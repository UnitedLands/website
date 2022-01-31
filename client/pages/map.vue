<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
	name: 'MapPage'
})
</script>

<script lang="ts" setup>
const router = useRouter()
const route = useRoute()

const cords = computed({
	get: () => ({
		world: 'world_earth',
		x: Number(route.query.x ?? 0),
		z: Number(route.query.z ?? 0),
		zoom: Number(route.query.zoom ?? 1)
	}),
	set: v =>
		router.push({
			query: {
				x: v.x,
				z: v.z,
				zoom: v.zoom
			}
		})
})
</script>

<template>
	<Page class="map-page">
		<WorldMap interactable ui :cords="cords" />
	</Page>
</template>

<style lang="scss" scoped>
.map-page {
	padding: 0px;
	width: 100%;

	overflow: hidden !important;

	.world-map {
		width: 100%;
		height: 100%;
	}
}
</style>
