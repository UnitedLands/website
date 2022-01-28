<script lang="ts">
import { injectResident } from '@client/stores/residents'
import { computed, defineComponent } from 'vue'

export const TownRank = ['co-mayor', 'assistant', 'builder', 'banker', 'guard', 'noble']

export default defineComponent({
	name: 'ResidentRanks'
})
</script>

<script lang="ts" setup>
const resident = injectResident()
const props = withDefaults(
	defineProps<{
		type?: 'town' | 'nation'
		element?: string
	}>(),
	{
		type: 'town',
		element: 'div'
	}
)

const ranks = computed(() => {
	const r = resident.value
	if (!r) return []

	const rawRanks = props.type === 'town' ? r.town_ranks : r.nation_ranks
	const ranks = rawRanks.split('#')

	return ranks.sort((a, b) => {
		return (
			TownRank.findIndex(s => a.toLowerCase() === s) -
			TownRank.findIndex(s => b.toLowerCase() === s)
		)
	})
})
</script>

<template>
	<component :is="props.element" class="resident-ranks">
		<template v-for="rank of ranks" :key="rank">
			<ResidentRank :rank="rank" />
		</template>
	</component>
</template>

<style lang="scss" scoped>
.resident-ranks {
	@include flex(row);
	flex-wrap: wrap;
	gap: 0.5em;
}
</style>
