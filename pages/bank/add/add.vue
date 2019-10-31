<template>
	<view class='add-box'>
		<view class='item'>
			<input type="number" placeholder='请输入银行卡' v-model='edit.BankCardNo' @input="geBankName" @blur="checkedBank"
			 @bindconfirm="checkedBank">
			</input>
		</view>
		<view class='item'>
			<input v-model='edit.Banktype' :disabled="true" placeholder='银行卡所属机构（自动获取）'></input>
		</view>
		<view class='item'>
			<input placeholder='请输入持卡人姓名' v-model='edit.BankUserName'></input>
		</view>
		<view class="block-btn" @tap="submit">立即绑定</view>
	</view>

</template>

<script>
	import api from '../../../api/user.js'
	import {
		bankCardAttribution,
		getBank
	} from '../../../common/getBankName.js'

	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				edit: {
					BankCardNo: '',
					Banktype: '',
					BankUserName: '',
				},
				Banktype: '',
				id: '',
			};
		},
		onLoad(options) {
			let {
				id,
				Banktype,
				BankUserName
			} = options;
			if (id) {
				this.edit = {
					BankCardNo: '',
					BankUserName: BankUserName,
				};
				this.id = id,
					this.Banktype = Banktype;

			}
		},
		computed: mapState(['bankList']),
		methods: {
			submit(e) {
				let {
					BankCardNo,
					BankUserName,
					Banktype
				} = this.edit;
				if (!BankCardNo) {
					return this.$msg.error('银行卡不能为空')
				}
				if (!Banktype) {
					return this.$msg.error('请输入正确的银行卡')
				}
				if (!BankUserName) {
					return this.$msg.error('持卡人姓名不能为空')
				}
				let obj = { ...this.edit
				}
				if (this.id) {
					obj.BankId = this.id;
				}
				api.addOrEditBank(obj).then(res => {
					let msg = this.id ? '编辑成功' : '新增成功'
					uni.showToast({
						title: msg,
						icon: 'success'
					})
					api.getBankList()
					setTimeout(() => {
						uni.navigateBack({
							delta: 1,
						})
					}, 1000)

				})
			},

			//根据银行卡号获取银行机构
			geBankName() {
				let obj = bankCardAttribution(this.edit.BankCardNo);
				let type = ''
				if (obj != 'error') {
					type = obj.bankName;
				} else {
					type = '';
				}
				this.edit.Banktype = type;

			},
			//核对银行卡机构
			checkedBank() {
				let num = this.edit.BankCardNo;
				if (this.edit.Banktype) {
					return false;
				}
				if (num < 12) {
					uni.showToast({
						title: '请输入正确的银行卡',
						icon: 'none'
					})
					return false;
				}
				api.checkBank(num).then(res => {
					if (res.validated == 'true') {
						let list = getBank()
						let type = list.find(val => val.value == res.bank).text;
						this.edit.Banktype = type;

					} else {
						uni.showToast({
							title: '此银行卡号不存在',
							icon: 'none'
						})
					}
				}).catch(res => {

				})
			},
		}
	}
</script>

<style lang="scss">

	.add-box {
		padding: 50upx 50upx;
	}

	.edit-box {
		width: 600upx;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.item {
		margin-bottom: 40upx;
		background: #fff;
		height:120upx;
        border-radius:8px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding:0 30upx;
	}

	input {
		width:100%;
		height: 80upx;
		font-size: 16px;
		box-sizing: border-box;
	}
</style>
