import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/common/request'
import appConfig from '@/App.json'
import { Router } from '@/common/uniapp.expand'
import { promiseMerge } from '@/common/util'
import { configMerge } from '@/common'
import { AMap } from '@/common/amap'

Vue.use(Vuex)

const amap = new AMap({
    key: '74e0850fcc432a009300f333346062df'
})

const store = new Vuex.Store({
    state: {
        user: {
            id: '',
            logo: '',
            name: '',
            sex: '',
            gender: ''
        },
        config: {
            keyInit: [
                'mxzb_config'
            ],
            keyAsync: [
                'mxzb_config_miniapp',
                'qyqxConfig'
            ]
        },
        wallet: {
            coin: 0,
            sign: '',
            signTimes: 0,
            signTimesTotal: 0
        }
    },
    getters: {
        config(state) {
            const config = { ...state.config }
            config.keyAsync.forEach(key => {
                Object.defineProperty(config, key.replace(/_test$/, ''), {
                    get: () => {
                        return app.service('/conf').get(key).then(res => configMerge(res.val))
                    }
                })
            })
            return config
        }
    },
    mutations: {
        // 修改用户信息
        setUser(state, user = {}) {
            const { _id, nickname, avatar, sex } = user
            state.user = {
                ...state.user,
                id: _id,
                logo: avatar,
                name: nickname,
                gender: sex,
                sex: ['未知', '男', '女'][sex || 0]
            }
        },
        // 修改钱包信息
        setWallet(state, wallet = {}) {
            const { coin, sign, signTimes, signTimesTotal } = wallet
            state.wallet = {
                ...state.wallet,
                coin,
                sign,
                signTimes,
                signTimesTotal
            }
        },
        // 修改配置信息
        setConfig(state, config = {}) {
            state.config = {
                ...state.config,
                ...config
            }
        }
    },
    actions: {
        // 获取code
        userCode() {
            return new Promise((resolve, reject) => {
                // #ifdef MP-WEIXIN
                uni.login({
                    scopes: 'auth_user',
                    timeout: appConfig.network.timeout,
                    complete: ({ errMsg, code }) => {
                        /ok/.test(errMsg) && code ? resolve(code) : reject({
                            message: '用户登录失败，未获得到code'
                        })
                    }
                })
                // #endif
                // #ifdef H5
                const code = Router.$Route.query.code
                code ? resolve(code) : reject({
                    message: '用户登录失败，未获得到code'
                })
                // #endif
            })
        },
        // 用户登录
        userLogin({ dispatch }, { encryptedData, iv, avatarUrl, nickName, gender, inviterId, channelId, ald_media_id, ald_link_key } = {}) {
            return promiseMerge('userLogin', () => {
                return dispatch('userCode').then(code => {
                    // #ifdef MP-WEIXIN
                    return app.service(`~|wechat/${appConfig.appid.weixin}`)
                    // #endif
                    // #ifdef H5
                    return app.service(`~|wechat/${appConfig.appid.h5}`)
                    // #endif
                    .create({
                        encryptedData: encryptedData || undefined,
                        iv: iv || undefined
                    }, {
                        query: {
                            code: code,
                            // #ifdef MP-WEIXIN
                            type: 'miniapp',
                            userInfo: 1,
                            // #endif
                            // #ifdef H5
                            type: 'android',
                            userInfo: 0,
                            // #endif
                            avatar: avatarUrl || undefined,
                            nickname: nickName || undefined,
                            sex: gender || undefined,
                            inviterId: inviterId || undefined,
                            channelId: channelId || undefined,
                            ald_media_id: ald_media_id || undefined,
                            ald_link_key: ald_link_key || undefined
                        }
                    })
                }).then(res => {
                    return dispatch('userToken', res.accessToken)
                })
            })
        },
        // 换取新token、用户信息
        userToken({ state, commit }, accessToken) {
            return app.authenticate({
                strategy: 'jwt',
                accessToken
            }).then(res => {
                commit('setUser', res.user || {})
                return res
            })
        },
        // 用户唤起
        userCall({ dispatch }, { inviterId, channelId, ald_media_id, ald_link_key } = {}) {
            if (inviterId || channelId || (ald_media_id && ald_link_key)) {
                return dispatch('userLogin', {
                    inviterId,
                    channelId,
                    ald_media_id,
                    ald_link_key
                })
            } else {
                return new Promise((resolve, reject) => {
                    app.passport.getJWT().then(token => {
                        if (token) {
                            return token
                        } else {
                            throw {
                                message: 'token is undefined',
                            }
                        }
                    }).then(token => {
                        dispatch('userToken', token).then(resolve).catch(reject)
                    }).catch(err => {
                        dispatch('userLogin').then(resolve).catch(reject)
                    })
                })
            }
        },
        // 获取配置项列表
        configFind({ state, commit }) {
            const keyInit = state.config.keyInit
            return app.service('conf').find({
                query: {
                    $limit: keyInit.length,
                    _id: {
                        $in: keyInit
                    }
                }
            }).then(res => {
                const config = {}
                res.data.forEach(item => {
                    config[item._id.replace(/_test$/, '')] = configMerge(item.val)
                })
                commit('setConfig', config)
                return config
            })
        },
        // 高德数据接口
        amapGet(store, { key, options }) {
            return new Promise((resolve, reject) => {
                key = key || 'getRegeo'
                options = options || {}
                amap[key]({
                    ...options,
                    success: res => {
                        resolve(res)
                    },
                    fail: err => {
                        reject(err)
                    }
                })
            })
        },
        // 字体包下载到当前页面
        fontLoad(store, data) {
            return new Promise((resolve, reject) => {
                const err = { message: `字体“${data.name}”加载失败` }
                wx.loadFontFace({
                    family: data.name,
                    source: `url(${data.src})`,
                    complete: res => {
                        res.status === 'loaded' ? resolve(data.name) : reject(err)
                    }
                })
                setTimeout(() => reject(err), 5000)
            })
        },
        // 获取钱包信息
        walletGet({ state, commit }) {
            return app.service('divine-wallet').get(state.user.id).then(data => {
                const wallet = {
                    coin: data.coin,
                    sign: data.sign,
                    signTimes: data.signTimes,
                    signTimesTotal: data.signTimesTotal
                }
                commit('setWallet', wallet)
                return wallet
            })
        },
        // 生成临时字体包
        fontCreate({ dispatch }, data) {
            return app.service('~|divine-draw/initFonts').patch(null, data).then(res => {
                return dispatch('fontLoad', {
                    name: data.font,
                    src: res.data
                })
            })
        }
    }
})

// 获取并监听配置项
app.mqtt.subscribe('confchanged', { qos: 1 }, err => {
    err || app.mqtt.on('message', (top, message) => {
        let res = {}
        try {
            res = JSON.parse(message.toString())
        } catch (e) {}
        store.state.config.keyInit.includes(res._id) && store.commit('setConfig', {
            [res._id.replace(/_test$/, '')]: configMerge(res.val)
        })
    })
})
store.dispatch('configFind')

export default store
