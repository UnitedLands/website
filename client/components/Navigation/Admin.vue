<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NavigationAdmin'
})
</script>

<script lang="ts" setup></script>

<template>
	<nav class="navigation-admin">
		<h3>Admin</h3>
		<Link to="/admin/users">Users</Link>
	</nav>
</template>

<style lang="scss" scoped>
.navigation-admin {
	@include flex(column);
	width: 200px;
	padding: 1em;
	row-gap: 1em;

	border-right: 1px solid gray;

	.link {
		width: 100%;
	}
}
</style>
