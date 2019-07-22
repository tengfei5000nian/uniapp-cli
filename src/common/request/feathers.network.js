import feathers from '@feathersjs/feathers'
import { Message } from '@/common/uniapp.expand'

export default function(app) {
    let state = null
    const next = (resolve, reject) => {
        state ? resolve() : reject({
            message: '网络已断开！'
        })
    }
    const network = () => new Promise((resolve, reject) => {
        typeof state === 'boolean' ? next(resolve, reject) : uni.getNetworkType({
            complete: ({ networkType }) => {
                state = networkType !== 'none'
                next(resolve, reject)
            }
        })
    })
    uni.onNetworkStatusChange(({ isConnected }) => {
        state = isConnected
    })
    app.mixins.push(service => {
        service.hooks({
            before: context => network()
        })
    })
}