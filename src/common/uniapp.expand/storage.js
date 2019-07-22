import { dateObject, dateFormat } from '@/common/util'

export default new class {
	_data = {}
    _keyStorageWebkit = '#'
    _keyStorageWebkitRE = /^\#/
    set(key, value, type) {
        const isStorage = this._keyStorageWebkitRE.test(key)
        const keyReal = key.replace(this._keyStorageWebkitRE, '')
        const data = {
            value,
            type: dateObject(type, false) || (typeof type === 'number' ? type : false) || (/^\d+$/.test(type) ? parseInt(type) : false) || undefined
        }
        if (isStorage) {
            this.remove(keyReal, 'data')
            uni.setStorageSync(keyReal, data)
        } else {
            this.remove(keyReal, 'storage')
            this._data[keyReal] = data
        }
    }
    get(key, remove) {
        const keyReal = key.replace(this._keyStorageWebkitRE, '')
        let isStorage = false
        let data = this._data[keyReal]
        if (!data) {
            data = uni.getStorageSync(keyReal)
            if (data) isStorage = true
        }
        if (data instanceof Object && data.constructor === Object) {
            const type = dateObject(data.type, false) || data.type
            if (type instanceof Date) {
                if (new Date() >= type) {
                    this.remove(keyReal)
                } else {
                    return data.value
                }
            } else if (typeof type === 'number') {
                if (type > 1) {
                    this.set(this._keyStorageWebkit + keyReal, {
                        ...data,
                        type: type - 1
                    })
                } else {
                    this.remove(keyReal)
                }
                return data.value
            } else {
                return data.value
            }
        }
    }
    remove(key, seat = 'all') {
        if (seat === 'all' || seat === 'data') delete this._data[key]
        if (seat === 'all' || seat === 'storage') uni.removeStorage({ key })
    }
    install(Vue) {
    	Vue.prototype.$Storage = this
    }
}