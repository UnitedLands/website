<script lang="ts">
import { injectPlayer } from '@client/stores/players'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'PlayerAvatar'
})
</script>

<script lang="ts" setup>
const player = injectPlayer()
const playerName = computed(() => player.value?.name)
const playerAvatar = computed(() => `https://mc-heads.net/avatar/${playerName.value}`)
</script>

<template>
	<div class="player-avatar">
		<img :src="playerAvatar" />
	</div>
</template>

<style lang="scss" scoped>
.player-avatar {
}
</style>
