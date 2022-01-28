<script lang="ts">
import { formatBalance } from '@client/functions'
import { injectNation } from '@client/stores/nations'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TownBalance'
})
</script>

<script lang="ts" setup>
type Props = {
	element?: string
}

const nation = injectNation()
const props = withDefaults(defineProps<Props>(), {
	element: 'span'
})

const balance = computed(() => formatBalance(nation.value?.balance ?? 0))
</script>

<template>
	<component :is="props.element" class="nation-balance">
		<slot :town="nation" :balance="balance">
			{{ balance }}
		</slot>
	</component>
</template>

<style lang="scss" scoped>
.nation-balance {
}
</style>
