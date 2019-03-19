<template>
	<view class="list-box">
		<view class="item flex-column" v-for="(item, index) in list" :key="index">
			<view class="time-box flex-row">
				<view class="time">申请日期: {{ item.capitalWithdrawals.CreateDate }}</view>
				<view class="status">{{ status[item.capitalWithdrawals.Status] }}</view>
			</view>
			<view class="num-box">￥{{ item.capitalWithdrawals.money }}</view>
			<view class="flex-row card-box">
				<view class="card">
					<view>提现卡号（后四位）</view>
					<view>**** **** **** {{ item.BankCardNo }}</view>
				</view>
				<view class="text">
					<view>银行机构</view> <view>{{ item.Banktype }}</view>
				</view>
			</view>
			<view class="credentials" v-if="item.capitalWithdrawals.Status==2" @tap="getImg(item.capitalWithdrawals.TransferVoucher)">查看凭证</view>
		</view>
		<view class="show-img" v-if="imgPath" @tap="imgPath=''">
			<image :src="imgPath" mode="widthFix"></image>
		</view>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
import api from '../../../api/user.js';
export default {
	data() {
		return {
			loadingType: 0,
			list: [],
			status: {
				0: '待审核',
				1: '已审核待转账',
				2: '已完成转账'
			},
			tagType: {
				0: 'default',
				1: 'danger',
				2: 'primary'
			},
			page: 1,
			pageSize: 5,
			total: 0,
			imgPath:''
		};
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.init();
	},
	methods: {
		init(){
			this.list = [];
			this.page = 1;
			this.getlist();
		},
		//获取凭证图片
		getImg(id){
			api.getPictureUrl(id).then(res=>{
				this.imgPath=res;
			
			})
		},
		//获取提现记录
		getlist() {
			let { page, pageSize } = this;
			uni.showLoading({
				title: '加载中...'
			});
			api.getWithdrawalRecord({
				page,
				pageSize
			}).then(res => {
				uni.hideLoading();
				uni.stopPullDownRefresh();
				let { Data, Total } = res;
				this.list = this.list.concat(Data);

				this.loadingType = page * pageSize >= Total ? 2 : 0;
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

<style lang="scss">
.list-box {
	padding: 0 30rpx;
	box-sizing: border-box;
	background: rgba(245, 245, 245, 1);
}
.item {
	position: relative;
	background: #fff;
	padding:40upx 30rpx;
	border-radius: 10rpx;
	margin-bottom: 30rpx;
}
.time-box {
	justify-content: space-between;
	margin-bottom: 30upx;
	.status {
		font-size: 18px;
		font-weight: bold;
	}
}

.bankName {
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.card-box {
	justify-content: space-between;
	line-height: 60upx;
	.text {
		min-width: 240upx;
	}
}

.num-box {
	justify-content: space-between;
	font-size: 30px;
	margin-bottom: 30rpx;
}

.button.primary {
	background: #26a2ff;
}
.credentials {
	height: 66upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 10upx;
	text-align: center;
	line-height: 66upx;
	border: 1px solid rgba(155, 155, 155, 1);
	color:#9B9B9B;
	margin-top: 30upx;
	font-size: 16px;
}

.show-img{
	position: fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background: rgba(0,0,0,0.6);
}
</style>
