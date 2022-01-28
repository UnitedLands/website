<script lang="ts">
import { sortByBalance } from '@client/functions'
import { provideNation, useNations } from '@client/stores/nations'
import { provideResident, useResidents } from '@client/stores/residents'
import { provideTown, useTowns } from '@client/stores/towns'
import { TownyNationData } from '@server/database/models/Towny/Nation'
import { TownyResidentData } from '@server/database/models/Towny/Resident'
import { TownyTownData } from '@server/database/models/Towny/Town'
import { computed, defineComponent, onBeforeMount, reactive, ref } from 'vue'

export default defineComponent({
	name: 'NationsSinglePage'
})
</script>

<script lang="ts" setup>
const nations = useNations()
const towns = useTowns()
const residents = useResidents()

const props = defineProps<{
	name: string
}>()

const nation = ref<TownyNationData>()
const town = ref<TownyTownData>()
const resident = ref<TownyResidentData>()

const nationCapital = computed(() => (nation.value ? towns.get(nation.value.capital) : undefined))
const nationTowns = computed(() =>
	towns.state.items
		.filter(item => item.nation === props.name && item.name !== nation.value?.capital)
		.sort(sortByBalance())
)

onBeforeMount(async () => {
	nation.value = await nations.fetch(props.name)
	town.value = await towns.fetch(nation.value.capital)
	resident.value = await residents.fetch(town.value.mayor as string)
})

provideNation(nation)
provideTown(town)
provideResident(resident)
</script>

<template>
	<Page v-if="nation" class="nations-single-page">
		<NationMap />

		<div class="details">
			<ResidentAvatar type="body" />
			<NationName element="h2" v-slot="{ nationName }">
				<h4>Name</h4>
				{{ nationName }}
			</NationName>

			<ResidentName element="h2" v-slot="{ residentName }" withSurname>
				<h4>{{ resident?.title || 'Mayor' }}</h4>
				<Link :to="`/residents/${resident?.name}`">{{ residentName }}</Link>
			</ResidentName>

			<NationBalance element="h2" v-slot="{ balance }">
				<h4>Balance</h4>
				{{ balance }}
			</NationBalance>

			<NationBoard v-slot="{ board }">
				<h4>Board</h4>
				{{ board }}
			</NationBoard>

			<TownCard v-if="nationCapital" class="nation-capital" :town="nationCapital" link />

			<div v-if="nationTowns.length" class="towns">
				<h1>Towns</h1>
				<template v-for="town of nationTowns" :key="town.name">
					<TownCard :town="town" link />
				</template>
			</div>
		</div>
	</Page>
</template>

<style lang="scss" scoped>
.nations-single-page {
	@include flex(column, flex-start, center);
	padding: 0px;
	padding-bottom: 2em;

	.nation-map {
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
		grid-template-areas: 'avatar . .' 'avatar nationname mayorname' 'avatar board balance' 'avatar capital capital' '. towns towns';
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
		.nation-name,
		.resident-name,
		.nation-balance {
			@include flex(column);
			h4 {
				font-size: 0.7em;
				font-weight: 600;
				color: lightgray;
				text-transform: capitalize;
				padding-top: 0px;
			}

			.link {
				color: inherit;
			}
		}

		.nation-name {
			grid-area: nationname;
		}

		.resident-name {
			grid-area: mayorname;
			align-items: flex-end;
		}

		.nation-balance {
			align-items: flex-end;
			grid-area: balance;
		}

		.nation-board {
			grid-area: board;

			h4 {
				color: lightgray;
			}
		}

		.nation-capital {
			grid-area: capital;
		}

		.towns {
			grid-area: towns;

			@include flex(column);
			row-gap: 1em;
		}
	}
}
</style>
