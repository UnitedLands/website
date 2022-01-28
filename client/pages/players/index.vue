<script lang="ts">
import { usePlayers } from '@client/stores/players'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
	name: 'PlayersIndexPage'
})
</script>

<script lang="ts" setup>
const players = usePlayers()

onMounted(() => {
	players.list().then(console.log)
})
</script>

<template>
	<Page class="players-index-page">
		<PageTitle>Players</PageTitle>
	</Page>
</template>

<style lang="scss" scoped>
.players-index-page {
}
</style>
