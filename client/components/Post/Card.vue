<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { providePost, usePosts } from '@client/stores/posts'
import { PostData } from '@server/database/models/Post'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'PostCard'
})
</script>

<script lang="ts" setup>
const auth = useAuth()
const posts = usePosts()
const props = defineProps<{
	item: PostData
}>()

const post = computed(() => props.item)

const edit = ref(false)
const isAuthor = computed(
	() => auth.state.current && auth.state.current.name === post.value.author.name
)
const isTrashed = computed(() => !!post.value.deleted)

async function trashPost() {
	try {
		if (isTrashed.value) posts.restore(post.value)
		else posts.trash(post.value)
	} catch (e) {
		console.log(e)
	}
}

providePost(post)
</script>

<template>
	<div v-if="!edit" class="post-card">
		<PostDetails />

		<PostContent />

		<div class="post-actions">
			<div class="actions"></div>

			<FormButton v-if="isAuthor || auth.isAdmin" class="delete-btn" @click="trashPost">
				{{ isTrashed ? 'Restore' : 'Trash' }}
			</FormButton>

			<FormButton v-if="isAuthor || auth.isAdmin" class="edit-btn" @click="edit = !edit">
				Edit
			</FormButton>
		</div>
	</div>
	<PostCreateForm v-else :post="post" @cancel="edit = false" />
</template>

<style lang="scss" scoped>
.post-card {
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: auto auto;
	grid-template-areas: 'author date' 'content content' 'actions actions';
	width: 600px;

	padding: 1em;
	background-color: white;
	color: black;
	border-radius: var(--border-radius, 5px);

	.post-author {
		grid-area: author;
	}

	.post-date {
		grid-area: date;
	}

	.post-content {
		grid-area: content;
	}

	.post-actions {
		grid-area: actions;
		@include flex(row);
		column-gap: 0.5em;
		width: 100%;

		.actions {
			flex: 1;
		}
	}
}
</style>
