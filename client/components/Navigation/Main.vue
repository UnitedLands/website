<script lang="ts">
import { useAuth } from '@client/stores/auth'
import { computed, defineComponent } from 'vue'

export default defineComponent({
	name: 'NavigationMain'
})
</script>

<script lang="ts" setup>
const auth = useAuth()

const isAdmin = computed(
	() => auth.isLoggedIn && !!auth.state.current?.roles.find(role => role.name === 'admin')
)
</script>

<template>
	<nav class="navigation-main">
		<div class="brand">
			<h1 class="brand-name">UnitedLands</h1>
		</div>

		<div class="menu">
			<Link to="/">Home</Link>
			<Link to="/map">Map</Link>
			<Link to="/residents">Residents</Link>
			<Link to="/towns">Towns</Link>
			<Link to="/nations">Nations</Link>
			<Link to="/community">Community</Link>

			<Link v-if="isAdmin" to="/admin">Admin</Link>

			<Link v-if="!auth.isLoggedIn" to="/register">Register</Link>

			<Link v-if="auth.isLoggedIn" to="/login?logout=true">Logout</Link>
			<Link v-else to="/login">Login</Link>
		</div>

		<NavigationProfile />
	</nav>
</template>

<style lang="scss" scoped>
.navigation-main {
	display: grid;
	grid-template-columns: auto 1fr auto auto;
	grid-template-areas: 'brand . menu profile';
	column-gap: 1em;

	width: 100%;
	// padding: 0.5em 1em;

	border-bottom: 1px solid gray;

	.brand {
		grid-area: brand;
		padding: 0.5em 1em;
	}

	.menu {
		grid-area: menu;
		@include flex(row, space-between, center);
		column-gap: 1em;

		.link {
			color: var(--color-primary-text);
		}
	}

	.navigation-profile {
		grid-area: profile;
		padding: 0.5em 1em;

		border-left: 1px solid gray;
	}
}
</style>
