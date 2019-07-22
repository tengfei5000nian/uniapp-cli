import appConfig from '@/App.json'
import cryptojs from 'crypto-js'

export default function(app) {
	const _encrypt = (val, encode = false) => {
		const jsonText = typeof val === 'string' ? val : JSON.stringify(val)
		const encryptText = cryptojs.AES.encrypt(jsonText, appConfig.network.encryptKey).toString()
		return encode ? encodeURIComponent(encryptText) : encryptText
	}
	const _decrypt = (val, encode = false) => {
		const encryptText = encode ? decodeURIComponent(val) : val
		const jsonText = cryptojs.AES.decrypt(encryptText, appConfig.network.encryptKey).toString(cryptojs.enc.Utf8)
		try {
			return JSON.parse(jsonText)
		} catch (e) {
			return jsonText
		}
	}
	app.mixins.push(service => {
		service.hooks({
			before: context => {
				if (!/^(.+\|)*\!\*\|/.test(context.path) && (/^(.+\|)*\*\|/.test(context.path) || appConfig.network.encryptDefault)) {
					if (context.data) context.data = { payload: _encrypt(context.data) }
					if ((context.params || {}).query) context.params.query = { payload: _encrypt(context.params.query, true) }
				}
			},
			error: context => {
				if ((context.data || {}).payload) context.data = _decrypt(context.data.payload)
				if (((context.params || {}).query || {}).payload) context.params.query = _decrypt(context.params.query.payload, true)
			}
		})
	})
}