<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminUsersIndexPage'
})
</script>

<script lang="ts" setup></script>

<template>
	<Page class="admin-users-index-page">
		<h2>Select a User</h2>
	</Page>
</template>

<style lang="scss" scoped>
.admin-users-index-page {
	@include flex(column, center, center);
}
</style>
