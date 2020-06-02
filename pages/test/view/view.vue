<template>
	<view class="testView">
		<view class="title">{{ info.Title }}</view>
		<view class="pass">{{ info.TestQuantity }} 人已测试</view>
		<view class="img-box">
			<image :src="info.BannerPictureUrl" mode="widthFix"></image>
		</view>
		<view>
			<rich-text :nodes="info.Description" />
		</view>
		<view class="start-btn" @tap="goTesting">立即测试</view>
		<login></login>
		<kefu></kefu>
	</view>
</template>

<script>
	import api from '../../../api/test.js';
	import wxpay from '../../../api/pay.js'
	import login from '../../../components/login'
	export default {
		components: {
			login
		},
		data() {
			return {
				info: {},
				platform: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let id = options.id;
			this.platform = this.$store.state.platform;
			//获取测试题详情 
			uni.showLoading({
				title: '加载中'
			})
			api.getTestDetails(id).then(res => {
				uni.hideLoading();
				this.info = res;
				this.checkHasOrder(id)
			})
		},
		methods: {
			//检查测试是否进入订单列表
			checkHasOrder(id) {
				api.checkHasOrder({
					PsychtestId: id
				}).then(res => {
					this.orderId = res;
				})
			},
			//开始测试
			goTesting() {
				if (!this.$isLogin()) {
					return false;
				}
				let {
					Title,
					NewPrice,
					Id
				} = this.info;
				// 如果订单已经存在 直接进入测试详情
				if (this.orderId) {
					uni.navigateTo({
						url: `/pages/test/testing/testing?id=${Id}&orderId=${this.orderId}`
					})
					return false;
				}

				if (NewPrice > 0 && this.platform === 'ios') {
					uni.showModal({
						title: '该测试不支持',
						content: '十分抱歉，由于相关规范，您暂时无法订阅该测试，如有疑问请联系客服',
						success: () => {

						}
					})
					return false;
				}


				uni.showLoading({
					title: '正在生成订单。。。',
				})

				wxpay.wxpay({
					ProductId: Id,
					ProductName: Title,
					price: NewPrice,
					ProductType: 'PT',
					redirectUrl: '/pages/test/testOrder/testOrder'
				});
			},

		},
		//转发话术
		onShareAppMessage(res) {
			return {
				title: this.info.Title,
				imageUrl: this.info.BannerPictureUrl
			}
		},
	};
</script>


<style lang="scss">
	page {
		background: #fff;
		padding: 50upx 40upx 100upx;
		box-sizing: border-box;
	}

	.title {
		font-size: 20px;
		width: 500rpx;
		margin: 0 auto;
		text-align: center;
		font-weight: 700;
		line-height: 36px;
	}

	.pass {
		color: rgb(153, 153, 153);
		text-align: center;
		margin: 16px 0;
	}

	.img-box {
		width: 100%;
		overflow: hidden;
		margin-bottom: 10px;
	}

	.img-box img {
		width: 100%;
	}

	.submit-btn {
		height: 80upx;
		line-height: 80upx;
	}

	.start-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		color: #fff;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		background: #F5A623;
		font-size: 36upx;
	}
</style>
