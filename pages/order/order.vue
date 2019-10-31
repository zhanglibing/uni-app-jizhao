<template>
	<view class="order pageMinHeight">
		<view class="top-box flex-row">
			<view
				:class="{ active: item.status == orderStatus }"
				@tap="statusTap(item.status)"
				v-for="(item, index) in orderType"
				:key="index"
				>{{ item.name }}</view
			>
		</view>

		<view class="no-order" v-if="isShowNoOrder">
			<image src="/static/images/noOrder.png"></image> <view>暂无订单</view>
		</view>
		<view class="order-list">
			<view
				class="item"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="content flex-column" @tap="goOrderView(item.Id)">
					<view class="name flex-row">
						<text>{{ item.ProductTitle }}</text>
						<text class="status">{{ status[item.OrderStatus] }}</text>
					</view>
					<view class="desc-box">
						<view>订单创建时间：{{ item.CreatedOnUtc }}</view>
						<view>咨询时长：{{ item.ProductNum / 2 }}小时</view>
						<view>单价：{{ item.UnitPrice*2}}元/小时</view>
					</view>
				</view>

				<view class="btn-box flex-row">
					<text>总价: {{ item.OrderTotal }}元</text>
					<view class="flex-row">
						<block v-if="item.OrderStatus == 10">
							<view class="btn"  @tap="closeOrder(item.Id)">取消订单</view> 
							<view class="btn" @tap="paying(item)">立即付款</view>
						</block>
						<view v-if="item.OrderStatus == 13" class="submit-btn" @tap="goEvaluate(item.Id)">立即评价</view>
					  <view v-if="item.OrderStatus == 14" class="submit-btn" @tap="goExpert(item.ProductId)">再次预约</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
import api from '../../api/order.js';
import wxpay from '../../api/pay.js'
export default {
	data() {
		return {
			loadingType:0,
			status: {
				10: '待支付',
				11: '待确认',
				12: '待咨询',
				13: '待评价',
				14: '交易完成',
				15: '交易关闭'
			},
			orderType: [
				{
					name: '全部',
					status: ''
				},
				{
					name: '待付款',
					status: 10
				},
				{
					name: '待确认',
					status: 11
				},
				{
					name: '待咨询',
					status: 12
				},
				{
					name: '待评价',
					status: 13
				}
				
			],
			list: [],
			total: 0,
			orderStatus: '',
			page: 1,
			pageSize: 1000,
			isShowNoOrder: false
		};
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.orderStatus = options.type ? options.type : '';
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.init();
	},
	methods: {
		//初始化
		init(){
			uni.showLoading({
				title: '加载中...'
			});
			this.loadingType=0;
			this.isShowNoOrder = false;
			this.page=1;
			this.list=[];
			this.getlist();
		},
		//获取订单
		async getlist() {
			let { orderStatus, page, pageSize } = this;
			let { Data, Total } = await api.getList({
				orderStatus,
				page,
				pageSize
			});
			wx.hideLoading();
			wx.stopPullDownRefresh();
			if (orderStatus != this.orderStatus) {
				return false; //防止快速切换tab 引起数据错乱
			}
			this.list = this.list.concat(Data);
			//筛选对应状态的订单
			if(this.orderStatus){
				this.list=this.list.filter(val=>val.OrderStatus==this.orderStatus)
			}
			
			this.total = Total;
			this.loadingType = page * pageSize >= Total ? 2 : 0;
			this.isShowNoOrder = this.list.length?false:true;
		},
        //取消订单
		closeOrder(id){
			let that = this;
			uni.showModal({
				title:'确认取消该订单吗',
				success(res) {
					if(res.confirm){
						api.closedOrder(id).then(res=>{
							uni.showToast({
								title:'取消成功',
								icon:'success'
							})
							that.init();
						})

					}
				}
			})

		},   
		//立即支付
		paying(obj){
			 uni.showLoading({
			  title: '正在加载',
			})
			let {ProductType,ProductId,OrderTotal, ProductTitle, Id} = obj;
			wxpay.wxpay({
				ProductId,
				ProductName: ProductTitle,
				price: OrderTotal,
				orderId: Id,
				ProductType,
				redirectUrl: '/pages/order/order'
			});
		 },
		//tab切换
		statusTap(index) {
			this.orderStatus =index;
			this.init();
		},

		//前往订单详情页面
		goOrderView(id) {
			uni.navigateTo({
				url: '/pages/order/view/view?id=' + id
			});
		},
		goExpert(id){
			uni.navigateTo({
				url: '/pages/experts/view/view?id=' +id
			});
		},
		//评价
		goEvaluate(id){
			uni.navigateTo({
				url: 'evaluate/evaluate?id=' +id
			});
		}
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
		this.page++;
		this.getlist();
	}
};
</script>

<style lang="scss" scoped="">
/* pages/order/order.wxss */

page {
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
		border-radius: 10upx;
		margin-bottom: 30upx;
		padding:30upx;
		.content {
			color: #9b9b9b;
			font-size: 14px;
			line-height: 40upx;
			flex: 1;
			.name {
				justify-content: space-between;
				align-items: center;
				color: #000;
				font-size: 14px;
				line-height: 60upx;
				margin-bottom: 30upx;
				.status {
					font-size: 18px;
					font-weight: bold;
				}
			}
			.desc-box {
				font-size: 14px;
				line-height: 50upx;
				color: #9b9b9b;
			}
		}
	}
}

.btn-box {
	margin-top: 30upx;
	border-top: 1px solid #ccc;
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
	padding-top: 150upx;
}

.no-order image {
	width: 100upx;
	height: 100upx;
}
</style>
