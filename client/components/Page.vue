<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'Page'
})
</script>

<script lang="ts" setup></script>

<template>
	<main class="page">
		<slot />
	</main>
</template>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	padding: 1em;

	overflow: hidden;
	overflow-y: auto;
}
</style>
