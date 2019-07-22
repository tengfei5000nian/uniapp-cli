import appConfig from '@/App.json'
import mqtt from 'mqtt'

export default function(app) {
    const client  = mqtt.connect(appConfig.network.mqtt.base + appConfig.network.mqtt.api)
    app.mqtt = client
}