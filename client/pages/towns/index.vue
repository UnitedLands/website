<script lang="ts">
import { useTowns } from '@client/stores/towns'
import TownyTown from '@server/database/models/Towny/Town'
import { orderBy } from 'lodash'
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'

export default defineComponent({
	name: 'TownsIndexPage'
})
</script>

<script lang="ts" setup>
const towns = useTowns()

const fetching = ref(false)
const params = reactive({
	page: 0,
	limit: 10
})

const itemsToDisplay = ref(new Set<TownyTown['$pk']>())
const items = computed(() => {
	const items = towns.state.items.filter(town => itemsToDisplay.value.has(town.name))
	return items.sort((a, b) => {
		const abal = a.balance ?? 0
		const bbal = b.balance ?? 0

		return bbal - abal
	})
})

async function fetch() {
	if (fetching.value) return
	else fetching.value = true

	try {
		params.page++
		const results = await towns.list(params)

		for (const item of results.items) itemsToDisplay.value.add(item.name)
		fetching.value = false
	} catch (error) {
		console.log(error)
		params.page--

		setTimeout(() => {
			fetching.value = false
		}, 10000)
	}
}

function scrolled(percent: number) {
	if (percent > 0.75) fetch()
}

onMounted(() => {
	fetch()
})
</script>

<template>
	<ScrollNotifier v-slot="{ onScroll, onWheel }" @scrolled="scrolled($event)">
		<Page class="towns-index-page" @scroll.self.passive="onScroll" @wheel.self.passive="onWheel">
			<PageTitle>Towns</PageTitle>

			<div class="towns">
				<template v-for="item of items" :key="item.name">
					<TownCard :town="item" link />
				</template>
			</div>
		</Page>
	</ScrollNotifier>
</template>

<style lang="scss" scoped>
.towns-index-page {
	@include flex(column, flex-start, center);
	padding-bottom: 3em;

	.towns {
		@include flex(column);
		width: 80%;
		max-width: 600px;

		row-gap: 1em;
	}
}
</style>
