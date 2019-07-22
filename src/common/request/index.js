import feathers from '@/common/request/feathers'
import network from '@/common/request/feathers.network'
import crypto from '@/common/request/feathers.crypto'
import request from '@/common/request/feathers.request'
import error from '@/common/request/feathers.error'
import mqtt from '@/common/request/feathers.mqtt'

feathers.configure(network)
feathers.configure(crypto)
feathers.configure(request)
feathers.configure(error)
feathers.configure(mqtt)

export default feathers