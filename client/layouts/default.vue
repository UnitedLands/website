<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'DefaultLayout'
})
</script>

<script lang="ts" setup></script>

<template>
	<div class="default-layout">
		<NavigationMain />
		<RouterView class="layout-content" />
	</div>
</template>

<style lang="scss" scoped>
.default-layout {
	@include flex(column, flex-start, center);
	width: 100%;
	height: 100%;

	.layout-content {
		flex: 1;
		min-height: auto;
	}
}
</style>
