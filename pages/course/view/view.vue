<template>
	<view class='view-box'>
		<view class='img-box'>
			<image :src="info.BannerPictureUrl"></image>
			<view class='play' @tap='goWatch'>
				<image src='/static/images/play.png'></image>
			</view>
		</view>
		<view class='info-box'>
			<view class='title'>{{info.Title}}</view>
			<view class='price flex-row'>
				<text v-if="!info.Price||platform==='ios'">免费课程</text>
				<text v-else="">￥{{info.Price}}</text>
			</view>

			<view class='flex-row time'>
				<text>{{info.CreateDate}}</text>
				<text class='watch'>观看人数{{info.Watchs}}</text>
			</view>
			<view class="desc-box">
				<view class="desc-title">课程详情</view>
				<view v-html="info.Description"></view>
			</view>

		</view>

		<view class='comment-list'>
			<view class='comment-name'>最新评论</view>
			<view class='item flex-row' v-if="ListComments.length" v-for="(item,index) in ListComments" :key="index">
				<view class='avatar-box'>
					<image :src="item.Avatar"></image>
				</view>
				<view class='content'>
					<view class='name'>
						<view>{{item.NickName}}</view>
						<view class='time'>{{item.CreateDate}}</view>
					</view>
					<view class='desc-content'>
						{{item.CommentText}}
					</view>
				</view>
			</view>
			<view class='no-comment' v-if="!ListComments.length">暂无评论</view>
		</view>
		<uni-load-more v-if="ListComments.length" :loadingType="loadingType"></uni-load-more>
		<view class='btn-box-pay' v-if="info.Price>0&&platform!=='ios'">
			<!-- 立即支付 -->
			<view class="total">共计：¥ <text class="num">{{info.Price }}</text></view>
			<view class="submit-btn" @tap="toPayTap">立即购买</view>
		</view>
		<login></login>
	</view>
</template>

<script>
	import api from '../../../api/course.js'
	import wxpay from '../../../api/pay.js'
	import login from '../../../components/login'
	export default {
		components: {
			login
		},
		data() {
			return {
				info: {},
				id: '',
				ListComments: [],
				Page: 1,
				PageSize: 10,
				loadingType: 0,
				platform: ''
			};
		},
		onLoad(options) {
			this.platform = this.$store.state.platform;
			this.id = options.id;
			api.getById(this.id).then(res => {
				this.info = res;
				this.getComents();
			})
		},
		methods: {
			//获取课程评价
			getComents() {
				let {
					id,
					Page,
					PageSize
				} = this;
				let option = {
					Id: id,
					Page,
					PageSize
				}
				api.getComents(option).then(res => {
					let {
						TotalCount,
						model
					} = res;
					this.ListComments = this.ListComments.concat(model);
					this.loadingType = Page * PageSize >= TotalCount ? 2 : 0;
				});

			},
			goWatch() {
				if (!this.$isLogin()) {
					return false;
				}
				if (this.info.Price > 0) {
					if (this.platform === 'ios') {
						uni.showModal({
							title: '该课程暂不支持',
							content: '十分抱歉，由于相关规范，您暂时无法订阅该课程，如有疑问请联系客服',
							success: () => {

							}
						})
					} else {
						uni.showModal({
							title: '付费课程',
							content: '请先付款',
							success: () => {
								this.toPayTap();
							}
						})
					}

					return false;
				}
				uni.navigateTo({
					url: '/pages/myCourse/video/video?id=' + this.id,
				})
			},
			//付款
			toPayTap() {
				if (!this.$isLogin()) {
					return false;
				}
				uni.showLoading({
					title: '正在加载',
				})
				let {
					Title,
					Price,
					Id
				} = this.info;
				wxpay.wxpay({
					ProductId: Id,
					ProductName: Title,
					price: Price,
					ProductType: 'V',
					redirectUrl: '/pages/myCourse/index'
				});
			},
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			this.Page++;
			this.getComents();
		},
		//转发话术
		onShareAppMessage(res) {

		},
	}
</script>

<style lang="scss" scoped="">
	.view-box {
		padding: 30upx 30upx 160upx 30upx;
		box-sizing: border-box;
		background: rgba(245, 245, 245, 1);

		.img-box {
			width: 100%;
			height: 400upx;
			border-radius: 20upx;
			overflow: hidden;
			position: relative;
			margin-bottom: 20upx;
		}
	}



	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -50upx;
		margin-top: -50upx;
		width: 100upx;
		height: 100upx;
		margin-bottom: 30upx;

		image {
			width: 100%;
			height: 100%;
		}
	}


	.info-box {
		padding: 40upx 30upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 20upx;
		margin-bottom: 30upx;

		.title {
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 20upx;
		}

		.time {
			font-size: 12px;
			margin-bottom: 60upx;
		}

		.desc-box {
			overflow: hidden;

			.desc-title {
				border-bottom: 1px solid #eee;
				padding-bottom: 20upx;
				margin-bottom: 20upx;
				font-size: 16px;
			}
		}
	}

	.price {
		justify-content: space-between;
		font-size: 18px;
		color: rgba(255, 60, 0, 1);
		margin-bottom: 20upx;
		font-weight: bold;

		.type {
			padding: 0 20upx;
			height: 46upx;
			line-height: 46upx;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(149, 149, 149, 1);
			border-radius: 23upx;
			font-size: 12px;
		}
	}

	.watch {
		margin-left: 50upx;
	}

	/* 评论区 */

	.comment-list {
		padding: 40upx 30upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 20upx;
	}

	.comment-name {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 30upx;
	}

	.item {
		margin-bottom: 30upx;

		.name {
			font-size: 12px;
			margin-bottom: 20upx;
			line-height: 40upx;

			.time {
				font-size: 10px;
				color: rgba(155, 155, 155, 1);
			}
		}

		.content {
			flex: 1;
		}
	}

	.avatar-box {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.desc-content {
		font-size: 12px;
	}

	.no-comment {
		font-size: 16px;
	}
</style>
