<template>
  <block>
    <message-box ref="messageBox" class-name="me-side-ad">
      <div class="modal-body">
        <div class="bg"></div>
        <div class="box">
          <div class="head">
            <div class="title">爆款游戏</div>
          </div>
          <div v-if="list.length" class="miniapp-list">
            <block v-for="(item, index) in list" :key="index">
              <navigator v-if="item.appid" class="item" target="miniProgram" :app-id="item.appid" :path="item.path" @fail="showCode(item.code)">
                <img class="logo" :src="item.logo">
                <div class="desc">
                  <div class="name text-overflow">{{ item.name }}</div>
                  <div class="count text-overflow">{{ item.count }}正在玩</div>
                  <div class="btn flex-center">开始</div>
                </div>
              </navigator>
              <div v-else-if="item.code" class="item" @click="showCode(item.code)">
                <img class="logo" :src="item.logo">
                <div class="desc">
                  <div class="name text-overflow">{{ item.name }}</div>
                  <div class="count text-overflow">{{ item.count }}正在玩</div>
                  <div class="btn flex-center">开始</div>
                </div>
              </div>
            </block>
          </div>
          <div v-else class="no-info">暂无推荐</div>
        </div>
        <div v-if="footer" class="footer">{{ footer }}</div>
      </div>
      <button class="btn style-color c reverse" @click="close">
        <me-img src="icon_arrow_brown"/>
      </button>
    </message-box>
    <button v-if="miniappConfig.show !== false" :style="{ 'top': uni.upx2px(miniappConfig.top) + 'px' }" class="btn-side fixed left btn style-color c" @click="open">
      <me-img src="icon_arrow_brown"/>
    </button>
  </block>
</template>

<script>
  import '@/components/modal/modal.scss'
  import 'animate.css/source/sliding_entrances/slideInLeft.css'
  import 'animate.css/source/sliding_exits/slideOutLeft.css'

  import { showCode } from './ad'
  import { toast } from '@/utils'

  import messageBox from '@/components/modal/messageBox'
  import meImg from '@/components/meImg'

  export default {
    name: 'meSideAd',
    components: {
      messageBox,
      meImg
    },
    data() {
      return {
        list: [],
        footer: ''
      }
    },
    computed: {
      miniappConfig() {
        const config = this.$store.state.config.miniappConfig || {}
        return {
          top: (config.side || {}).top || 0,
          show: (config.side || {}).show
        }
      }
    },
    methods: {
      showCode,
      open() {
        const miniappConfig = this.$store.state.config.miniappConfig || {}
        const miniapp = miniappConfig.miniapp || []
        const side = miniappConfig.side || {}
        this.list = Array.isArray(side.data) && side.data.length ? miniapp.filter((row, index) => side.data.includes(index)) : miniapp
        this.footer = side.footer || ''
        this.$refs.messageBox.open()
      },
      close() {
        this.$refs.messageBox.close()
      }
    }
  }
</script>

<style lang="scss">
  .me-side-ad{
    justify-content: flex-start;
    .message-box{
      animation: slideInLeft .3s both;
      &.close{
        animation: slideOutLeft .3s both;
      }
    }
    .modal-body, .bg, .head, .box{
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .modal-body{
      width: 580upx;
      padding-left: 0;
    }
    .bg{
      left: 0;
    }
    .box{
      min-height: 800upx;
    }
    .footer{
      position: relative;
      z-index: 1;
      margin-top: 12upx;
      margin-bottom: -10upx;
      text-align: center;
      line-height: 1.2em;
      font-size: 22upx;
      color: #7b3608;
    }
    .miniapp-list{
      display: flex;
      padding-top: 27upx;
      padding-left: 32upx;
      flex-wrap: wrap;
      .item{
        display: flex;
        width: 50%;
        margin-bottom: 27upx;
      }
      .logo{
        flex-shrink: 0;
        flex-grow: 0;
        display: block;
        width: 108upx;
        height: 108upx;
        background-color: #a6a6a6;
      }
      .desc{
        padding: 0 15upx;
        overflow: hidden;
      }
      .name{
        line-height: 33upx;
        font-size: 23upx;
        color: #000;
      }
      .count{
        line-height: 30upx;
        font-size: 16upx;
        color: #000;
      }
      .btn{
        width: 78upx;
        height: 31upx;
        margin: 10upx auto 0;
        border: 1px solid #8d5937;
        background-color: #c59057;
        line-height: 1em;
        font-size: 22upx;
        color: #fff;
      }
    }
    .btn{
      &.c{
        position: absolute;
        z-index: 1;
        left: 100%;
        top: 50%;
        margin-top: -41upx;
      }
    }
    .no-info{
      padding-top: 100upx;
      text-align: center;
      line-height: 1.4em;
      font-size: 28upx;
      color: #7b3608;
    }
  }
</style>