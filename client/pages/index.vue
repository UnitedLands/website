<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'IndexPage'
})
</script>

<script lang="ts" setup></script>

<template>
	<Page class="index-page">
		<WorldMap
			:cords="{
				world: 'world_earth',
				x: 3520,
				z: -9000,
				zoom: 1
			}"
		/>

		<h1>UnitedLands</h1>
		<h2>SMP Minecraft on a 1-500 scale Earth Map</h2>
		<h3>play.unitedlands.org</h3>
	</Page>
</template>

<style lang="scss" scoped>
.index-page {
	@include flex(column, center, center);

	position: relative;
	font-size: 1.3em;

	* {
		z-index: 2;
	}

	.world-map {
		width: 100%;
		height: 100%;

		position: absolute;
		left: 0px;
		top: 0px;
		z-index: 1;

		&::after {
			content: ' ';
			width: 100%;
			height: 100%;

			position: absolute;
			left: 0px;
			top: 0px;

			background-color: rgba(black, 0.33);
		}
	}
}
</style>
