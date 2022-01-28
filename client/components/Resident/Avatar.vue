<script lang="ts">
import { injectResident } from '@client/stores/residents'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ResidentAvatar'
})
</script>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		type?: string
		direction?: string
	}>(),
	{
		type: 'avatar',
		direction: 'right'
	}
)

const resident = injectResident()

const residentAvatar = computed(() => {
	let link = `https://mc-heads.net/${props.type}/${resident.value?.name}`

	if (props.type === 'head' || props.type === 'body') link += `/${props.direction}`

	return link
})
</script>

<template>
	<div class="resident-avatar" :class="[props.type, props.direction]">
		<img :src="residentAvatar" />
	</div>
</template>

<style lang="scss" scoped>
$a-size: var(--user-avatar-size, 100px);

.resident-avatar {
	@include flex(column, center, center);
	width: $a-size;
	height: $a-size;

	overflow: hidden;
	border-radius: var(--user-avatar-border-radius, 100%);

	// background-color: black;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	&.player,
	&.body {
		img {
			object-fit: contain;
		}
	}
}
</style>
