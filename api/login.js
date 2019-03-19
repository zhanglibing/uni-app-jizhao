/**
 * 小程序登录
 * 
 */
import {Ajax,getUserId} from './ajax.js'


import store from '../vuex/store.js'

//执行微信code换取sessionId （sessionId用于登录、微信支付等）
function login() {
	uni.login({
		provider: 'weixin',
		success: res => {
			//请求用户数据
			Ajax('WXLogin/MiniProgramLogin', {
				code: res.code,
				type:1,
			}).then(data => {
			
				let sessionId = data.MiniProgramLogin;
				store.commit('setSessionId',sessionId)
				getLoginUser(sessionId)
			})
		}
	})
}

//获取用户信息   如果绑定过可直接获取到数据、 没有绑定过要去登录页面进行登录
function getLoginUser(id) {
	//获取微信用户信息
	uni.getUserInfo({
		success: res => {
			let {
				encryptedData,
				iv,
				userInfo
			} = res;
			store.commit('setWxInfo', userInfo)
			let option = {
				encryptedData,
				iv,
				userInfo,
				sessionId: id,
				typenew:1 

			}
			Ajax('WXLogin/DecodeEncryptedData', option).then(data => {
				let type = typeof data.DecodeEncryptedData;
				if (type == 'string') {
					console.log('获取uid')
					console.log(data)
					store.commit('setUnionid',data.DecodeEncryptedData)
					//未绑定过微信  去登录页面执行登录绑定
// 					wx.navigateTo({
// 						url: '/pages/login/login',
// 					})
				} else {
					store.commit('setUserInfo', data.DecodeEncryptedData)
				}
			})
		},
		fail: () => {
			//还未授权
			console.log("失敗")
			uni.navigateTo({
				url: '/pages/authorize/authorize',
			})
		}
	})
}

//注册账号
function reg() {
	return new Promise((resolve,reject)=>{
		//请求用户数据
		Ajax('CustomerHandle/Register', {
			code: res.code
		}).then(res => {
			resolve(res)
			//调用登录接口
		}).catch(res=>{
			console.log(res)
		})
	})
}

//发送短信验证码
function sendSms(option){
	console.log(option)
	return new Promise((resolve,reject)=>{
		Ajax('CustomerHandle/SendSMS',option).then(res=>{
			resolve('ok')
		})
	})
}

//修改密码
function changePsd(option){
	return new Promise((resolve,reject)=>{
		Ajax('CustomerHandle/ChagePassword',option).then(res=>{
			resolve('ok')
		}).catch(res=>{
			reject(res.ChagePassword)
		})
	})
}

//验证手机号码是否已经注册
function phoneIsReg(Username){
	return new Promise((resolve,reject)=>{
		Ajax('CustomerHandle/CheckUsernameAvailability',{Username}).then(res=>{
			resolve(res.CheckUsernameAvailability); //true:未注册  false:已经注册 
		}).catch(res=>{
			reject(false)
		})
	})
}


//退出登录
function logOut(params) {
  Ajax('CustomerHandle/ClearWeChat', { customerId:getUserId()}).then(res => {
    store.commit('setClearUserInfo',null);
    uni.reLaunch({
    	url: '../login/login',
    });
  }).catch(res => {
   
  })
}

export {
	login,
	sendSms,
	changePsd,
	reg,
	phoneIsReg,
	logOut
}