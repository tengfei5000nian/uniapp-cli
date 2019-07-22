<template>
    <view class="container">
        <me-head title-text="高考成绩单" bar-color="#f5f5f5"></me-head>
        <view class="me-body">
            <view class="gk-block top-radius bottom-radius">
                <view class="logo">
                    <image class="size-max" :src="certificate.logo"></image>
                </view>
                <view class="name">{{ certificate.name }}</view>
                <e-charts ref="eCharts" :options="eCharts"/>
                <view class="gk-btn-wrap flex-center">
                    <share-cover-btn :options="{ certificate }" class-name="btn gk-style-white hover">生成分享图</share-cover-btn>
                    <button class="btn gk-style-white hover" open-type="share">晒成绩单</button>
                </view>
            </view>
            <button class="btn gk-style-red hover" @click="$Router.push({ path: '/packages/gkdj/notice/index', query: { school }})">走上大学去</button>
        </view>
    </view>
</template>

<script>
    import '../style.scss'

    import pages from '../pages.js'
    import { certificateFormat, examData } from '../main'
    import { cloneObject } from '@/common/util'

    import meHead from '@/components/meHead'
    import eCharts from '@/components/eCharts'
    import shareCoverBtn from './shareCoverBtn'
    
    const selfData = {
        eCharts: {
            radar: [
                {
                    shape: 'circle',
                    splitNumber: 4,
                    splitArea: {
                        areaStyle: {
                            color: [
                                'rgba(114, 172, 209, 0.2)',
                                'rgba(114, 172, 209, 0.4)',
                                'rgba(114, 172, 209, 0.6)',
                                'rgba(114, 172, 209, 0.8)',
                                'rgba(114, 172, 209, 1)'
                            ]
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    name: {
                        fontSize: 16,
                        color:'#333'
                    },
                    indicator: []
                }
            ],
            series: [
                {
                    type: 'radar',
                    itemStyle: {
                        borderColor: '#203747'
                    },
                    lineStyle: {
                        color: '#203747'
                    },
                    areaStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                    label: {
                        show: true,
                        color: '#203747',
                        position: 'insideBottomRight',
                        textShadowColor: '#fff',
                        textShadowBlur: 1
                    },
                    data: [
                        {
                            value: []
                        }
                    ]
                }
            ]
        }
    }
    
    export default {
        mixins: [pages],
        components: {
            meHead,
            eCharts,
            shareCoverBtn
        },
        data() {
            return {
                eCharts: selfData.eCharts,
                school: ''
            }
        },
        computed: {
            certificate() {
                return certificateFormat(this.$store.state.user)
            }
        },
        onLoad() {
            const exam = examData()
            const label = []
            const value = [];
            [...exam.examBase, ...exam.examSelect[1]].forEach(item => {
                label.push({
                    text: item[0],
                    max: 150
                })
                value.push(item[1])
            })
            selfData.eCharts.radar[0].indicator = label
            selfData.eCharts.series[0].data[0].value = value
            this.eCharts = selfData.eCharts
            this.school = JSON.stringify(exam)
        },
        methods: {
            shareTitle() {
                return `${this.certificate.name}高考成绩单`
            }
        }
    }
</script>

<style lang="scss">
    .e-charts{
        display: block;
        width: 100%;
        height: 500upx;
        margin: 25upx 0 60upx;
    }
    .gk-btn-wrap{
        .btn{
            margin: 0 60upx 5upx;
        }
    }
</style>

<style lang="scss" scoped>
    .me-body{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f5f5f5;
    }
    .gk-block{
        padding: 30upx 0 45upx;
    }
    .logo{
        width: 180upx;
        height: 180upx;
        margin: 0 auto 0;
        border-radius: 50%;
        background-color: #eee;
        overflow: hidden;
    }
    .name{
        text-align: center;
        line-height: 110upx;
        font-weight: bold;
        font-size: 40upx;
        color: #333;
    }
    .gk-style-red{
        margin: 55upx 30upx;
    }
</style>
