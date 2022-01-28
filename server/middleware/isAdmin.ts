import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

export default api.defineMiddleware({
	onRequest(request, _reply, done) {
		const user = request.session.data.auth?.current
		if (!user) return done(new ServerError('unauthed', 401))
		if (!user.roles.find(role => role.name === 'admin'))
			return done(new ServerError('not admin', 401))
		return done()
	}
})
