import { defineMiddleware } from '@client/modules/middleware'

export default defineMiddleware(async (to, from, context, redirect) => {
	const user = context.state.auth.current
	const goingToLogin = to.fullPath.startsWith('/login')

	if (!user && !goingToLogin) {
		console.info('redirecting user')
		return redirect({
			location: `/login?redirect=${to.fullPath}`
		})
	}
})
