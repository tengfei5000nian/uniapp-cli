export default class {
	constructor(baseUri, config) {
		if (baseUri) this._baseUri = baseUri
		if (config) this._config = config
		return this.http.bind(this)
	}
	_baseUri = 'https://'
	_config = {}
	_search(value = [], key) {
		if (value instanceof Array) {
			return [].concat(...value.map((val, index) => {
				return key ? (this._search(val, `${key}[${index}]`) || [/\]$/.test(key) ? `${key}=${val}` : `${key}[]=${val}`]) : (this._search(val) || [val])
			}))
		} else if (value && value instanceof Object) {
			return [].concat(...Object.keys(value).map(k => {
				return key ? (this._search(value[k], `${key}[${k}]`) || [`${key}[${k}]=${value[k]}`]) : (this._search(value[k], k) || [`${k}=${value[k]}`])
			}))
		} else {
			return false
		}
	}
	_query(params = {}) {
		const paramsFilter = {}
		for (let key in params) {
			if (key !== 'queryFormat') paramsFilter[key] = params[key]
		}
		return this._search(paramsFilter).concat(params.queryFormat ? [params.queryFormat] : []).join('&')
	}
	http(config = {}) {
		return new Promise((resolve, reject) => {
			config = { ...this._config, ...config }
			const { url, params } = config
			if (!url) return reject({ message: 'url不能为空' })
			uni.request({
				...config,
				url: (/^https?/.test(url) ? url : this._baseUri + url) + (Object.keys(params || {}).length ? (/\?/.test(url) ? '&' : '?') + this._query(params) : ''),
				complete: res => {
					res.statusCode && res.statusCode >= 200 && res.statusCode < 400 ? resolve(res) : reject(res)
				}
			})
		})
	}
}
