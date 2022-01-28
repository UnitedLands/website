<script lang="ts">
import { injectTown } from '@client/stores/towns'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TownBoard'
})
</script>

<script lang="ts" setup>
const town = injectTown()
const board = computed(() => town.value?.board)
</script>

<template>
	<div class="town-board">
		<slot v-bind="{ town, board }">
			{{ board }}
		</slot>
	</div>
</template>

<style lang="scss" scoped>
.town-board {
}
</style>
