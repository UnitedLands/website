<script lang="ts">
import { injectResident } from '@client/stores/residents'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ResidentName'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
	withTitle?: boolean
	withSurname?: boolean
}

const resident = injectResident()
const props = withDefaults(defineProps<Props>(), {
	element: 'span',
	withTitle: false,
	withSurname: false
})

const residentName = computed(() => {
	const res = resident.value
	if (!res?.name) return ''
	let name = res.name

	if (props.withTitle) name = `${res.title} ${name}`
	if (props.withSurname) name = `${name} ${res.surname}`

	return name
})
</script>

<template>
	<component :is="props.element" class="resident-name">
		<slot :resident="resident" :residentName="residentName">
			{{ residentName }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.resident-name {
	text-transform: capitalize;
}
</style>
