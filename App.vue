<script>
	import {login} from './api/login.js';
	import {mapMutations} from 'vuex'
	export default {
		onLaunch() {
			let that = this;
			//-----------------微信小程序模块 start---------------------------/
			//#ifdef MP-WEIXIN	
			//判断微信是否已经授权 (异步请求)
			uni.getSetting({
				success(res) {
					console.log(res)
					if (!res.authSetting['scope.userInfo']) {
						console.log("还未授权")
						uni.navigateTo({
							url: '/pages/authorize/authorize',
						})
						return false;
					} else {
						login();
					}
				}
			})
			//#endif
			
			//#ifndef MP-WEIXIN
			   if(!this.$store.state.userInfo){
				   uni.navigateTo({
				   	url:'/pages/login/login'
				   })
			   }
			// #endif
		},
		onShow: function() {

		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			...mapMutations(['setWxInfo','setUserInfo']),
		}
	}
</script>

<style lang="scss">
	@import "./common/uni.css";
    page{
		width:750upx;
		overflow-x: hidden;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.img-box image {
		width: 100%;
		height: 100%;
	}

	/*每个页面公共css */
	.mb30 {
		margin-bottom: 30rpx;
	}

	.mb40 {
		margin-bottom: 40rpx;
	}

	.mb20 {
		margin-bottom: 20rpx;
	}

	.mb10 {
		margin-bottom: 10rpx;
	}

	.theme {
		background: #03528a;
	}

	.textOver1 {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 1;
	}

	.textOver2 {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 2;
	}

	.textOver3 {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 3;
	}
	
	page {
		background: #F2F2F2;
	}
	
	/* 全局设置页面最少高度 */
	.pageMinHeight{
		min-height: calc(100vh);
		/* #ifdef H5 */
		min-height: calc(100vh - 44px);
		/* #endif */
	}
	.submit-btn{
		background: #095389;
		border-radius:10upx;
		color:#fff;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		&.disabled{
			background: #DADADA;
		}
	}
	
	.block-btn{
		width:650upx;
		margin:0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height:80upx;
		background: #03528A;
		color:#fff;
		border-radius: 10upx;
		font-size: 16px;
		&.disabled{
			background: #DADADA;
		}
	}
	
	.btn-box-pay {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-top: 1px solid rgba(196, 196, 196, 1);
		background: #fff;
		.total {
			font-size: 36upx;
			.num {
				font-size: 42upx;
				font-weight: bold;
				margin-left: 10upx;
			}
		}
	
		.submit-btn {
			height: 110upx;
			line-height: 110upx;
			border-radius: 0;
			width: 250upx;
			font-size: 36upx;
			margin-left: 60upx;
		}
	}
	
	
</style>
