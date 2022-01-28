<script lang="ts">
import { PostData } from '@server/database/models/Post'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'PostFeed'
})
</script>

<script lang="ts" setup>
const props = defineProps<{
	posts: PostData[]
}>()

const posts = computed(() => props.posts)
const createdSortDirection = ref(false)

const sortOldestFirst = (a: PostData, b: PostData) =>
	new Date(a.created).valueOf() - new Date(b.created).valueOf()
const sortNewestFirst = (a: PostData, b: PostData) =>
	new Date(b.created).valueOf() - new Date(a.created).valueOf()

const sortedPosts = computed(() =>
	posts.value.sort(createdSortDirection.value ? sortOldestFirst : sortNewestFirst)
)
</script>

<template>
	<div class="post-feed">
		<FormButton @click="createdSortDirection = !createdSortDirection">
			{{ createdSortDirection ? 'Oldest Frist' : 'Newest First' }}
		</FormButton>

		<template v-for="post of sortedPosts" :key="post.uuid">
			<PostCard :item="post" />
		</template>
	</div>
</template>

<style lang="scss" scoped>
.post-feed {
	@include flex(column);
	width: 600px;
	row-gap: 1em;

	.post-card {
		width: 100%;
	}
}
</style>
