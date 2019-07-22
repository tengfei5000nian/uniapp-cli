<script>
	export default {
		
	}
</script>

<style lang="scss">
    // 基础
    page{
        background: $me-page-bg-color;
    }
    .container{
        display: flex;
        flex-flow: column;
        min-height: 100vh;
        box-sizing: border-box;
        overflow: hidden;
    }
    .flex-center{
        @include flex-align(center, center);
    }
    .box-clear{
        flex-shrink: 0;
        flex-grow: 0;
        margin: 0;
        box-sizing: border-box;
        border: 0 none;
        border-radius: 0;
        padding: 0;
        background: transparent;
        font: inherit;
        color: inherit;
        &:after{
            border: 0 none;
        }
        &.disabled{
            pointer-events: none;
        }
        &.resize{
            flex-shrink: 1;
            flex-grow: 1;
        }
    }
    .btn{
        @extend .flex-center, .box-clear;
        &.button-hover.hover, &.button-hover .hover, &.navigator-hover.hover, &.navigator-hover .hover{
            transform: scale(.96);
        }
    }
    .val{
        @extend .box-clear;
    }
    .size-max{
        display: block;
        width: 100%;
        height: 100%;
    }
    // 场景
    .me-body{
        flex-shrink: 1;
        flex-grow: 1;
    }
    .block{
        border-radius: 10upx;
        padding-left: 20upx;
        padding-right: 20upx;
        background-color: #fff;
        &.top{
            padding-top: 20upx;
        }
        &.bottom{
            padding-bottom: 20upx;
        }
        &.shadow{
            box-shadow: -4upx 1upx 9upx 0 rgba(#26203A, .35);
        }
    }
    // 公共动画
    @keyframes rotate360{
        0%{
            transform: rotate(0deg)
        }
        100%{
            transform: rotate(360deg)
        }
    }
</style>
