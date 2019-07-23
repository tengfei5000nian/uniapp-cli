export const promiseMerge =  new class {
    _premise = {}
    constructor() {
        const self = this
        return function (key, premiseReturn) {
            if (!self._premise[key]) self._premise[key] = premiseReturn().finally(() => {
                delete self._premise[key]
            })
            return new Promise((resolve, reject) => {
                self._premise[key].then(resolve).catch(reject)
            })
        }
    }
}

export function configMerge (config) {
  const currentSystem = ((uni.getSystemInfoSync() || {}).system || '').toLowerCase()
  const currentOS = ['ios', 'android'].find(os => ~currentSystem.indexOf(os)) || 'ios'
  // #ifdef MP-WEIXIN
  const currentClient = 'weixin'
  // #endif
  // #ifdef MP-BAIDU
  const currentClient = 'baidu'
  // #endif
  // #ifdef MP-TOUTIAO
  const currentClient = 'toutiao'
  // #endif
  // #ifdef MP-ALIPAY
  const currentClient = 'alipay'
  // #endif
  // #ifdef H5
  const currentClient = 'h5'
  // #endif
  // #ifdef APP-PLUS
  const currentClient = 'app'
  // #endif
  const merge = item => {
    if (item instanceof Object && item.constructor === Object) {
      if (typeof item.default === 'undefined') {
        const itemNew = {}
        for (let key in item) {
          itemNew[key] = typeof item.force !== 'boolean' || item.force === true ? merge(item[key]) : false
        }
        return itemNew
      } else {
        let itemCurrent = null
        if (typeof (item[currentClient] || {})[currentOS] !== 'undefined') {
          itemCurrent = (item[currentClient] || {})[currentOS]
        } else if (typeof (item[currentClient] || {}).default !== 'undefined') {
          itemCurrent = (item[currentClient] || {}).default
        } else if (typeof item[currentClient] !== 'undefined') {
          itemCurrent = item[currentClient]
        } else if (typeof item[currentOS] !== 'undefined') {
          itemCurrent = item[currentOS]
        } else {
          itemCurrent = item.default
        }
        return merge(itemCurrent)
      }
    } else {
      return item
    }
  }
  return config.configMerge ? merge(config) : config
}
