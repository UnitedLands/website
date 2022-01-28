import { defineMiddleware } from '@client/modules/middleware'
import is from '@lib/utils/is'

export default defineMiddleware(async (to, _from, context, redirect) => {
	if (to.name !== 'login') return
	const user = context.state.auth.current
	const loggingOut = Object.keys(to.query).includes('logout')

	if (user && !loggingOut) {
		const redirectQuery = to.query.redirect
		const n = { location: '/' }

		if (is.aArray(redirectQuery)) {
			const loc = redirectQuery.shift()
			if (loc) n.location = loc
		} else if (redirectQuery) n.location = redirectQuery

		return redirect(n)
	} else if (user && loggingOut) {
		await context.api.delete('auth')
		context.state.auth.current = null

		return redirect({ location: '/login' })
	}
})
