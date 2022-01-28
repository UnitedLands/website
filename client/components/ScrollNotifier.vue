<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref, useSlots } from 'vue'

export default defineComponent({
	name: 'ScrollNotifier',
	inheritAttrs: false
})
</script>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		element?: string
	}>(),
	{
		element: 'div'
	}
)

const emit = defineEmits<{
	(e: 'scroll-start'): void
	(e: 'scrolled', percent: number): void
	(e: 'scroll-end'): void
}>()

let processing = false

function handleEvent(event: Event | WheelEvent) {
	const target = event.target as HTMLElement

	const scrolled = target.scrollTop + target.offsetHeight
	const scrolledPercent = scrolled / target.scrollHeight

	if (target.scrollHeight === target.offsetHeight) {
		emit('scrolled', 1)
		emit('scroll-end')
		return
	} else emit('scrolled', scrolledPercent)

	if (scrolledPercent >= 1) emit('scroll-end')
	else if (scrolledPercent <= 0) emit('scroll-start')
}

function handleScroll(event: Event) {
	if (processing) return
	else processing = true
	handleEvent(event)
	processing = false
}

function handleWheel(event: WheelEvent) {
	if (processing) return
	else processing = true
	handleEvent(event)
	processing = false
}
</script>

<template>
	<slot :onScroll="handleScroll" :onWheel="handleWheel" />
</template>
