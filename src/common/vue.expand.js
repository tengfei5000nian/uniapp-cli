import appConfig from '@/App.json'
import { loadImg } from '@/common'

export const tabbar = {
    
}

export const pages = {
    onShareAppMessage(e) {
        const format = this.onShareAppMessage
        const config = {
            title: '解惑当下，预见未来',
            // imageUrl: '/static/main/share.png',
            path: '/pages/home/home'
        }
        return typeof format === 'function' ? format(config, e) : config
    },
    methods: {
        isAuth() {
            return new Promise(resolve => {
                (this.$io.io || this.$io.primus || {}).authenticated ? resolve() : this.$store.dispatch('userCall', this.$Route.query).then(resolve).catch(err => {
                    Promise[this.$root.$refs.meLogin ? 'resolve' : 'reject']().then(() => {
                        return this.$root.$refs.meLogin.open().then(resolve)
                    }).catch(err => {
                        this.$Route.path === appConfig.path.home || this.$Toast.show({
                            title: '未授权，请先登录！',
                            closeSend: true
                        }).then(() => {
                            this.$Router.push({
                                path: appConfig.path.home,
                                type: 'reLaunch'
                            })
                        })
                    })
                })
            })
        }
    }
}

export const canvas = {
    computed: {
        canvasStyle() {
            const width = this.width
            const height = this.height
            return width && height ? {
                width: width + 'px',
                height: height + 'px'
            } : {}
        }
    },
    methods: {
        image: loadImg,
        box(context, options = {}) {
            const defaults = {
                left:0,
                top: 0,
                width: 100,
                height: 100,
                radius: 0,
                ...options
            }
            
            context.save()
            defaults.color && context.setFillStyle(defaults.color)
            context.beginPath()
            
            context.arc(defaults.left + defaults.radius, defaults.top + defaults.radius, defaults.radius, Math.PI, Math.PI * 1.5)
            
            context.moveTo(defaults.left + defaults.radius, defaults.top)
            context.lineTo(defaults.left + defaults.width - defaults.radius, defaults.top)
            context.lineTo(defaults.left + defaults.width, defaults.top + defaults.radius)
            
            context.arc(defaults.left + defaults.width - defaults.radius, defaults.top + defaults.radius, defaults.radius, Math.PI * 1.5, Math.PI * 2)
                           
            context.lineTo(defaults.left + defaults.width, defaults.top + defaults.height - defaults.radius)
            context.lineTo(defaults.left + defaults.width - defaults.radius, defaults.top + defaults.height)
            
            context.arc(defaults.left + defaults.width - defaults.radius, defaults.top + defaults.height - defaults.radius, defaults.radius, 0, Math.PI * 0.5)
            
            context.lineTo(defaults.left + defaults.radius, defaults.top + defaults.height)
            context.lineTo(defaults.left, defaults.top + defaults.height - defaults.radius)
            
            context.arc(defaults.left + defaults.radius, defaults.top + defaults.height - defaults.radius, defaults.radius, Math.PI * 0.5, Math.PI)
            
            context.lineTo(defaults.left, defaults.top + defaults.radius)
            context.lineTo(defaults.left + defaults.radius, defaults.top)
            
            context.fill()
            
            context.closePath()
            context.clip()
            typeof defaults.slot === 'function' && defaults.slot()
            context.restore()
        },
        text(context, options = {}) {
            const defaults = {
                left:0,
                top: 0,
                maxWidth: 750,
                maxLine: 999,
                align: 'left',
                baseline: 'top',
                style: 'normal',
                weight: 'normal',
                fontSize: 28,
                family: 'sans-serif',
                lineHeight: 28,
                color: '#333',
                ...options
            }
            const lineFontSum = Math.ceil(defaults.maxWidth / defaults.fontSize)
            const lineSum = Math.ceil(defaults.text.length / lineFontSum)
            const lineCurrent = lineSum > defaults.maxLine ? defaults.maxLine : lineSum
            context.save()
            context.font = `${defaults.style} ${defaults.weight} ${defaults.fontSize}px/1 ${defaults.family}`
            context.setFillStyle(defaults.color)
            context.setTextAlign(defaults.align)
            context.setTextBaseline(defaults.baseline)
            for (let i = 0; i < lineCurrent; i++) {
                context.fillText(defaults.text.slice(0 + i * lineFontSum, 0 + (i + 1) * lineFontSum) + (i >= lineCurrent - 1 && lineSum > defaults.maxLine ? '…' : ''), defaults.left, defaults.top + i * defaults.lineHeight, defaults.maxWidth)
            }
            context.restore()
        },
        textVertical(context, options = {}) {
            const defaults = {
                left:0,
                top: 0,
                align: 'left',
                baseline: 'top',
                style: 'normal',
                weight: 'normal',
                fontSize: 28,
                family: 'sans-serif',
                lineHeight: 28,
                color: '#333',
                ...options
            }
            const text = defaults.baseline === 'top' ? defaults.text : defaults.text.split('').reverse().join('')
            text.split('').forEach((word, index) => {
                const fontTop = defaults.top + index * defaults.lineHeight * (defaults.baseline === 'top' ? 1 : -1)
                context.save()
                context.font = `${defaults.style} ${defaults.weight} ${defaults.fontSize}px/1 ${defaults.family}`
                context.setFillStyle(defaults.color)
                context.setTextAlign(defaults.align)
                context.setTextBaseline(defaults.baseline)
                if (/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]|[^\u2E80-\u9FFF]/.test(word)) {
                    context.translate(defaults.left + defaults.fontSize, fontTop)
                    context.rotate(90 * Math.PI / 180)
                    context.fillText(word, 0, 0)
                } else {
                    context.fillText(word, defaults.left, fontTop)
                }
                context.restore()
            })
        },
        textHorizontal(context, options = {}) {
            const defaults = {
                left:0,
                top: 0,
                maxWidth: 750,
                align: 'left',
                baseline: 'top',
                style: 'normal',
                weight: 'normal',
                fontSize: 28,
                family: 'sans-serif',
                color: '#333',
                ...options
            }
            const lineFontSum = Math.floor(defaults.maxWidth / defaults.fontSize)
            context.save()
            context.font = `${defaults.style} ${defaults.weight} ${defaults.fontSize}px/1 ${defaults.family}`
            context.setFillStyle(defaults.color)
            context.setTextAlign(defaults.align)
            context.setTextBaseline(defaults.baseline)
            context.fillText(lineFontSum >= defaults.text.length ? defaults.text : defaults.text.slice(0, lineFontSum) + '…', defaults.left, defaults.top, defaults.maxWidth)
            context.restore()
        }
    }
}

export const config = {
    computed: {
        showConfig() {
            return ((this.$store.getters.config || {}).mxzb_config || {}).show || {}
        }
    }
}
