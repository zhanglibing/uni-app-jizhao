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
					<view>首次咨询时间：</view> <text>{{ orderDetails.ConsultationTime }}</text>
				</view>
				<view>
					<view>咨询单价(0.5小时)：</view> <text>{{ orderDetails.UnitPrice }}元</text>
				</view>
				<view>
					<view>咨询时长（小时）：</view>
					<text>{{ orderDetails.ProductNum / 2 }}小时</text>
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
        		<view v-if="orderDetails.ConfirmDate">
        			<view>确认时间</view> <text>{{ orderDetails.ConfirmDate }}</text>
        		</view>
        		<view v-if="orderDetails.CompleteDate">
        			<view>完成时间</view> <text>{{ orderDetails.CompleteDate }}</text>
        		</view>
        		<view v-if="orderDetails.CompleteDate">
        			<view>评价时间</view> <text>{{ orderDetails.CompleteDate }}</text>
        		</view>
        	</view>
        </view>
	
		<!--订单评价  -->
		<view class="info-box comment-box" v-for="(item, index) in orderComments" :key="index" v-if="orderComments.length" >
			<view class="module-title">订单评价</view>
			<textarea v-model="item.CommentContent"></textarea>
			<view class="star-list">
				<view class="item">
					<text>描述服务：</text>
					<el-rate :index="item.DescriptionConsistent"></el-rate>
				</view>
				<view class="item">
					<text>解答程度：</text>
					<el-rate :index="item.AnswerDegree"></el-rate>
				</view>
				<view class="item">
					<text>客服态度：</text>
					<el-rate :index="item.ServiceAttitude"></el-rate>
				</view>
			</view>
		</view>
        <view class="info-box">
        	<view class="module-title">咨询服务协议</view>
        	<view class="content">
        		<view @tap="goConsulting">
        			点击查看咨询服务协议 》
        		</view>
        	</view>
        </view>
		<view class="info-box">
			<view class="module-title">用户信息</view>
			<view class="content">
				<view>
					<view>昵称</view> <text>{{ orderDetails.CustomerNickName }}</text>
				</view>
				<view>
					<view>性别</view> <text>{{ orderDetails.Gender == 'M' ? '男' : '女' }}</text>
				</view>
				<view>
					<view>年龄</view> <text>{{ orderDetails.dateOfBirth }}</text>
				</view>
				<view>
					<view>城市</view> <text>{{ orderDetails.CustomerCity }}</text>
				</view>
			</view>
		</view>
		<view class="info-box" v-if="remarks">
			<view class="module-title">建议及家庭作业 <text>{{remarks.CreateDate}}</text></view>
			<view class="content">
				<view>
					{{remarks.Homework}}
				</view>
			</view>
		</view>
        
		<!-- 底部 -->
		<view class="bottom-box" v-if="orderDetails.OrderStatus==10||orderDetails.OrderStatus==13">
			<view class="btn" v-if="orderDetails.OrderStatus==10" @tap="paying">立即付款</view>
			<view class="btn" v-if="orderDetails.OrderStatus==13">立即评价</view>
		</view>
		
		
	</view>
</template>

<script>
import api from '../../../api/order.js';
import wxpay from '../../../api/pay.js'
import elRate from '../../../components/elRate.vue'
export default {
	components:{
		elRate
	},
	data() {
		return {
			orderTypes: {
				10: '未付款',
				11: '待确认',
				12: '待咨询',
				13: '待评价',
				14: '已评价',
				15: '交易关闭'
			},
			orderDetails: {},
			orderComments: [],
			remarks:null
		};
	},
	onLoad: function(options) {
		let id = options.id;
		//获取订单性情
		api.getDetailsById(id).then(res => {
			res.dateOfBirth = this.getAge(res.dateOfBirth);
			this.orderDetails = res;
			if (res.OrderStatus == 14) {
				//获取评价
				this.getOrderComment(id);
			}
		});
	    //获取咨询记录
		api.getEssaysRecord(id).then(res=>{
			console.log(res)
		  if(res.list){
			this.remarks={ ...res, ...res.list };
		  }
		})
	},
	methods: {
		getOrderComment(id) {
			api.getOrderComment(id).then(res => {
				this.orderComments = res;
			});
		},
		//根据生日换算年龄
		getAge(val) {
			if (!val) {
				return '';
			}
			var myDate = new Date();
			var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
			var month = myDate.getMonth() + 1;
			let old = val.split('-')[0];
			return year - old;
		},

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
			let {ProductType,ProductId,OrderTotal, ProductNum,UnitPrice,ProductTitle, Id} = this.orderDetails;
			wxpay.wxpay({
				ProductId,
				ProductNum,
				ProductName: ProductTitle,
				price: UnitPrice,
				orderId: Id,
				ProductType,
				redirectUrl: '/pages/order/order'
			});
		},
		goConsulting(){
			let {CreatedOnUtc,ProductId,CustomerInfo,OrderTotal}=this.orderDetails;
			uni.navigateTo({
				url: `../../consulting/consulting?id=${ProductId}&time=${CreatedOnUtc}&CustomerInfo=${CustomerInfo}&OrderTotal=${OrderTotal}`,
			});
		}
	
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


/* 评价内容 */

.comment-box {
	padding: 30upx 30upx;
	font-size: 16px;
}

textarea {
	width: 100%;
	border: 1px solid #ccc;
	padding: 15upx;
	box-sizing: border-box;
	border-radius: 4px;
	margin-bottom: 20upx;
}

.star-list {
	.item {
		display: flex;
		flex-direction: row;
		align-items: center;
		line-height: 60upx;
	}
	image {
		width: 35upx;
		height: 35upx;
		margin-right: 10upx;
	}
}

.record-box {
	padding: 30upx;
	font-size: 14px;
	line-height: 40upx;
	.item {
		margin-bottom: 20upx;
		.record-content {
			margin-bottom: 10upx;
			 view {
				width: 70px;
			}
			 text {
				flex: 1;
			}
		}
		
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
