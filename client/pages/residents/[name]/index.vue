<script lang="ts">
import { ProvidedStoreItem } from '@client'
import { TownRank } from '@client/components/Resident/Ranks.vue'
import { provideNation, useNations } from '@client/stores/nations'
import { provideResident, useResidents } from '@client/stores/residents'
import { provideTown, useTowns } from '@client/stores/towns'
import is from '@lib/utils/is'
import { TownyNationData } from '@server/database/models/Towny/Nation'
import { TownyResidentData } from '@server/database/models/Towny/Resident'
import { TownyTownData } from '@server/database/models/Towny/Town'
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
	name: 'TownsSinglePage'
})
</script>

<script lang="ts" setup>
const towns = useTowns()
const residents = useResidents()
const nations = useNations()
const props = defineProps<{
	name: string
}>()

const resident = ref<TownyResidentData>()
const town = ref<TownyTownData>()
const nation = ref<TownyNationData>()

async function fetchTown() {
	const t = resident.value?.town
	if (!t) return
	const townName = typeof t === 'string' ? t : t.name
	town.value = await towns.fetch(townName)
}

async function fetchNation() {
	const townNation = town.value?.nation
	if (!townNation) return
	const name = typeof townNation === 'string' ? townNation : townNation.name

	nation.value = await nations.fetch(name)
}

onMounted(async () => {
	resident.value = await residents.fetch(props.name)
	console.log(resident.value)
	await fetchTown()
	await fetchNation()
})

provideResident(resident)
provideTown(town)
provideNation(nation)
</script>

<template>
	<Page v-if="resident" class="residents-single-page">
		<div class="details">
			<ResidentAvatar type="body" />

			<ResidentName element="h2" v-slot="{ residentName }" withSurname>
				<h4>{{ resident?.title || 'Name' }}</h4>
				{{ residentName }}
			</ResidentName>

			<ResidentRanks />

			<!-- <TownName element="h2" v-slot="{ townName }">
				<h4>Town</h4>
				<div>
					<Link :to="`/towns/${town.name}`">{{ townName }}</Link>

					<NationName v-if="nation" v-slot="{ nationName }">
						(<Link :to="`/nations/${nation.name}`">{{ nationName }}</Link
						>)
					</NationName>
				</div>
			</TownName> -->

			<ResidentBalance element="h2" v-slot="{ balance }">
				<h4>Balance</h4>
				{{ balance }}
			</ResidentBalance>

			<Link v-if="town" class="town" :to="`/towns/${town.name}`">
				<TownCard :town="town" />
			</Link>

			<Link v-if="nation" class="nation" :to="`/nations/${nation.name}`">
				<NationCard :nation="nation" />
			</Link>
		</div>
	</Page>
</template>

<style lang="scss" scoped>
.residents-single-page {
	@include flex(column, flex-start, center);
	padding: 0px;
	padding-bottom: 2em;

	.details {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 50px auto auto 1em auto 1em auto;
		grid-template-areas: 'avatar . .' 'avatar residentname balance' 'avatar ranks .' 'avatar . .' 'avatar nation .' 'avatar . .' 'avatar town .';
		column-gap: 1em;

		z-index: 2;

		width: 100%;
		max-width: 900px;

		.resident-avatar {
			--user-avatar-size: 200px;
			--user-avatar-border-radius: 20px;

			grid-area: avatar;
			height: 300px;

			padding-top: 2em;
			// margin-top: -100px;
			background-color: var(--color-background, black);
		}

		.town-name,
		.resident-name,
		.resident-balance {
			@include flex(column);
			h4 {
				font-size: 0.7em;
				font-weight: 600;
				color: lightgray;
				text-transform: capitalize;
			}

			.link {
				color: inherit;
			}
		}

		.resident-name {
			grid-area: residentname;
		}

		.resident-ranks {
			grid-area: ranks;
		}

		.resident-balance {
			@include flex(column, flex-start, flex-end);
			grid-area: balance;
		}

		.town,
		.nation {
			color: inherit;
			text-decoration: none;
		}

		.town {
			grid-area: town;
		}

		.nation {
			grid-area: nation;
		}

		.residents {
			grid-area: residents;

			@include flex(column);
			width: 100%;
			max-width: 1000px;
			margin-top: 1em;
			row-gap: 1em;

			flex-shrink: 0;

			.link {
				color: inherit;
				text-decoration: none;
			}
		}
	}
}
</style>
