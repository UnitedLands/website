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

const town: ProvidedStoreItem<TownyTownData> = ref()
const mayor: ProvidedStoreItem<TownyResidentData> = ref()
const nation = ref<TownyNationData>()

async function fetchResidents() {
	await residents.list({ town: props.name })
}

async function fetchNation() {
	const townNation = town.value?.nation
	if (!townNation) return
	const name = typeof townNation === 'string' ? townNation : townNation.name

	nation.value = await nations.fetch(name)
}

onMounted(async () => {
	town.value = await towns.fetch(props.name)
	const townMayor = town.value.mayor
	await fetchNation()

	if (is.aString(townMayor)) mayor.value = await residents.fetch(townMayor)
	else if (is.notNull(townMayor)) mayor.value = await residents.fetch(townMayor?.name)
	fetchResidents()
})

provideTown(town)
provideResident(mayor)
provideNation(nation)
</script>

<template>
	<Page v-if="town" class="towns-single-page">
		<TownMap />

		<div class="details">
			<ResidentAvatar type="body" />
			<TownName element="h2" v-slot="{ townName }">
				<h4>Name</h4>
				{{ townName }}
			</TownName>

			<!-- <NationName element="h2" class="nation-name" v-slot="{ nationName }">
				<h4>Nation</h4>
				<template v-if="!nationName"> Independent </template>
				<Link v-else :to="`/nations/${nation?.name}`">
					{{ nationName }}
				</Link>
			</NationName> -->

			<ResidentName element="h2" v-slot="{ residentName }" withSurname>
				<h4>{{ mayor?.title || 'Mayor' }}</h4>
				<Link :to="`/residents/${mayor?.name}`">{{ residentName }}</Link>
			</ResidentName>

			<TownBalance element="h2" v-slot="{ balance }">
				<h4>Balance</h4>
				{{ balance }}
			</TownBalance>

			<TownBoard v-slot="{ board }">
				<h4>Board</h4>
				{{ board }}
			</TownBoard>

			<NationCard v-if="nation" :nation="nation" link />

			<TownResidentsRanked />
		</div>
	</Page>
</template>

<style lang="scss" scoped>
.towns-single-page {
	@include flex(column, flex-start, center);
	padding: 0px;
	padding-bottom: 2em;

	.town-map {
		width: 100%;
		height: 30vh;
		flex-shrink: 0;

		transition: height 0.5s 0.5s;
		z-index: 1;

		&:hover {
			height: 75vh;
		}
	}

	.details {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-areas: 'avatar . .' 'avatar townname mayorname' 'avatar board balance' 'avatar nation nation' '. residents residents';
		column-gap: 1em;
		row-gap: 1.5em;

		z-index: 2;

		width: 800px;
		margin-left: -100px;

		.resident-avatar {
			--user-avatar-size: 200px;
			--user-avatar-border-radius: 20px;

			grid-area: avatar;
			height: 300px;

			padding-top: 2em;
			margin-top: -100px;
			background-color: var(--color-background, black);
		}

		.town-name,
		.resident-name,
		.nation-name,
		.town-balance {
			@include flex(column);
			// padding: 0px;

			h4 {
				padding-top: 0px;
				font-size: 0.7em;
				font-weight: 600;
				color: lightgray;
				text-transform: capitalize;
			}

			.link {
				color: inherit;
			}
		}

		.town-name {
			grid-area: townname;
		}

		.nation-name {
			grid-area: nationname;
		}

		.resident-name {
			grid-area: mayorname;
			align-items: flex-end;
		}

		.town-balance {
			align-items: flex-end;
			grid-area: balance;
		}

		.town-board {
			grid-area: board;

			h4 {
				color: lightgray;
			}
		}

		.nation-card {
			grid-area: nation;
		}

		.town-residents-ranked {
			grid-area: residents;
			margin-top: 1em;
		}
	}
}
</style>
