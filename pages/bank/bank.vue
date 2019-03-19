<template>
	<view>
		<view class="list-box">
			<view class="item flex-column" v-for="(item, index) in bankList" :key="index">
				<view class="bank-name flex-row">
					<view class="title">{{ item.Banktype }}</view>
					<view class="default" v-if="item.IsDefault">默认</view>
					<view v-else="" @tap="setDefault(item.Id)" class="set-default">{{
						item.IsDefault ? '默认' : '设为默认'
					}}</view>
				</view>
				<view class="num">{{ item.BankCardNo }}</view>
				<view class="btn-box flex-row">
					<view @tap="deleteBank(item.Id)" class="btn red">删除</view>
					<view class="btn" @tap="changeBank(item.Id)">更改</view>
				</view>
			</view>
			<navigator url="/pages/bank/add/add" class="add-btn submit-btn">添加银行卡</navigator>
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

	computed: mapState(['bankList']),
	methods: {
		getBankList() {
			api.getBankList();
		},
		//设置为默认
		setDefault(id) {
			api.setDefault(id).then(res => {
				uni.showToast({
					title: '设置成功',
					icon: 'sucess'
				});
				this.getBankList();
			});
		},

		//删除银行卡
		deleteBank(id) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '确认删除该银行卡吗',
				success(res) {
					if (res.confirm) {
						api.deleteBankById(id).then(res => {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
							that.getBankList();
						});
					}
				}
			});
		},

		//编辑银行
		changeBank(id) {
			let obj = this.bankList.filter(val => val.Id == id)[0];
			let { BankUserName, Banktype } = obj;
			wx.navigateTo({
				url: `/pages/bank/add/add?id=${id}&BankUserName=${BankUserName}&Banktype=${Banktype}`
			});
		}
	}
};
</script>

<style lang="scss">
.list-box {
	padding: 30upx;
	box-sizing: border-box;
	/* #ifdef MP-WEIXIN */
	min-height: calc(100vh);
	/* #endif */

	/* #ifndef MP-WEIXIN  */
	min-height: calc(100vh - 88upx);
	/* #endif */

	.item {
		background: rgba(255, 255, 255, 1);
		border-radius: 20upx;
		padding: 40upx 30upx;
		box-sizing: border-box;
		margin-bottom: 30upx;
	}

	.bank-name {
		font-size: 12px;
		margin-bottom: 40upx;
		justify-content: space-between;
		align-items: center;
		.default {
			font-size: 16px;
			font-weight: bold;
		}
		.title {
			font-size: 30upx;
		}
		.set-default {
			width: 200upx;
			height: 66upx;
			line-height: 66upx;
			text-align: center;
			background: rgba(255, 255, 255, 1);
			border-radius: 10upx;
			border: 1px solid rgba(151, 151, 151, 1);
			color:#666;
		}
	}

	.num {
		font-size: 50upx;
		margin-bottom: 30upx;
	}

	.btn-box {
		justify-content: flex-end;
		.btn {
			padding: 0 30upx;
			line-height: 60upx;
			background: rgba(0, 149, 255, 1);
			color: #fff;
			font-size: 16px;
			border-radius: 30upx;
			margin-left: 15upx;
			&.red {
				background: rgba(255, 60, 0, 1);
			}
		}
	}

	.add-btn {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		font-size: 32upx;
		border-radius: 0;
	}
}
</style>
