<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminLayout'
})
</script>

<script lang="ts" setup></script>

<template>
	<div class="admin-layout">
		<NavigationMain />
		<NavigationAdmin />
		<RouterView class="layout-content" />
	</div>
</template>

<style lang="scss" scoped>
.admin-layout {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	grid-template-areas: 'mainnav mainnav' 'adminnav content';

	width: 100%;
	height: 100%;

	.navigation-main {
		grid-area: mainnav;
	}

	.navigation-admin {
		grid-area: adminnav;
	}

	.layout-content {
		grid-area: content;
		min-height: auto;
	}
}
</style>
