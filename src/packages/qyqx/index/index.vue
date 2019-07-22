<template>
    <view class="container">
        <me-head title-text="千与千寻" bar-color="#fff"></me-head>
        <view class="me-body">
            <image class="page-bg" src="https://cdn.feesource.xyz/bgzb/qyqx/bg_01.jpg" mode="aspectFill"></image>
            <image class="lantern top" src="https://cdn.feesource.xyz/bgzb/qyqx/lantern_top.png"></image>
            <image class="lantern bottom" src="https://cdn.feesource.xyz/bgzb/qyqx/lantern_bottom.png"></image>
            <view class="count">次数：{{ count }}/{{ max }}</view>
            <view class="rule">一起打开最爱动漫人物系列之千与千寻“性格解密”<br/>相同头像人物消失，在规定次数内。挑战失败，需重新开始。</view>
            <view class="card-main">
                <card
                    v-for="(card, index) in cards"
                    :key="index"
                    :type="card.type"
                    :show="card.show"
                    :destroy="card.destroy"
                    :disabled="card.disabled"
                    @metap="tap(card)"
                    @show="show(card)"
                    @hide="hide(card)"
                ></card>
            </view>
        </view>
        <end ref="end" @close="init"/>
        <me-login ref="meLogin"></me-login>
    </view>
</template>

<script>
    import '../style.scss'
    
    import pages from '../pages.js'
    import { mapActions } from 'vuex'
    
    import meHead from '@/components/meHead'
    import meLogin from '@/components/meConfirm/meLogin'
    import card from '../components/meCard'
    import end from '../components/end'
    
    const selfData = {
        current: [],
        types: ['bb', 'bl', 'glyy', 'qpp', 'qx', 'tpp', 'wmn', 'xl'],
        same: 2,
        pair: 8
    }
    
    export default {
        mixins: [pages],
        components: {
            meHead,
            meLogin,
            card,
            end
        },
        data() {
            return {
                cards: [],
                count: 0,
                max: 25
            }
        },
        mounted() {
            this.isAuth().then(() => {
                this.getData()
            })
        },
        methods: {
            getData() {
                this.$store.getters.config.qyqxConfig.then(config => {
                    selfData.types = Array.isArray(config.personage) && config.personage.length ? config.personage.filter(row => row.card).map(row => row.type) : selfData.types
                    selfData.same = config.same || selfData.same
                    selfData.pair = config.pair || selfData.pair
                    this.max = config.max || this.max
                    this.init()
                }).catch(err => {
                    this.$Toast.show(err && err.message || '错误，配置项获取失败').then(() => {
                        this.$router.back()
                    })
                })
            },
            init() {
                this.count = 0
                this.current = []
                this.cards = [].concat(...selfData.types.sort(() => Math.random() - 0.5).slice(0, selfData.pair).map(type => {
                    const card = {
                        type,
                        show: false,
                        destroy: false,
                        disabled: false
                    }
                    return Array.from(new Array(selfData.same), () => ({ ...card }))
                })).sort(() => Math.random() - 0.5)
            },
            tap(card) {
                const current = selfData.current
                if (current.length < selfData.same) {
                    card.show = true
                    card.disabled = true
                    current.push(card.type)
                }
            },
            show(card) {
                selfData.current.splice(selfData.current.indexOf(card.type), 1, card)
                selfData.current.length >= selfData.same && !selfData.current.find(card => typeof card !== 'object') && this.judge()
            },
            hide(card) {
                card.disabled = false
            },
            judge() {
                const current = selfData.current
                if (current.find(card => card.type !== current[0].type)) {
                    current.forEach(card => {
                        card.show = false
                    })
                } else {
                    current.forEach(card => {
                        card.destroy = true
                    })
                }
                selfData.current = []
                this.count++
                this.end()
            },
            end() {
                if (!this.cards.find(card => !card.destroy)) {
                    this.$refs.end.open(true)
                } else if (this.count >= this.max) {
                    this.$refs.end.open(false)
                }
            }
        }
    }
</script>

<style lang="scss">
    .card-main{
        position: relative;
        display: flex;
        width: 100%;
        padding-top: 1px;
        justify-content: space-between;
        flex-wrap: wrap;
        .me-card{
            flex-shrink: 0;
            flex-grow: 0;
            margin-top: 20upx;
        }
    }
</style>

<style lang="scss" scoped>
    .me-body{
        position: relative;
        display: flex;
        box-sizing: border-box;
        padding: 37upx 52upx;
        background-color: #000;
        flex-direction: column;
        justify-content: space-between;
    }
    .page-bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .lantern{
        position: absolute;
        &.top{
            top: -18upx;
            left: -20upx;
            width: 804upx;
            height: 108upx;
            transform-origin: center top;
            animation: lantern 20s linear 0s infinite backwards;
        }
        &.bottom{
            bottom: -40upx;
            left: -5upx;
            width: 765upx;
            height: 101upx;
            transform-origin: center top;
            animation: lantern 16s linear 2s infinite backwards;
        }
        @keyframes lantern{
            0%, 100%{
                transform: translate(0, 0) rotate(0deg) skew(0deg);
            }
            25%{
                transform: translate(6upx, -6upx) rotate(3deg) skew(10deg);
            }
            50%{
                transform: translate(-4upx, 8upx) rotate(-1deg) skew(5deg);
            }
            75%{
                transform: translate(3upx, -4upx) rotate(-4deg) skew(-8deg);
            }
        }
    }
    .count{
        position: relative;
        display: flex;
        width: 334upx;
        height: 93upx;
        margin-left: auto;
        justify-content: center;
        align-items: center;
        background: url('https://cdn.feesource.xyz/bgzb/qyqx/count_bg.png') no-repeat center;
        background-size: 100% 100%;
        line-height: 1.2em;
        font-family: 'szt';
        font-size: 32upx;
        color: #f9f5d2;
    }
    .rule{
        position: relative;
        margin-top: 25upx;
        line-height: 1.8em;
        font-family: 'szt';
        font-size: 29upx;
        color: #f9f5d2;
    }
</style>
