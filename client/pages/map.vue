<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'MapPage'
})
</script>

<script lang="ts" setup></script>

<template>
	<Page class="map-page">
		<WorldMap interactable />
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
