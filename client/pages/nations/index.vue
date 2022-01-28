<script lang="ts">
import { sortByBalance } from '@client/functions'
import { useNations } from '@client/stores/nations'
import { computed, defineComponent, onBeforeMount, reactive, ref } from 'vue'

export default defineComponent({
	name: 'NationsIndexPage'
})
</script>

<script lang="ts" setup>
const nations = useNations()
const ids = ref(new Set<string>())
const total = ref(0)
const items = computed(() =>
	nations.state.items.filter(item => ids.value.has(item.name)).sort(sortByBalance())
)

let errorTimeout: any
const fetching = ref(false)
const params = reactive({
	page: 0
})

async function fetch() {
	if (fetching.value) return
	else fetching.value = true

	try {
		params.page++
		const res = await nations.list(params)

		total.value = res.total
		res.items.forEach(item => ids.value.add(item.name))
		fetching.value = false
	} catch (error) {
		params.page--
		console.log(error)

		if (errorTimeout) clearTimeout(errorTimeout)
		errorTimeout = setTimeout(() => {
			fetching.value = false
		}, 10000)
	}
}

function scrolled(percent: number) {
	if (percent > 0.75) fetch()
}

onBeforeMount(() => {
	fetch()
})
</script>

<template>
	<ScrollNotifier v-slot="{ onScroll, onWheel }" @scrolled="scrolled">
		<Page class="nations-index-page" @scroll.self.passive="onScroll" @wheel.self.passive="onWheel">
			<PageTitle>Nations ({{ total }})</PageTitle>

			<div class="nations">
				<template v-for="item of items" :key="item.name">
					<NationCard :nation="item" link />
				</template>
			</div>
		</Page>
	</ScrollNotifier>
</template>

<style lang="scss" scoped>
.nations-index-page {
	@include flex(column, flex-start, center);
	padding-bottom: 3em;

	.nations {
		@include flex(column);
		width: 80%;
		max-width: 600px;

		row-gap: 1em;
	}
}
</style>
