<script lang="ts">
import { injectPost } from '@client/stores/posts'
import MarkdownIt from 'markdown-it'
import { computed, defineComponent, h } from 'vue'

export default defineComponent({
	name: 'PostContent'
})
</script>

<script lang="ts" setup>
const post = injectPost()
const md = MarkdownIt()

const content = computed(() => {
	let content = post.value.content
	let rendered = md.render(content)
	const atMatches = content.matchAll(/(?<=^| )(?<at>@(?=\S)(?<username>\w*))/gm)

	for (const match of atMatches) {
		if (!match.groups) continue
		rendered = rendered.replaceAll(
			match.groups.at,
			`<a href="/users/${match.groups.username}" target="_blank" class="user-at"><b>${match.groups.at}</b></a>`
		)
	}

	return rendered
})
</script>

<template>
	<div class="post-content" v-html="content" />
</template>

<style lang="scss" scoped>
.post-content {
	:deep(.user-at) {
		color: var(--color-primary);
		text-decoration: none;
	}
}
</style>
