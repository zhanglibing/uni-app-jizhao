<template>
	<view>
		<view class="mask"  v-if="isShow">
			<view class="dia_wrapper">
				<image class="close" 
				@click="isShow=false"
				src="../static/images/close.png"></image>
				<image class="bg_image" src="https://back.jizhaojk.com/content/images/WeChat/kefu_bg.png"></image>
			    <image @longtap="previewImage" class="kefuqrcode" :src="kefuqrcode"></image>
				<view class="content_box">
					<view class="flex">
						<view>客服微信：xfmfxl</view>
						<view class="btn" @click="setCli">一键复制</view>
					</view>
					<view class="flex">
						<view>客服热线：400-1661-085</view>
						<view class="btn" @click="callPhone">一键拨打</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="kefu" @click="isShow=true">
			<image src="../static/images/kefu.png" mode=""></image>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				isShow:false,
				kefuqrcode:'https://back.jizhaojk.com/content/images/WeChat/kefuqrcode.png'
			};
		},
		methods:{
			setCli(){
				uni.setClipboardData({
				    data: 'xfmfxl',
				    success: function () {
				        console.log('success');
				    }
				});
			},
			callPhone(){
				uni.makePhoneCall({
				    phoneNumber: '4001661085' //仅为示例
				});
			},
			previewImage: function(e) {
			    var current = e.target.dataset.src;
			    uni.previewImage({
			      current: this.kefuqrcode,
			      urls: [this.kefuqrcode]
			    })
			  },
		
		}
	}
</script>

<style lang="scss">
.kefu{
	position: fixed;
	right:50upx;
	bottom:100upx;
	width:120upx;
	height:147upx;
	image{
		width:100%;
		height:100%;
	}
}
.mask{
	position: fixed;
	top:0;
	left:0;
	bottom:0;
	right:0;
	background: rgba(0,0,0,.6);
	z-index: 1000;
}

.dia_wrapper{
	position: fixed;
	top:calc(((100vh - 767upx) / 2) + 40upx);
	width:658upx;
	height:767upx;
	left:46upx;
	.close{
		width:48upx;
		height:48upx;
		position: absolute;
		top:-60upx;
		right:0;
	}
	.bg_image{
		width:658upx;
		height:767upx;
	}
	.kefuqrcode{
		width:268upx;
		height:268upx;
		position: absolute;
		top:-80upx;
		left:195upx;
	}
	.content_box{
		position: absolute;
		bottom:100upx;
		padding:50upx;
		width:100%;
		box-sizing: border-box;
		.flex{
			width:100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color:#fff;
			font-size: 36upx;
			margin-bottom: 20upx;
			.btn{
				border: 1px solid #fff;
				padding:6upx 16upx;
				border-radius: 10upx;
			}
		}
	}
}
</style>
