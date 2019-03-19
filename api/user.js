import {
	Ajax,
	getUserId
} from './ajax.js'

import store from '../vuex/store.js'



//获取用户信息（余额信息等）
function getUserInfo(bool = false) { //bool 为true时更新用户余额  false时正常获取
	console.log("请求用户余额接口正在调用")
	return new Promise((resolve, reject) => {
		Ajax('/CustomerHandle/Get_CustomerId', {
			Id: getUserId()
		}).then(res => {
			let {
				Get_CustomerId
			} = res;
			store.commit('setReplaceMoney',Get_CustomerId)
			resolve(Get_CustomerId)

		})
	})
}

//保存个人信息
function saveUserInfo(params) {
	params.customerId = getUserId();
	return new Promise((resolve, reject) => {
		Ajax('/CustomerHandle/EditCustomerInfo', params).then(res => {
			let {
				Pid,
				Cid,
				Aid
			} = params;
			let obj = {
				ProvinceId: Pid,
				CityId: Cid,
				AreaId: Aid
			}
			store.commit('setReplaceUserInfo',{...obj,...params});
			resolve('ok')
		})
	})
}

//获取银行卡列表
function getBankList() {
	return new Promise((resolve, reject) => {
		Ajax('/CustomerHandle/ListBank', {
			CustomerId: getUserId()
		}).then(res => {
			let {
				ListBank
			} = res;
			store.commit('setBankList', ListBank)
			resolve(ListBank);
		})
	})
}

//設置银行卡为默认
function setDefault(id) {
	let option = {
		BankId: id,
		CustomerId: getUserId()
	};
	return new Promise((resolve, reject) => {
		Ajax('/CustomerHandle/SetDefault', option).then(res => {
			let {
				ListBank
			} = res;
			resolve(ListBank);
			wx.setStorage({
				key: "bankList",
				data: ListBank
			})

		})
	})
}

//删除银行卡
function deleteBankById(BankId) {
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/DeleteBank', {
			BankId
		}).then(res => {
			resolve('ok');
		}).catch(res => {
			reject('error')
		})
	})
}

//新增、修改银行卡
function addOrEditBank(params) {
	let url = params.BankId ? 'EditBank' : 'CreateBank';
	params.CustomerId = getUserId();
	return new Promise((resolve, reject) => {
		Ajax(`/CustomerHandle/${url}`, params).then(res => {
			resolve('ok');
		})
	})
}

//请求银行卡机构 （本地无法判断的请求后台验证）
function checkBank(cardNo) {
	return new Promise((resolve, reject) => {
		Ajax(`/CustomerHandle/GetBankInfo`, {
			cardNo
		}).then(res => {
			resolve(res.GetBankInfo);
		})
	})
}

// 获取提现记录
function getWithdrawalRecord(params) {
	let option = {
		customerId: getUserId(),
		...params
	}
	return new Promise((resolve, reject) => {
		Ajax('CapitalHandle/List_ByCustomerId', option).then(res => {
			resolve(res.List)
		})
	})
}
// 查看凭证
function getPictureUrl(pictureId) {
	return new Promise((resolve, reject) => {
		Ajax('Admin/PictureHandle/Get_PictureUrl', {pictureId}).then(res => {
			resolve(res.Get_PictureUrl)
		})
	})
}

//提现
function creatWithDrawal(params) {
	let option = {
		CustomerId: getUserId(),
		...params
	}
	return new Promise((resolve, reject) => {
		Ajax('CapitalHandle/Create', option).then(res => {
			resolve('ok')
		})
	})
}

//获取擅长领域
function getGoodFile() {
	return new Promise((resolve, reject) => {
		let res=uni.getStorageSync('GoodFields');
		if(res){
			resolve(res);
			return false;
		}
		Ajax('CustomerHandle/GetGoodFields').then(res => {
			uni.setStorageSync('GoodFields', res.GetGoodFields);
			resolve(res.GetGoodFields)
		})
	})
}

//获取省市区
function getPAC() {
	return new Promise((resolve, reject) => {
		let res=uni.getStorageSync('PCA');
		if(res){
			resolve(res);
			return false;
		}
		Ajax('CustomerHandle/GetPCA').then(res => {
			uni.setStorageSync('PCA', res.GetPCA);
			resolve(res.GetPCA)
		})
	})
}

//登录
function login(params) {
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/LoginNew', params).then(res => {
			resolve(res.customer)
		}).catch(res=>{
			reject(res)
		})
	})
}



export default {
	getUserInfo,
	saveUserInfo,
	getBankList,
	setDefault,
	deleteBankById,
	addOrEditBank,
	checkBank,
	getWithdrawalRecord,
	creatWithDrawal,
	getGoodFile,
	getPAC,
	login,
	getPictureUrl,

}
