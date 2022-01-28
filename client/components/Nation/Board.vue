<script lang="ts">
import { injectNation } from '@client/stores/nations'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'NationBoard'
})
</script>

<script lang="ts" setup>
const nation = injectNation()
const board = computed(() => nation.value?.board)
</script>

<template>
	<div class="nation-board">
		<slot v-bind="{ nation, board }">
			{{ board }}
		</slot>
	</div>
</template>

<style lang="scss" scoped>
.nation-board {
}
</style>
