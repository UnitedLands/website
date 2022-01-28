import { defineMiddleware } from '@client/modules/middleware'

export default defineMiddleware(async (to, from, context, redirect) => {
	const user = context.state.auth.current
	const hasAdminRole = user?.roles.find(role => role.name === 'admin')

	if (!user)
		return redirect({
			location: `/login?redirect=${to.fullPath}`
		})
	else if (!hasAdminRole)
		return redirect({
			location: '/'
		})
})
