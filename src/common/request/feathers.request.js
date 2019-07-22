import appConfig from '@/App.json'
import feathers from '@feathersjs/feathers'
import request from '@/common/request/request'

export default function(app) {
	const _http = new request(appConfig.network.request.base + appConfig.network.request.api)
	const _method = {
		get: (url, id) => ({ method: 'get', url: id ? `${url}/${id}` : url }),
		find: (url) => ({ method: 'get', url }),
		create: (url) => ({ method: 'post', url }),
		remove: (url, id) => ({ method: 'delete', url: id ? `${url}/${id}` : url }),
		update: (url, id) => ({ method: 'put', url: id ? `${url}/${id}?method=update` : `${url}?method=update` }),
		patch: (url, id) => ({ method: 'put', url: id ? `${url}/${id}?method=patch` : `${url}?method=patch` })
	}
	app.mixins.push(service => {
		service.hooks({
			before: context => {
				if (/^(.+\|)*\~\|/.test(context.path)) {
					const params = context.params || {}
					const accessToken = params.accessToken || ''
					return _http({
						header: {
							Authorization: ((accessToken || {}).token || {}).accessToken || (accessToken || {}).accessToken || accessToken,
						},
						..._method[context.method](context.path.replace(/^(.+\|)*\/?/, '/'), context.id),
						data: context.data || {},
						params: params.query || {}
					}).then(res => {
						context.result = res.data
						context.statusCode = res.statusCode
						return feathers.SKIP
					}).catch(res => {
						context.statusCode = res.statusCode
						throw res.data || res
					})
				}
			}
		})
	})
}