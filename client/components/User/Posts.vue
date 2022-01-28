<script lang="ts">
import { usePosts } from '@client/stores/posts'
import { injectUser } from '@client/stores/users'
import PostsAPIRoute from '@server/api/posts'
import { PostData } from '@server/database/models/Post'
import { uniqBy } from 'lodash'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'

export default defineComponent({
	name: 'UserPosts'
})
</script>

<script lang="ts" setup>
type Props = {
	params?: PostsAPIRoute.Query
}

const props = withDefaults(defineProps<Props>(), {
	params: () => ({
		withDeleted: false
	})
})

const posts = usePosts()
const user = injectUser()

const itemsToDisplay = ref(new Set<string>())
const items = computed(() => posts.state.items.filter(post => itemsToDisplay.value.has(post.uuid)))

async function fetch() {
	if (!user.value) return
	try {
		const res = await posts.listByUser(user.value.name, props.params)
		for (const item of res.items) itemsToDisplay.value.add(item.uuid)
	} catch (e) {
		console.log(e)
	}
}

onBeforeMount(() => {
	fetch()
})
</script>

<template>
	<PostFeed :posts="items" class="user-posts" />
</template>

<style lang="scss" scoped>
.user-posts {
	@include flex(column);
	row-gap: 1em;
}
</style>
