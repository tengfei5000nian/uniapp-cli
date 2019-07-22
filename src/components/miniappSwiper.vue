<template>
    <swiper class="swiper" :autoplay="true" :circular="true" :interval="2000" :duration="1000" :display-multiple-items="4" :next-margin="swiperOffset">
        <swiper-item v-for="(item, index) in list" :key="index" class="item">
            <me-link :to="item">
                <image class="logo" :src="item.logo" mode="aspectFill"></image>
            </me-link>
        </swiper-item>
    </swiper>
</template>

<script>
    import meLink from '@/components/meLink'
    
    export default {
        components: {
            meLink
        },
        props: {
            list: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        computed: {
            swiperOffset() {
                return uni.upx2px(100) + 'px'
            }
        },
        methods: {
            
        }
    }
</script>

<style lang="scss" scoped>
    .swiper{
        height: 120upx;
    }
    .item{
        display: flex;
    }
    .logo{
        display: block;
        width: 120upx;
        height: 120upx;
        border-radius: 8upx;
    }
</style>
