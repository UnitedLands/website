<script lang="ts">
import { sortByBalance } from '@client/functions'
import { useResidents } from '@client/stores/residents'
import { computed, defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'

export default defineComponent({
	name: 'ResidentsIndexPage'
})
</script>

<script lang="ts" setup>
const residents = useResidents()

let errorTimeout: any
let searchTimeout: any

const fetching = ref(false)
const params = reactive({
	page: 0,
	limit: 20,
	search: ''
})

const search = computed({
	get: () => params.search,
	set: v => {
		params.search = v
	}
})

const totalResidentsRaw = ref(0)
const totalResidents = computed(() =>
	new Intl.NumberFormat('en-US', {
		style: 'decimal'
	}).format(totalResidentsRaw.value)
)

const itemsToDisplay = ref(new Set<string>())
const items = computed(() =>
	residents.state.items.filter(r => itemsToDisplay.value.has(r.name)).sort(sortByBalance('DESC'))
)

async function fetch(clear = false) {
	if (fetching.value) return
	else fetching.value = true

	try {
		if (clear) params.page = 0
		params.page++
		const { total, items } = await residents.list(params)

		totalResidentsRaw.value = total
		if (clear) itemsToDisplay.value.clear()
		for (const item of items) itemsToDisplay.value.add(item.name)
		fetching.value = false
	} catch (error) {
		params.page--
		console.error(error)

		clearTimeout(errorTimeout)
		errorTimeout = setTimeout(() => {
			fetching.value = false
			errorTimeout = null
		}, 10000)
	}
}

function scrolled(percent: number) {
	if (percent > 0.75 && !searchTimeout) fetch()
}

onBeforeMount(() => {
	fetch()
})

watch([search], () => {
	clearTimeout(searchTimeout)
	searchTimeout = setTimeout(async () => {
		if (errorTimeout) {
			clearTimeout(errorTimeout)
			errorTimeout = null
			fetching.value = false
		}

		await fetch(true)
		searchTimeout = null
	}, 500)
})
</script>

<template>
	<ScrollNotifier v-slot="{ onScroll, onWheel }" @scrolled="scrolled">
		<Page
			class="residents-index-page"
			@scroll.self.passive="onScroll"
			@wheel.self.passive="onWheel"
		>
			<h1>Residents ({{ totalResidents }})</h1>

			<FormInput v-model="search" class="search" label="Search" />

			<div class="items">
				<template v-for="item of items" :key="item.name">
					<ResidentCard :resident="item" withTown withNation link />
				</template>
			</div>
		</Page>
	</ScrollNotifier>
</template>

<style lang="scss" scoped>
.residents-index-page {
	@include flex(column, flex-start, center);
	row-gap: 1em;

	& > * {
		flex-shrink: 0;
	}

	.search {
		width: 600px;
	}

	.items {
		@include flex(column);
		row-gap: 1em;
	}
}
</style>
