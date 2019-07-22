import '@/common/polyfill'

import Vue from 'vue'
import App from '@/App'

import store from '@/store'
import request from '@/common/request'
import expand, { Message } from '@/common/uniapp.expand'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$io = request

Vue.use(expand)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()

// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
// 小程序触发更新
const updateManager = uni.getUpdateManager()
updateManager.onUpdateReady(() => {
  Message.toast.show({
      title: '发现新版小程序，将在3秒后重启',
      closeSend: true,
      duration: 3000
  }).then(() => {
      uni.clearStorage()
      updateManager.applyUpdate()
  })
})
// #endif