<script lang="ts">
import { injectPost } from '@client/stores/posts'
import { provideUser } from '@client/stores/users'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'PostDetails'
})
</script>

<script lang="ts" setup>
const post = injectPost()
const user = computed(() => post.value.author)

provideUser(user)
</script>

<template>
	<div class="post-details">
		<UserAvatar />
		<UserDisplayName v-slot="{ displayName }">
			<Link :to="`/users/${user?.name}`">
				{{ displayName }}
			</Link>
		</UserDisplayName>
		<PostDate />
	</div>
</template>

<style lang="scss" scoped>
.post-details {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: 1fr auto auto 1fr;
	grid-template-areas: 'avatar .' 'avatar displayname' 'avatar date' 'avatar .';
	column-gap: 0.5em;

	.user-avatar {
		grid-area: avatar;
	}

	.user-display-name {
		grid-area: displayname;

		.link {
			color: inherit;
			text-decoration: none;
		}
	}

	.post-date {
		grid-area: date;
		font-size: 0.8em;
		font-style: italic;
	}
}
</style>
