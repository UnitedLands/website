<script lang="ts">
import { injectPost } from '@client/stores/posts'
import date from '@lib/utils/date'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'PostDate'
})
</script>

<script lang="ts" setup>
const post = injectPost()

const created = computed(() => date(post.value.created))
const updated = computed(() => date(post.value.updated))
const deleted = computed(() => date(post.value.deleted))

const isUpdated = computed(() => !created.value.isSame(updated.value))
const isDeleted = computed(() => !!deleted.value.isValid())

const timeSinceCreated = computed(() => created.value.fromNow())
const timeSinceUpdated = computed(() => updated.value.fromNow())
const timeSinceDeleted = computed(() => deleted.value.fromNow())
</script>

<template>
	<div class="post-date">
		<span class="post-created">{{ timeSinceCreated }}</span>
		<span v-if="isUpdated && !isDeleted" class="post-updated"
			>(updated {{ timeSinceUpdated }})</span
		>
		<span v-else-if="isDeleted" class="post-updated">(deleted {{ timeSinceDeleted }})</span>
	</div>
</template>

<style lang="scss" scoped>
.post-date {
	@include flex(row);
	column-gap: 0.5em;
}
</style>
