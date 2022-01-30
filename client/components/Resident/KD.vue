<script lang="ts">
import { injectResident, useResidents } from '@client/stores/residents'
import { TownyResidentWithKDData } from '@server/database/models/Towny/Resident'
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
	name: 'ResidentKD'
})
</script>

<script lang="ts" setup>
const residents = useResidents()
const resident = injectResident()
const residentName = computed(() => resident.value?.name)
const kd = ref<TownyResidentWithKDData>({
	uuid: '',
	kills: 0,
	deaths: 0
})

const kdpercent = computed(() => {
	const { kills, deaths } = kd.value
	if (deaths === 0) return kills
	return (kills / deaths).toFixed(2)
})

watch(
	residentName,
	async name => {
		if (!name) return
		try {
			kd.value = await residents.fetchKD(name)
		} catch (error) {
			console.log(error)
		}
	},
	{ immediate: true }
)
</script>

<template>
	<div class="resident-kd">
		<div class="kills">
			<h3>Kills</h3>
			<span>{{ kd.kills }}</span>
		</div>

		<div class="deaths">
			<h3>Deaths</h3>
			<span>{{ kd.deaths }}</span>
		</div>

		<div class="kd">
			<h3>K/D</h3>
			<span>{{ kdpercent }}</span>
		</div>

		<div v-if="kd.favorite" class="favorite">
			<h3>Favorite Weapon</h3>
			<span>{{ kd.favorite.weapon }} ({{ kd.favorite.kills }} kills)</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.resident-kd {
	display: grid;
	grid-template-columns: auto auto auto;
	grid-template-rows: auto auto;
	grid-template-areas: 'kd kills deaths' 'favorite favorite favorite';
	gap: 0.5em;

	h3 {
		padding-top: 0px;
		color: gray;
	}

	span {
		font-weight: bold;
	}

	.kd {
		grid-area: kd;
	}

	.kills {
		grid-area: kills;
	}

	.deaths {
		grid-area: deaths;
	}

	.favorite {
		grid-area: favorite;
	}
}
</style>
