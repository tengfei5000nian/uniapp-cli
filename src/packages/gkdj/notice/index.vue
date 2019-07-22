<template>
    <view class="container">
        <me-head title-text="录取通知书" bar-color="#fff"></me-head>
        <view class="me-body">
            <view class="main">
                <image class="size-max" src="https://cdn.feesource.xyz/bgzb/gkdj/notice.png"></image>
                <image class="code" :src="code"></image>
                <view class="school-cn">{{ school.school[0] }}</view>
                <view class="school-en">{{ school.school[1] }}</view>
                <view class="name text-overflow">{{ certificate.name }}</view>
                <view class="quotation">{{ school.quotation }}</view>
            </view>
            <view class="gk-btn-wrap flex-center">
                <share-cover-btn :options="{ certificate, school }" class-name="btn gk-style-white hover">生成分享图</share-cover-btn>
                <button class="btn gk-style-white hover" open-type="share">晒通知书</button>
            </view>
        </view>
    </view>
</template>

<script>
    import '../style.scss'

    import pages from '../pages.js'
    import { certificateFormat, examData, schoolData, code } from '../main'

    import meHead from '@/components/meHead'
    import shareCoverBtn from './shareCoverBtn'
     
    const selfData = {
        school: ''
    }
    
    export default {
        mixins: [pages],
        components: {
            meHead,
            shareCoverBtn
        },
        data() {
            return {
                code,
                time: 0
            }
        },
        computed: {
            certificate() {
                return certificateFormat(this.$store.state.user)
            },
            school() {
                const exam = examData()
                exam.time = this.time
                return schoolData(exam.type)
            }
        },
        onLoad() {
            const school = (this.$Route.query || {}).school
            if (school && school !== selfData.school) {
                selfData.school = school
                this.time = new Date().getTime()
            }
        },
        methods: {
            shareTitle() {
                return `${this.certificate.name}大学录取通知书`
            }
        }
    }
</script>

<style lang="scss">
    .gk-btn-wrap{
        flex-shrink: 1;
        flex-grow: 1;
        .btn{
            margin: 0 60upx;
        }
    }
</style>

<style lang="scss" scoped>
    .me-body{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fff;
    }
    .main{
        flex-shrink: 0;
        flex-grow: 0;
        position: relative;
        width: 100%;
        height: 1049upx;
    }
    .code, .school-cn, .school-en, .name, .quotation{
        position: absolute;
    }
    .school-cn, .name, .quotation{
        font-weight: bold;
    }
    .school-cn, .school-en{
        left: 0;
        right: 0;
        text-align: center;
        font-family: 'SourceHanSerifCN';
        color: #b39845;
    }
    .name, .quotation{
        color: #333;
    }
    .code{
        top: 68upx;
        left: 0;
        right: 0;
        width: 154upx;
        height: 152upx;
        margin: 0 auto;
    }
    .school-cn{
        top: 275upx;
        line-height: 1.2em;
        font-size: 54upx;
    }
    .school-en{
        top: 350upx;
        line-height: 1.2em;
        font-size: 24upx;
    }
    .name{
        top: 495upx;
        left: 60upx;
        width: 245upx;
        text-align: center;
        line-height: 1.2em;
        font-size: 30upx;
    }
    .quotation{
        top: 823upx;
        left: 200upx;
        width: 440upx;
        line-height: 1.2em;
        font-size: 28upx;
    }
</style>
