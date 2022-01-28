<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileIndexPage'
})
</script>

<script lang="ts" setup></script>

<template>
	<Page class="profile-index-page">
		<UserPosts :params="{ withDeleted: true }" />
	</Page>
</template>

<style lang="scss" scoped>
.profile-index-page {
	@include flex(row, center);
}
</style>
