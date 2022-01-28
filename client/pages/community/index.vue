<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { usePosts } from '@client/stores/posts'
import PostsAPIRoute from '@server/api/posts'
import { computed, defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'

export default defineComponent({
	name: 'PostsPage'
})
</script>

<script lang="ts" setup>
const posts = usePosts()
const auth = useAuth()

const fetching = ref(false)
const params = reactive({
	page: 0,
	limit: 10
})
const itemsToDisplay = ref<Set<string>>(new Set())
const items = computed(() =>
	posts.state.items.filter(post => !post.deleted && itemsToDisplay.value.has(post.uuid))
)

async function fetch() {
	if (fetching.value) return
	else fetching.value = true

	try {
		params.page++
		const results = await posts.fetch(params)

		for (const item of results.items) {
			itemsToDisplay.value.add(item.uuid)
		}

		fetching.value = false
	} catch {
		params.page--

		setTimeout(() => {
			fetching.value = false
		}, 5000)
	}
}

function onScrolled(percent: number) {
	if (percent >= 0.75) fetch()
}

onBeforeMount(() => fetch())
</script>

<template>
	<ScrollNotifier v-slot="{ onScroll, onWheel }" @scrolled="onScrolled">
		<Page class="posts-page" @scroll.self="onScroll" @wheel.self="onWheel">
			<h1>Posts</h1>
			<PostCreateForm v-if="auth.isLoggedIn" @created="itemsToDisplay.add($event.uuid)" />

			<PostFeed :posts="items" />
		</Page>
	</ScrollNotifier>
</template>

<style lang="scss" scoped>
.posts-page {
	@include flex(column, flex-start, center);

	.post-feed {
		margin-top: 1em;
	}
}
</style>
