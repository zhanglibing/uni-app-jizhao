<template>

	<view class="container">
		<view>1、同意当前小程序获取我的微信头像；</view>
		<view>2、同意当前小程序获取我的微信昵称等其他信息；</view>
		<button lang="zh_CN" open-type="getUserInfo" @getuserinfo="getuserinfo" type="primary">授权登录</button>
	</view>
</template>

<script>
	import {login} from '../../api/login.js'
	export default {
		data() {
			return {

			};
		},
		methods: {	
			//获取授权情况
			getuserinfo(e) {
				console.log(e)
				if (!e.detail.userInfo) {
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return false;
				} else {
				    login()
					setTimeout(() => {
						uni.navigateBack();
					}, 200)
				}

			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40upx;
		view{
			margin-bottom: 20upx;
		}
	}

	.save-btn {
		margin-top: 40upx;
		color: #fff;
	}
	button{
		background: #03528A;
		&[type="primary"]{
			background: #03528A;
		}
	}
</style>
