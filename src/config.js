export default {
    appid: {
        h5: 'wx117f2040e8ca257c',
        weixin: 'wx7005e137dbf2ba93'
    },
    network: {
        accessToken: '',
        timeout: 10000,
        encryptDefault: false,
        encryptKey:' jahaladopuxido',
        api: {
            login: '/wechat'
        },
        mqtt: {
            enable: false,
            base: 'ws://106.15.185.223',
            api: ':3300'
        },
        socket: {
            enable: true,
            base: 'wss://xcx.feesource.xyz',
            api: '/api/socket.io'
        },
        request: {
            enable: false,
            base: 'https://xcx.feesource.xyz',
            api: '/api'
        }
    },
    path: {
        home: '/pages/home/home',
        tabbar: [
            '/pages/home/home',
            '/pages/test/test'
        ]
    }
}