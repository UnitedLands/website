<script lang="ts">
import { injectUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'UserBanner'
})
</script>

<script lang="ts" setup>
const user = injectUser()

const banner_url = computed(() => user.value?.banner?.url)
</script>

<template>
	<div class="user-banner">
		<img v-if="banner_url" :src="banner_url" :alt="user?.name" />
	</div>
</template>

<style lang="scss" scoped>
.user-banner {
	background-color: var(--user-banner-background-color, var(--color-primary, gray));

	img {
		width: 100%;
		height: 100%;

		object-fit: cover;
		object-position: center;
	}
}
</style>
