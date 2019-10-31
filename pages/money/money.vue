<template>
	<view class="money-box">
		<view class="top-box">
			<view>账户余额（元）</view> <view class="num">{{ userInfo.CustomerBalance }}</view>
		</view>
		<view class="list">
			<!-- <navigator url="/pages/money/topup/topup">
				充值
				<view class="img-box"> <image src="/static/images/index/more.png"></image> </view>
			</navigator> -->
			<navigator url="/pages/money/withdrawal/withdrawal">
				提现
				<view class="img-box"> <image src="/static/images/index/more.png"></image> </view>
			</navigator>
			<view @tap="goBank">
				银行卡
				<view class="img-box"> <image src="/static/images/index/more.png"></image> </view>
			</view>

			<navigator url="/pages/money/record/record">
				提现记录
				<view class="img-box"> <image src="/static/images/index/more.png"></image> </view>
			</navigator>
		</view>
	</view>
</template>

<script>
import api from '../../api/user.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {};
	},
	onShow() {
		this.getBankList();
	},
	methods: {
		getBankList() {
			api.getBankList();
		},
		goBank(){
			let len=this.bankList.length;
			if(len){
				uni.navigateTo({
					url:'/pages/bank/bank'
				})
			}else{
				uni.showModal({
					title:"提示！",
					content:"您还没有绑定银行卡哦！",
					confirmText:"去绑定",
					success(res) {
						if(res.confirm){
							uni.navigateTo({
								url:'/pages/bank/add/add'
							})
						}
					}
				})
			}
			console.log()
		}
	},
	computed: mapState(['userInfo','bankList'])
};
</script>

<style>
.money-box {
	background: rgba(245, 245, 245, 1);
	box-sizing: border-box;
	min-height: calc(100vh - 86upx);
}

.top-box {
	background: rgba(3, 82, 138, 1);
	color: #fff;
	padding: 60upx 50upx;
	box-sizing: border-box;
	font-size: 12px;
	margin-bottom: 20upx;
}

.top-box .num {
	font-size: 40px;
	font-weight: 600;
	margin-top: 20upx;
}

.list > view,
.list > navigator {
	background: rgba(255, 255, 255, 1);
	margin-bottom: 20upx;
	height: 88upx;
	padding: 0 50upx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
}

.img-box {
	width: 36upx;
	height: 36upx;
}
</style>
