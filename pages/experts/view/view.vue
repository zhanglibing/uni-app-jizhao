<template>
	<view v-if="info">
		<view class="info-box">
			<view class="avatar">
				<image :src="info.AvatarUrl" mode=""></image>
			</view>
			<view class="desc">
				<view class="name-box">
					<view class="name">{{ info.RealName }}</view>
					<text>从业{{ info.ConsultantInfo.WorkingYears }}年</text>
					<text>{{ info.Addresses[0].Address1 }}</text>
				</view>
				<view class="good-list">
					<view v-for="(item, index) in info.ConsultantInfo.Skilled" :key="index">{{
						item
					}}</view>
				</view>
			</view>
		</view>
		<view class="server-box">
			<view class="title">资费服务</view>
			<view class="price">单价：¥ {{ info.ConsultantInfo.SerivcePrice }}</view>
			<view class="bank">
				<view>
					<image src="../../../static/images/bank.png" mode="widthFix"></image>银行卡转账
				</view>
				<view>
					<image src="../../../static/images/wechat.png" mode="widthFix"></image>微信支付
				</view>
			</view>
			<view class="select-time">
				咨询时间/h：
				<!-- :step="0.5" -->
				<uni-number-box :value="value" :min="1" :max="20" @change="onNumberChange"></uni-number-box>
			</view>
			<view class="xieyi">
				<radio color="#095389" @click="radioChange" :checked="isChecked" /><text @tap="goConsulting"> 预约即代表您确认并接受《咨询服务协议》</text>
			</view>
		</view>
		<view class="tab-box">
			<view class="tap">
				<view @tap="setActive(index)" :class="{ active: active == index }" v-for="(item, index) in list" :key="index">{{ item }}</view>
			</view>
			<view class="desc-box">
				<view class="intro" v-if="active == 0">
					<text space="emsp">{{info.ConsultantInfo.PersonalIntroduction}}</text>
				</view>
				<view class="background" v-if="active == 1">
					<text space="emsp">{{info.ConsultantInfo.CareerBackground}}</text>
				</view>
				<!-- 文章模块 -->
				<view v-if="active == 2">
					<article-list v-if="articlelist.length" :datas="articlelist"></article-list>
					<view class="nothing" v-else=""> 该咨询师太忙了，还没有时间发表文章 </view>
				</view>
				<!-- 评论模块 -->
				<view class="comment-list" v-if="active == 3">
					<view class="item flex-row" v-for="(item, index) in comment" :key="index">
						<view class="avatar-box">
							<image v-if="item.AvatarUrl" :src="item.AvatarUrl"></image>
						</view>
						<view class="content">
							<view class="name">
								<view>{{ item.CustomerName}}**</view>
								<view class="time">{{ item.orderComment.CreateDate }}</view>
							</view>
							<view class="desc-content"> {{ item.orderComment.CommentContent }} </view>
						</view>
					</view>
					<view class="nothing" v-if="!comment.length"> 暂无任何评价 </view>
				</view>
			</view>
		</view>

		<!-- 立即支付 -->
		<view class="btn-box">
			<view class="total">共计：¥<text class="num">{{ total }}</text></view>
			<view class="submit-btn" :class="{active:!isChecked}" @tap="toPayTap">立即预约</view>
		</view>
		<login></login>
	</view>
</template>

<script>
	import articleList from '../../../components/articleList.vue';
	import article from '../../../api/article.js';
	import wxpay from '../../../api/pay.js';
	import uniNumberBox from '../../../components/uni-number-box.vue';
	import {
		gtConsultantInfo,
		gtListComment
	} from '../../../api/consultation.js';
	import login from '../../../components/login'
	export default {
		components: {
			uniNumberBox,
			articleList,
			login
		},
		data() {
			return {
				comment: [],
				articlelist: [],
				info: null,
				list: ['个人介绍', '受训背景', '文章发表', '用户评价'],
				active: 0,
				value: 1,
				id: '',
				isChecked: false
			};
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中'
			});
			this.id = option.id;
			this.init();
		},
		methods: {
			init() {
				gtConsultantInfo(this.id).then(res => {
					uni.hideLoading();
					this.info = res;
					// 获取用户评价
					gtListComment({
						ConsultantId: this.id
					}).then(res => {
						let {
							Total,
							Data
						} = res;
						Data.forEach(val => {
							val.CustomerName = val.CustomerName?val.CustomerName.slice(0, 1):''
						})
						this.comment = Data;
					});
					article.getMyArticle({
						customerId: this.id
					}).then(res => {
						this.articlelist = res.list;
					});
				});
			},
			radioChange(e) {

				this.isChecked = !this.isChecked;
			},
			setActive(index) {
				this.active = index;
			},
			onNumberChange(value) {
				this.value = value;
			},
			//付款
			toPayTap() {
				let that = this;
				if (!this.isChecked) {
					uni.showModal({
						title: '提示',
						content: '请勾选协议',
						confirmText: '确认勾选',
						success(res) {
							if (res.confirm) {
								that.radioChange()
							}
						}
					})
					return false;
				}
				if (!this.$isLogin()) {
					return false;
				}
				let SerivcePrice = this.info.ConsultantInfo.SerivcePrice;
				uni.showLoading({
					title: '正在加载'
				});

				wxpay.wxpay({
					ProductId: this.id,
					price: SerivcePrice / 2, //单价 //按0.5小时算单价
					ProductNum: this.value * 2, //0.5小时算一个  支付那边支持整数
					ProductName: this.info.RealName + '心理咨询' + this.value + '小时',
					orderTotal: Math.round(this.value * SerivcePrice),
					ProductType: 'ZXS',
					redirectUrl: '/pages/order/order'
				});
			},
			goConsulting() {
				uni.navigateTo({
					url: '../../consulting/consulting?id=' + this.id,
				});
			}
		},
		computed: {
			total() {
				return this.value * this.info.ConsultantInfo.SerivcePrice;
			}
		},
		//转发话术
		onShareAppMessage(res) {
			return {
				title: '您身边的心理咨询师：' + this.info.RealName,
				imageUrl: this.info.AvatarUrl
			};
		},

	};
</script>

<style lang="scss" scoped="">
	page {
		padding-bottom: 180upx;
	}

	.info-box {
		padding: 60upx 40upx 30upx;
		display: flex;
		flex-direction: row;
		background: #fff;
		margin-bottom: 30upx;

		.avatar {
			width: 160upx;
			height: 160upx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 30upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.desc {
			flex: 1;

			.name-box {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 50upx;

				.name {
					font-size: 32upx;
					font-weight: bold;
				}

				text {
					color: #666;
				}
			}

			.good-list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				view {
					background: #f2f2f2;
					border-radius: 6upx;
					margin-right: 4%;
					margin-bottom: 30upx;
					width: 22%;
					line-height: 40upx;
					font-size: 10px;
					text-align: center;
					color: #666;

					&:nth-child(4n) {
						margin-right: 0;
					}
				}
			}
		}
	}

	.server-box {
		padding: 50upx 40upx;
		background: #fff;
		margin-bottom: 30upx;

		.title {
			font-size: 36upx;
			border-bottom: 1px solid #c3c3c3;
			padding-bottom: 30upx;
			margin-bottom: 30upx;
		}

		.price {
			font-size: 36upx;
			font-weight: bold;
			margin-bottom: 30upx;
		}

		.select-time {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 30upx;
		}

		.bank {
			display: flex;
			flex-direction: row;

			view {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;

				image {
					max-width: 36upx;
					height: 32rpx;
					margin-right: 20upx;
				}
			}

			margin-bottom: 60upx;
		}
	}

	.tab-box {
		padding: 0 40upx 140upx;
		background: #fff;

		.tap {
			width: 100%;
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid #c3c3c3;
			line-height: 100upx;

			view {
				flex: 1;
				text-align: center;
				font-size: 30upx;
				border-bottom: 2px solid transparent;

				&.active {
					color: #03528a;
					border-bottom: 2px solid #03528a;
				}
			}
		}

		.desc-box {
			padding: 60upx 0;
			color: #666;
			line-height: 60upx;
		}
	}

	/* 评论区 */
	.comment-list {
		.item {
			margin-bottom: 30upx;
			border-bottom: 1px solid #eee;
			padding-bottom: 20upx;

			.name {
				font-size: 14px;
				margin-bottom: 20upx;
				line-height: 40upx;
				color: #000;

				.time {
					font-size: 12px;
					color: #666;
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
			margin-right: 40upx;
			background: #666;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.desc-content {
			font-size: 14px;
		}
	}

	.btn-box {
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
			}
		}

		.submit-btn {
			height: 110upx;
			line-height: 110upx;
			border-radius: 0;
			width: 250upx;
			font-size: 36upx;
			margin-left: 60upx;

			&.active {
				background: #666;
			}
		}
	}
</style>
