<script lang="ts">
import { injectPost } from '@client/stores/posts'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'PostAuthor'
})
</script>

<script lang="ts" setup>
const post = injectPost()

const author = computed(() => post.value.author)
provideUser(author)
</script>

<template>
	<div class="post-author">
		<UserAvatar />
		<UserDisplayName />
	</div>
</template>

<style lang="scss" scoped>
.post-author {
	@include flex(row, flex-start, center);
	column-gap: 1em;
}
</style>
