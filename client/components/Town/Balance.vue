<script lang="ts">
import { formatBalance } from '@client/functions'
import { injectTown } from '@client/stores/towns'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TownBalance'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const town = injectTown()
const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const balance = computed(() => formatBalance(town.value?.balance ?? 0))
</script>

<template>
	<component :is="props.element" class="town-balance">
		<slot :town="town" :balance="balance">
			{{ balance }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.town-balance {
}
</style>
