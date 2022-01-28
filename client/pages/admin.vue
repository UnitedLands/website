<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AdminPage'
})
</script>

<script lang="ts" setup></script>

<template>
	<RouterView />
</template>

<route>
meta:
  layout: admin
  middleware:
    - isAdmin
</route>
