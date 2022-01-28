import api from '@server/includes/api'
import ServerError from '@server/includes/ServerError'

export default api.defineMiddleware({
	onRequest(request, _reply, done) {
		const auth = request.session.data.auth
		auth?.current ? done() : done(new ServerError('unauthorized', 401))
	}
})
