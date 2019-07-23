import appConfig from '@/config'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const app = feathers()
const token = res => {
	res = typeof res === 'object' ? (res.token || res.accessToken) : res
	res = typeof res === 'object' ? res.accessToken : res
	return res
}

app.configure(socketio(io(appConfig.network.socket.base, {
    path: appConfig.network.socket.api,
    transports: ['websocket']
}), {
	timeout: appConfig.network.timeout
}))
app.configure(auth({
	storageKey: 'feathers-jwt',
	storage: {
		setItem(key, value) {
			return uni.setStorageSync(key, token(value))
		},
		getItem(key) {
			return uni.getStorageSync(key) || appConfig.network.accessToken || ''
		},
		removeItem(key) {
			return uni.removeStorageSync(key)
		}
	}
}))

export default app