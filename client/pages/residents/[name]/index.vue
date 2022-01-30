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

			<!-- <ResidentRanks /> -->

			<ResidentKD />

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
		grid-template-rows: 50px auto auto auto auto auto;
		grid-template-areas: 'avatar . .' 'avatar residentname kd' 'avatar . kd' 'avatar balance kd' 'avatar nation nation' 'avatar town town';
		gap: 1em;

		z-index: 2;

		width: 100%;
		max-width: 800px;

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
			padding: 0px;

			h4 {
				font-size: 0.7em;
				font-weight: 600;
				color: gray;
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

		.resident-kd {
			grid-area: kd;
			align-self: center;
		}

		.resident-balance {
			@include flex(column);
			grid-area: balance;
		}

		.town,
		.nation {
			color: inherit;
			text-decoration: none;
			margin-top: 1em;
		}

		.town {
			grid-area: town;
		}

		.nation {
			grid-area: nation;
		}
	}
}
</style>
