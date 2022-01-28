<script lang="ts">
import { provideNation, useNations } from '@client/stores/nations'
import { provideResident, useResidents } from '@client/stores/residents'
import { provideTown } from '@client/stores/towns'
import is from '@lib/utils/is'
import { TownyNationData } from '@server/database/models/Towny/Nation'
import { TownyResidentData } from '@server/database/models/Towny/Resident'
import TownyTown from '@server/database/models/Towny/Town'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'TownCard'
})
</script>

<script lang="ts" setup>
const router = useRouter()
const nations = useNations()
const residents = useResidents()
const props = defineProps<{
	town: TownyTown['$data']
	link?: boolean
}>()

const town = computed(() => props.town)
const mayor = ref<TownyResidentData>()
const nation = ref<TownyNationData>()

const goto = () => (!props.link ? undefined : router.push(`/towns/${town.value.name}`))

async function fetchMayor() {
	const t = town.value
	const m = t.mayor
	if (typeof m === 'string') mayor.value = await residents.fetch(m)
	else if (is.notNull(m)) mayor.value = await residents.fetch(m.name)
}

async function fetchNation() {
	const townNation = town.value?.nation
	if (!townNation) return
	const name = typeof townNation === 'string' ? townNation : townNation.name

	nation.value = await nations.fetch(name)
}

onBeforeMount(() => {
	fetchMayor()
	fetchNation()
})

provideTown(town)
provideResident(mayor)
provideNation(nation)
</script>

<template>
	<div v-if="town && mayor" class="town-card" :class="{ link: props.link }" @click="goto">
		<ResidentAvatar type="body" />

		<NationName element="h4" v-slot="{ nationName }">
			{{ nationName || 'Independent' }}
		</NationName>

		<TownName element="h2" />

		<ResidentName element="h4" withTitle withSurname />

		<TownBalance element="h4" v-slot="{ balance }">
			<label>Balance</label>
			{{ balance }}
		</TownBalance>
		<!-- <TownMap :zoom="5" /> -->
	</div>
</template>

<style lang="scss" scoped>
.town-card {
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-rows: 1fr auto auto auto 1fr;
	grid-template-areas: 'avatar . .' 'avatar nation balance' 'avatar townname balance' 'avatar mayor balance' 'avatar . .';
	column-gap: 1em;
	padding: 1em;

	min-width: 300px;
	width: 100%;
	max-width: 600px;

	position: relative;
	z-index: 1;

	background-color: white;
	color: black;

	border-radius: var(--border-radius);
	overflow: hidden;
	transform: scale(1);
	transition: transform 0.5s 0s;
	box-shadow: 0px 2px 5px 1px rgba(black, 0.23);

	.resident-avatar {
		--user-avatar-border-radius: 0px;
		grid-area: avatar;
		align-self: center;
		width: 75px;

		// border: 1px solid var(--color-primary, black);
		// margin-left: 1em;
		// box-shadow: 0px 2px 5px 1px rgba(black, 0.23);
	}

	.resident-name {
		grid-area: mayor;
		padding-top: 0px;
		color: gray;
	}

	.town-name {
		grid-area: townname;
		padding: 0.25em 0px;
		padding-top: 0px;
	}

	.nation-name {
		grid-area: nation;
		padding-bottom: 0px;
		color: gray;
	}

	.town-balance {
		grid-area: balance;
		align-self: center;

		@include flex(column, flex-start, flex-end);

		label {
			color: gray;
		}
	}

	.town-map {
		grid-area: map;
	}

	// &:hover {
	// 	transform: scale(1.25);
	// 	z-index: 2;
	// 	transition: transform 0.5s 0.25s;
	// }

	&.link {
		cursor: pointer;
	}
}
</style>
