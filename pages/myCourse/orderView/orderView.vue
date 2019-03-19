<template>
	<view class="view-box">
		<view class="order-status">订单状态：{{ orderTypes[orderDetails.OrderStatus] }}</view>
		
		<view class="info-box">
			<view class="module-title">订单详情</view>
			<view class="content">
				<view>
					<view>总订单名称：</view> <text>{{ orderDetails.ProductTitle }}</text>
				</view>
				<view>
					<view>订单总额：</view> <text>{{ orderDetails.OrderTotal }}元</text>
				</view>
				<view>
					<view>付款方式：</view>
					<text>{{
						orderDetails.PaymentMethod == 'ALP'
							? '支付宝支付'
							: orderDetails.PaymentMethod == 'WXP'
							? '微信支付'
							: '余额支付'
					}}</text>
				</view>
			</view>
			<view class="server" @tap="callPhone">
				<image src="/static/images/phone.png"></image> 拨打客服热线
			</view>
		</view>
        <view class="info-box">
        	<view class="module-title">订单其他信息</view>
        	<view class="content">
        		<view>
        			<view>订单编号</view> <text>{{ orderDetails.CustomOrderNumber }}</text>
        		</view>
        		<view>
        			<view>下单时间</view> <text>{{ orderDetails.CreatedOnUtc }}</text>
        		</view>
        		<view v-if="orderDetails.PaidDate">
        			<view>付款时间</view> <text>{{ orderDetails.PaidDate }}</text>
        		</view>
        		<view v-if="orderDetails.CompleteDate">
        			<view>完成时间</view> <text>{{ orderDetails.CompleteDate }}</text>
        		</view>
        		<view v-if="orderDetails.CompleteDate">
        			<view>评价时间</view> <text>{{ orderDetails.CompleteDate }}</text>
        		</view>
        	</view>
        </view>
	
		<view class="bottom-box" v-if="orderDetails.OrderStatus==10||orderDetails.OrderStatus==11">
			<view class="btn" v-if="orderDetails.OrderStatus==10" @tap="paying">立即付款</view>
			<view class="btn" v-else="" @tap="goEvaluate">立即评价</view>
		</view>
		
	</view>
</template>

<script>
import api from '../../../api/order.js';
import wxpay from '../../../api/pay.js'

export default {
	data() {
		return {
			orderTypes: {
				10: "待支付",
				11: "待评价",
				14: "交易完成",
				15: "交易关闭"
			},
			orderDetails: {},
		};
	},
	onLoad: function(options) {
		let id = options.id;
		//获取订单性情
		api.getDetailsById(id).then(res => {
			this.orderDetails = res;
		});

	},
	methods: {
		//拨号客服
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: '051269576237'
			});
		},
		//立即支付
		paying(){
			 uni.showLoading({
			  title: '正在加载',
			})
			let {ProductId,OrderTotal,ProductTitle, Id} = this.orderDetails;
			wxpay.wxpay({
				ProductId,
				ProductName: ProductTitle,
				price: OrderTotal,
				ProductType: 'V',
				orderId: Id,
				redirectUrl: '/pages/myCourse/index'
			});
		},
		//评价
		goEvaluate() {
			let {
				Id,
				ProductId
			} = this.orderDetails;
			uni.navigateTo({
				url: `/pages/myCourse/evaluate/evaluate?OrderId=${Id}&CurriculumId=${ProductId}`,
			})
		},
	}
};
</script>

<style lang="scss">
page {
	padding: 30upx 30upx 120upx;
	box-sizing: border-box;
}
.order-status {
	background: #095289;
	line-height: 220upx;
	padding-left: 30upx;
	font-size: 18px;
	margin-bottom: 30upx;
	color: #fff;
	border-radius: 20upx;
}

.module-title {
	height: 80upx;
	line-height: 80upx;
	color: #000;
	font-weight: bold;
	font-size: 18px;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	text{
		color:#666;
		font-size: 12px;
		font-weight: normal;
	}
}

.info-box {
	padding:30upx;
	border-radius: 20upx;
	box-sizing: border-box;
	font-size: 16px;
	margin-bottom: 30upx;
	background: #fff;
	.content > view {
		line-height: 60upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color:#666;
		&> view text {
			color: rgba(149, 149, 149, 1);
		}
	}
}

.server {
	width: 100%;
	height: 80upx;
	background: #095289;
	border-radius: 6px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	color: #fff;
	margin-top: 30upx;
	image {
		width:40upx;
		height: 40upx;
		margin-right: 20upx;
	}
}

.bottom-box{
	position: fixed;
	width:100%;
	bottom:0;
	left:0;
	height:100upx;
	line-height: 100upx;
	background: #095289;
	color:#fff;
	text-align: center;
	.btn{
		font-size: 18px;
	}
	
}


</style>
