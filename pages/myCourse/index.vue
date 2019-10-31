<template>
	<view class='order pageMinHeight'>
		<view class='top-box theme flex-row'>
			<view :class="{active:item.status == orderStatus}" 
			@tap="statusTap(item.status)" v-for="(item,index) in orderType"
			 :key="index">{{item.name}}</view>
		</view>
		<view class='no-order' v-if="isShowNoOrder">
			<image src='/static/images/noOrder.png'></image>
			<view>暂无订单</view>
		</view>
		<view class='order-list'>
			<view class='item' v-for="(item,index) in list" :key="index" >
				<view class="flex-row time-box" @tap='goOrderView(item.Id)'>
					<view class='time'>{{item.CreatedOnUtc}}</view>
					<view class='status'>{{status[item.OrderStatus]}}</view>
				</view>
				<view class='flex-row' @tap='goOrderView(item.Id)'>
					<view class='img-box'>
						<image :src="item.CustomerAvatarUrl"></image>
					</view>
					<view class='content flex-column'>
						{{item.ProductTitle}}						
					</view>
				</view>
				<view class='btn-box flex-row'>
					<text v-if="platform!='ios'">总价: {{ item.OrderTotal }}元</text>
					<text v-else=""></text>
					<view class="flex-row">
						<block v-if="item.OrderStatus==10">
							<view class='btn' @tap='closeOrder(item.Id)'>取消订单</view>
							<view class='btn' @tap='payOrder(item)'>立即支付</view>
						</block>
						<view class='submit-btn'  v-if="item.OrderStatus<15&&item.OrderStatus>=11" @tap='goWatch(item.ProductId)'>观看视频</view>
						<view v-if="item.OrderStatus==11" class='btn'  @tap='goEvaluate(item)'>立即评价</view>
						<view v-if="item.OrderStatus==15" class='btn'>交易已关闭</view>
					</view>
					
				</view>
			</view>
		</view>
	    <uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import api from '../../api/order.js'
	import wxpay from '../../api/pay.js'
	export default {

		data() {
			return {
				platform:'',
				loadingType:0,
				status: {
					10: "待支付",
					11: "待评价",
					14: "交易完成",
					15: "交易关闭"
				},
				orderType: [
					{
						name: '待付款',
						status: 10
					},
					{
						name: '待评价',
						status: 11
					},
					{
						name: '已完成',
						status: 14
					},
					{
						name: '全部',
						status: ''
					},
				],
				list: [],
				total: 0,
				orderStatus: '',
				page: 1,
				pageSize: 10,
				isShowNoOrder: false,
			};
		},
		onLoad: function(options) {
			this.platform=this.$store.state.platform;
			this.orderStatus = options.type ? options.type : ''
		},
		methods: {
			//初始化
			init(){
				this.loadingType=0;
				this.list = [];
				this.page = 1;
				uni.showLoading({
					title: '加载中...',
				})
				this.getlist()
			},
			//获取订单
			async getlist() {
				let {
					page,
					pageSize,
					orderStatus
				} = this;
				
				let {
					Data,
					Total
				} = await api.getCourseList({
					orderStatus,
					page,
					pageSize
				});
				uni.hideLoading();
				uni.stopPullDownRefresh()
				if (orderStatus != this.orderStatus) {
					return false; //防止快速切换tab 引起数据错乱
				}
				Data = Data.map(val => {
					return { ...val.orderNew,
						CustomerAvatarUrl: val.CustomerAvatarUrl
					}
				})
				this.list = this.list.concat(Data);;
				this.total = Total;
				this.loadingType = page * pageSize >= Total ? 2 : 0;
				this.isShowNoOrder = this.list.length?false:true;

			},

			//tab切换
			statusTap(index) {
				this.orderStatus = index;
				this.init();
			},

			// 关闭订单
			closeOrder(id) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确认关闭该订单吗',
					success(res) {
						if (res.confirm) {
							api.closedOrder(id).then(res => {
								uni.showToast({
									title: '关闭成功',
									icon: 'success',
									duration: 2000
								})
								that.init();
							})
						}
					}
				})
			},

			//支付
			payOrder(item) {
				uni.showLoading({
					title: '正在加载',
				})
				let {
					ProductTitle,
					OrderTotal,
					ProductId,
					Id
				} = item;
				wxpay.wxpay({
					ProductId,
					ProductName: ProductTitle,
					price: OrderTotal,
					ProductType: 'V',
					orderId: Id,
					redirectUrl: '/pages/myCourse/index'
				});

			},

			//观看视频
			goWatch(id) {
				uni.navigateTo({
					url: '/pages/myCourse/video/video?id=' + id,
				})
			},
			//评价
			goEvaluate(item) {
				let {
					Id,
					ProductId
				} = item;
				uni.navigateTo({
					url: `/pages/myCourse/evaluate/evaluate?OrderId=${Id}&CurriculumId=${ProductId}`,
				})
			},
			//前往订单详情页面
			goOrderView(id) {
				uni.navigateTo({
					url: './orderView/orderView?id=' + id
				});
			},
			
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			this.init();
		},


		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh() {
			this.init();
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			this.page ++;
			this.getlist();
		},

	}
</script>

<style lang="scss" scoped="">
	/* pages/myCourse/index.wxss */
	.order {
		background: rgba(245, 245, 245, 1);
	}

	.top-box {
		padding: 0 30upx;
		background: #fff;
		color: #666;
		view {
			flex: 1;
			text-align: center;
			font-size: 16px;
			line-height: 100upx;
			border-bottom: 2px solid #fff;
			&.active {
				border-bottom: 2px solid #095289;
				color: #095289;
			}
		}
	}

	.order-list {
		padding: 30upx;
		box-sizing: border-box;
		.item {
			background: rgba(255, 255, 255, 1);
			border-radius: 20upx;
			margin-bottom: 30upx;
			padding: 20upx 30upx;	
		}
		.time-box{
			width:100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-bottom:30upx;
			color:#666;
			.status{
				font-size: 16px;
				font-weight: bold;
				color:#000;
			}
		}
		.img-box {
			width: 200upx;
			height: 140upx;
			border-radius: 10upx;
			overflow: hidden;
			margin-right: 30upx;
		}
		.content {
			color: #9b9b9b;
			font-size: 14px;
			line-height: 40upx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content:space-between;
			.name {
				color: #000;
				font-size: 16px;
				line-height: 40upx;
				margin-bottom: 10upx;
			}
			.time {
				font-size: 10px;
			}	
		}
		
	}


    .btn-box {
      	margin-top: 20upx;
      	border-top: 1px solid #eee;
      	padding-top: 20upx;
      	justify-content: space-between;
      	align-items: center;
      	.submit-btn {
      		width: 170upx;
      		height: 66upx;
      		line-height: 66upx;
      	}
      	.btn {
      		width: 170upx;
      		height: 66upx;
      		text-align: center;
      		line-height: 66upx;
      		background: rgba(255, 255, 255, 1);
      		border-radius: 10upx;
      		border: 1px solid rgba(151, 151, 151, 1);
      		margin-left: 20upx;
      		font-size: 14px;
      		color:#666;
      	}
      }


	.no-order {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 150rpx;
		image {
			width: 100rpx;
			height: 100rpx;
		}
	}

</style>
