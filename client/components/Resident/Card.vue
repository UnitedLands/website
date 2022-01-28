<script lang="ts">
import { provideNation, useNations } from '@client/stores/nations'
import { provideResident } from '@client/stores/residents'
import { provideTown, useTowns } from '@client/stores/towns'
import { TownyNationData } from '@server/database/models/Towny/Nation'
import { TownyResidentData } from '@server/database/models/Towny/Resident'
import { TownyTownData } from '@server/database/models/Towny/Town'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'ResidentCard'
})
</script>

<script lang="ts" setup>
type Props = {
	resident: TownyResidentData
	withTown?: boolean
	withNation?: boolean
	link?: boolean
}

const router = useRouter()
const nations = useNations()
const towns = useTowns()
const props = withDefaults(defineProps<Props>(), {
	withTown: false,
	withNation: false,
	link: false
})

const resident = computed(() => props.resident)

const townName = computed(() =>
	typeof resident.value.town === 'string' ? resident.value.town : resident.value.town?.name
)
const town = ref<TownyTownData>()

const nationName = computed(() =>
	typeof town.value?.nation === 'string' ? town.value.nation : town.value?.nation?.name
)
const nation = ref<TownyNationData>()

const goto = () => (!props.link ? undefined : router.push(`/residents/${resident.value.name}`))

async function fetchTown() {
	if (!props.withTown || !townName.value) return
	try {
		town.value = await towns.fetch(townName.value)
		if (props.withNation) await fetchNation()
	} catch (error) {
		console.log(error)
	}
}

async function fetchNation() {
	if (!props.withNation || !nationName.value) return
	try {
		nation.value = await nations.fetch(nationName.value)
	} catch (error) {
		console.log(error)
	}
}

onBeforeMount(() => {
	fetchTown()
})

provideResident(resident)
provideTown(town)
provideNation(nation)
</script>

<template>
	<div class="resident-card" :class="{ link: props.link }" @click="goto">
		<ResidentAvatar type="body" />
		<ResidentName element="h2" withTitle withSurname />
		<TownName v-if="props.withTown" element="h4" v-slot="{ townName }">
			{{ townName || 'Nomad' }}
			<NationName v-if="props.withNation && nation" v-slot="{ nationName }">
				({{ nationName || 'Independent' }})
			</NationName>
		</TownName>
		<ResidentRanks element="h4" />
		<ResidentBalance element="h4" v-slot="{ balance }">
			<label>Balance</label>
			{{ balance }}
		</ResidentBalance>
		<i class="fas fa-chevron-right goto" />
	</div>
</template>

<style lang="scss" scoped>
.resident-card {
	display: grid;
	grid-template-columns: auto 1fr auto 25px;
	grid-template-rows: 1fr auto auto auto 1fr;
	grid-template-areas: 'avatar . . goto' 'avatar ranks balance goto' 'avatar name balance goto' 'avatar town balance goto' 'avatar . . goto';
	column-gap: 1em;
	padding: 1em;

	min-width: 300px;
	width: 100%;
	max-width: 600px;
	padding: 1em;

	background-color: white;
	color: black;

	border-radius: var(--border-radius, 10px);

	.resident-avatar {
		grid-area: avatar;
		width: auto;
		border-radius: 0px;
		margin: 0px 1em;
	}

	.resident-name {
		grid-area: name;
		padding: 0px;
		padding-bottom: 0.25em;
	}

	.town-name {
		grid-area: town;
		padding: 0px;
		color: gray;
	}

	.resident-ranks {
		grid-area: ranks;
		padding-bottom: 0px;
		color: gray;
	}

	.resident-balance {
		@include flex(column, flex-start, flex-end);
		grid-area: balance;
		align-self: center;

		label {
			padding: 0px;
			color: gray;
		}
	}

	.goto {
		grid-area: goto;
		align-self: center;
		justify-self: center;
	}

	&.link {
		cursor: pointer;
	}
}
</style>
