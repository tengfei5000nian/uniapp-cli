import Vue from 'vue'
import mqtt from 'mqtt'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

const client  = mqtt.connect('ws://106.15.185.223:3300')
client.on('connect', () => {
	client.subscribe('confchanged', { qos: 1 })
    client.on('message', (topic, message) => {
        console.log(topic, message)
    })
})
