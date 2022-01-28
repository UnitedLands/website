<script lang="ts">
import { TownRank } from '@client/components/Resident/Ranks.vue'
import { useResidents } from '@client/stores/residents'
import { injectTown } from '@client/stores/towns'
import is from '@lib/utils/is'
import { TownyResidentData } from '@server/database/models/Towny/Resident'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'TownResidentsRanked'
})
</script>

<script lang="ts" setup>
const residents = useResidents()

const town = injectTown()
const mayorName = computed(() => {
	const mayor = town.value?.mayor
	return is.Undefined(mayor) ? '' : is.aString(mayor) ? mayor : mayor?.name
})

const getHighestRank = (resident: TownyResidentData) => {
	const ranks = resident.town_ranks.split('#').sort((a, b) => {
		return (
			TownRank.findIndex(s => a.toLowerCase() === s) -
			TownRank.findIndex(s => b.toLowerCase() === s)
		)
	})

	return ranks[0]
}

const inTownAndNotMayor = (resident: TownyResidentData) =>
	resident.town === town.value?.name && resident.name !== mayorName.value

const getResidentsByRank = (rank?: string) =>
	residents.state.items.filter(
		// not mayor and, not rank and not r ranks or rank is highest rank
		r => inTownAndNotMayor(r) && ((!rank && !r.town_ranks) || getHighestRank(r) === rank)
	)

const allMembers = computed(() =>
	Object.entries({
		'Co-Mayors': getResidentsByRank('co-mayor'),
		Assistants: getResidentsByRank('assistant'),
		Builders: getResidentsByRank('builder'),
		Bankers: getResidentsByRank('banker'),
		Guards: getResidentsByRank('guard'),
		Nobiles: getResidentsByRank('noble'),
		Residents: getResidentsByRank()
	})
)
</script>

<template>
	<div class="town-residents-ranked">
		<template v-for="[name, rankSet] of allMembers" :key="name">
			<template v-if="rankSet.length">
				<h2>{{ name }} ({{ rankSet.length }})</h2>
				<template v-for="resident of rankSet" :key="resident.name">
					<ResidentCard :resident="resident" link />
				</template>
			</template>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.town-residents-ranked {
	grid-area: residents;

	@include flex(column);
	width: 100%;
	max-width: 1000px;
	margin-top: 1em;
	row-gap: 1em;

	flex-shrink: 0;
}
</style>
