<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { providePost, usePosts } from '@client/stores/posts'
import Post, { PostData } from '@server/database/models/Post'

export default defineComponent({
	name: 'PostCreateForm'
})
</script>

<script lang="ts" setup>
type Props = {
	post?: PostData
}

const props = defineProps<Props>()
const emptyPost = reactive(
	Post.init({
		content: '',
		title: ''
	}).toJSON()
)

const emit = defineEmits<{
	(e: 'created', post: PostData): void
	(e: 'cancel'): void
}>()

const posts = usePosts()

const data = computed(() => props.post ?? emptyPost)

const isEditing = computed(() => !!data.value.uuid)
const showPreview = ref(false)
const addTitle = ref(false)

async function createPost() {
	if (!data.value.content || !data.value.content.length) return
	try {
		const action = isEditing.value ? posts.update(data.value) : posts.create(data.value)
		const post = await action

		showPreview.value = false
		emit('created', post)
		if (isEditing.value) emit('cancel')
		else
			Object.assign(emptyPost, {
				content: '',
				title: ''
			})
	} catch (e) {
		console.log(e)
	}
}

providePost(data)
</script>

<template>
	<form class="post-create-form" @submit.prevent="createPost">
		<input v-if="addTitle" v-model="data.title" class="title-input" placeholder="Title..." />

		<textarea
			v-if="!showPreview"
			v-model="data.content"
			class="content"
			placeholder="What's on your mind?"
			required
		/>
		<PostContent v-else class="content" />

		<div class="action-bar">
			<div class="actions">
				<FormButton
					class="flat show-preview"
					:class="{ enabled: showPreview }"
					@click="showPreview = !showPreview"
				>
					{{ showPreview ? 'Hide Preview' : 'Show Preview' }}
				</FormButton>
				<!-- <FormButton
					class="flat add-title"
					:class="{ added: addTitle }"
					@click="addTitle = !addTitle"
				>
					Title
				</FormButton> -->
			</div>

			<FormButton v-if="isEditing" class="cancel-btn flat" @click="emit('cancel')">
				Cancel
			</FormButton>
			<FormButton class="create-btn flat" type="submit">
				{{ isEditing ? 'Update' : 'Post' }}
			</FormButton>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.post-create-form {
	@include flex(column);

	width: 100%;
	max-width: 600px;

	.title-input {
		width: 100%;
		padding: 0.5em;
		padding-bottom: calc(0.5em + 30px);
		margin-bottom: -30px;

		border: none;
		outline: none;

		font-size: 1.2em;

		z-index: 1;

		border-top-left-radius: var(--border-radius, 5px);
		border-top-right-radius: var(--border-radius, 5px);
	}

	.content {
		grid-area: input;
		width: 100%;
		min-height: 100px;
		max-height: 70vh;
		padding: 1em;

		border: 1px solid lightgray;
		border-bottom: none;
		background-color: white;
		color: black;

		z-index: 2;

		outline: none;

		resize: vertical;
		border-radius: var(--border-radius, 5px);
	}

	.action-bar {
		@include flex(row);
		column-gap: 0.5em;
		width: 100%;
		padding: 0.5em;
		padding-top: calc(0.5em + 30px);
		margin-top: -30px;

		background-color: lightgray;
		border-bottom-left-radius: var(--border-radius, 5px);
		border-bottom-right-radius: var(--border-radius, 5px);

		.actions {
			@include flex(row);
			width: 100%;

			.add-title {
				&.added {
					--button-background: red;
					--button-ripple: darkred;
				}
			}
		}

		.cancel-btn,
		.create-btn {
			flex-shrink: 0;
		}

		.create-btn {
			align-self: flex-end;
		}
	}
}
</style>
