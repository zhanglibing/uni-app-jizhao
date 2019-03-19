<template>
	<view>
		 <image :src="imgUrl"  @load="imageLoad" :style="{'width':ww, 'height':hh}"></image>
	</view>
</template>

<script>
export default {
    props: {
        imgUrl: {
            type: String,
            default: ''
        },
        maxWidth: {
            type: Number,
            default: 690
        }
    },
    data() {
        return {
           imgH:0
        };
    },
    created() {},
    methods: {
        imageLoad(e) {
            console.log(e);
            var $width = e.detail.width, 
             $height = e.detail.height,
             ratio = $width / $height;
            this.imgH = this.maxWidth / ratio;
        }
    },
    computed: {
        ww() {
            return uni.upx2px(this.viewWidth) + 'px';
        },
        hh() {
            return uni.upx2px(this.imgH) + 'px';
        }
    }
};
</script>

<style>
image {
    width: 100%;
}
</style>
