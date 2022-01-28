<script lang="ts">
import { injectUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'UserAvatar'
})
</script>

<script lang="ts" setup>
const user = injectUser()

const initals = computed(() => user.value?.name[0].toUpperCase() ?? 'U')
const avatar_url = computed(() => user.value?.avatar?.url)
const color = computed(() => generateColor(user.value?.name ?? 'unknown'))

function generateColor(str: string) {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}

	let colour = '#'
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff
		colour += ('00' + value.toString(16)).substring(2)
	}

	return colour
}
</script>

<template>
	<div class="user-avatar">
		<img v-if="avatar_url" :src="avatar_url" :alt="user?.name" />
		<div v-else class="no-avatar">
			{{ initals }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
$avatar-size: var(--user-avatar-size, 50px);
$avatar-radius: var(--user-avatar-radius, 100%);
.user-avatar {
	width: $avatar-size;
	height: $avatar-size;

	background-color: var(--user-avatar-background-color, var(--color-primary, black));
	color: var(--user-avatar-text-color, var(--color-primary-text, white));

	overflow: hidden;
	border-radius: $avatar-radius;

	img {
		width: 100%;
		height: 100%;

		object-fit: cover;
		object-position: center;
	}

	.no-avatar {
		@include flex(column, center, center);
		width: 100%;
		height: 100%;

		font-family: 'Source Code Pro', monospace;
		font-size: calc($avatar-size / 1.5);
		background-color: v-bind(color);
	}
}
</style>
