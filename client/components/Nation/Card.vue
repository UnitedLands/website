<script lang="ts">
import { provideNation } from '@client/stores/nations'
import { provideResident, useResidents } from '@client/stores/residents'
import { TownyResidentData } from '@server/database/models/Towny/Resident'
import TownyNation from '@server/database/models/Towny/Nation'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { TownyTownData } from '@server/database/models/Towny/Town'
import { provideTown, useTowns } from '@client/stores/towns'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'NationCard'
})
</script>

<script lang="ts" setup>
const router = useRouter()
const residents = useResidents()
const towns = useTowns()
const props = defineProps<{
	nation: TownyNation['$data']
	link?: boolean
}>()

const nation = computed(() => props.nation)
const town = ref<TownyTownData>()
const mayor = ref<TownyResidentData>()

const goto = () => (!props.link ? undefined : router.push(`/nations/${nation.value.name}`))

onBeforeMount(async () => {
	const t = (town.value = await towns.fetch(nation.value.capital))

	const m = t.mayor

	if (m) mayor.value = await residents.fetch(typeof m === 'string' ? m : m.name)
})

provideNation(nation)
provideTown(town)
provideResident(mayor)
</script>

<template>
	<div v-if="nation" class="nation-card" :class="{ link: props.link }" @click="goto">
		<ResidentAvatar type="body" />

		<NationName element="h2" v-slot="{ nationName }">
			<h6>Nation</h6>
			{{ nationName }}
		</NationName>

		<ResidentName element="h4" withTitle withSurname />

		<NationBalance element="h4" v-slot="{ balance }">
			<label>Balance</label>
			{{ balance }}
		</NationBalance>
		<!-- <NationMap :zoom="5" /> -->
	</div>
</template>

<style lang="scss" scoped>
.nation-card {
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-rows: 1fr auto auto auto 1fr;
	grid-template-areas: 'avatar . .' 'avatar nation balance' 'avatar nationname balance' 'avatar mayor balance' 'avatar . .';
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

	.nation-name {
		grid-area: nationname;
		padding: 0.25em 0px;
		padding-top: 0px;

		h6 {
			color: gray;
			padding: 0px;
		}
	}

	.nation-balance {
		grid-area: balance;
		align-self: center;

		@include flex(column, flex-start, flex-end);

		label {
			color: gray;
		}
	}

	.nation-map {
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
