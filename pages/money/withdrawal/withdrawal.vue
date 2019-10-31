<template>
	<view class="edit-box">
		<view class='input-box'>
			<input v-model="money" :placeholder="hasMoney" placeholder-style="font-size:16px;" type='digit'></input>
			<view class='select-all' @tap='selectAll'>全部提现</view>
		</view>

		<view class='bank'>
			<picker v-if="bankList.length" @bindchange="bindPickerChange" :value="index" :range="bankList" range-key="Banktype">
				<view class="picker">
					选择到银行卡：{{bankList[index].Banktype}}
				</view>
			</picker>
		</view>

		<view @tap='submit' class="block-btn"> 立即提现 </view>
	</view>
</template>

<script>
	import api from '../../../api/user.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				allNum: 0,
				index: 0,
				money: ''
			};
		},
		onShow() {
			this.allNum = this.userInfo.CustomerBalance;

		},
		computed:{
			...mapState(['userInfo', 'bankList']),
			hasMoney(){
				return `可用余额${this.userInfo.CustomerBalance}元`;
			}
		} ,
		methods: {

			//选择提现银行卡提现
			bindPickerChange(e) {
				console.log(e.detail.value);
				this.index = e.detail.value;
			},

			//立即提现
			submit() {
				if (!this.money) {
					return this.$msg.error('请输入提现金额')
				}
				if (this.money > this.allNum) {
					return this.$msg.error('提现金额超过余额');
				}
				this.bankList.filter(val => {
					val.Id
				})
				let option = {
					money: this.money,
					BankId: this.bankList[this.index].Id
				}
				api.creatWithDrawal(option).then(res => {
					uni.showToast({
						title: '提现成功',
						icon: 'success'
					})
					//清空
					this.money = '';
					//跟新用户信息
					api.getUserInfo(true)

				})
			},

			//选择全部提现
			selectAll() {
				this.money = this.userInfo.CustomerBalance
			},
		}
	}
</script>

<style lang="scss">

	.edit-box {
		padding: 30upx 40upx;
		box-sizing: border-box;
	}


	.input-box {
		border-bottom: 1px solid #eee;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height:120upx;
		background:rgba(255,255,255,1);
		border-radius:8px;
		padding:0 30upx;
		margin-bottom: 30upx;
		input {
			font-size: 30px;
			flex:1;
		}
		.select-all {
			color: #666;
			font-size: 16px;
		}
	}


	
	.bank {
		height:120upx;
		background:rgba(255,255,255,1);
		border-radius:8px;
		padding:0 30upx;
		line-height: 120upx;
		margin-bottom: 30upx;
		font-size: 16px;
		border-bottom: 1px solid #eee;
	}
	
</style>
