<script lang="ts">
import { formatBalance } from '@client/functions'
import { injectResident } from '@client/stores/residents'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'ResidentBalance'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const resident = injectResident()
const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const balance = computed(() => formatBalance(resident.value?.balance ?? 0))
</script>

<template>
	<component :is="props.element" class="resident-balance">
		<slot :resident="resident" :balance="balance">
			{{ balance }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.resident-balance {
}
</style>
