/** 2017/10/5
 *author:zhanglibing
 *email:1053081179@qq.com
 *功能:
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

//获取session值
function getSessionByName(name) {
	var val = 0;
	let val1 = uni.getStorageSync(name);
	if (val1 != "-1" && val1) {
		return val1;
	}
	return val;
}
// 
function setSessionVal(name, val) {
	uni.setStorageSync(name, val);
}

//状态
const state = {
	sessionId: null,
	wxInfo: null, //微信信息
	bankList: getSessionByName('bankList'),
	userInfo: getSessionByName('userInfo'), //用户信息
	unionid:getSessionByName('unionid'),
	experts:{},  //跳转tap页面不能传参数
	fmList:[],  //fm播放列表
	fmWishList:[], //fm收藏列表
	platform:'ios',  //android
	certiResult:{}, // 证件查询结果
	isLoginShow:false,
}

const mutations = {
	setUnionid(state, val) {
		state.unionid = val;
		console.log(val)
		setSessionVal('unionid', val)
	},
	setSessionId(state, val) {
		state.sessionId = val;
		setSessionVal('sessionId', val)
	},
	setBankList(state, val) {
		state.bankList = val;
		setSessionVal('bankList', val)
	},
	setWxInfo(state, val) {
		state.wxInfo = val;
	},
	//登录保存用户信息
	setUserInfo(state, val) {
		let userInfo = val ? SortingUserInfo(val) : val;
		state.userInfo = userInfo;
		setSessionVal('userInfo', userInfo)
	},
	//更新余额 (基本信息)
	setReplaceMoney(state, val) {
		let {CustomerBalance,StatusForConsultant,Addresses,RealName,QQ,ConsultantInfo}=val;
		let userInfo={...state.userInfo,...Addresses[0],...ConsultantInfo,CustomerBalance,StatusForConsultant,RealName,QQ}
		state.userInfo=userInfo
		setSessionVal('userInfo', userInfo);
		console.log('余额更新成功')
	},
	//保存用户基本信息时 跟新缓存
	setReplaceUserInfo(state,val){
		let {Pid,Cid,Aid}=val;
		let usesInfo={...state.userInfo,...val,ProvinceId:Pid,CityId:Cid,AreaId:Aid};
		state.userInfo=usesInfo;
		setSessionVal('userInfo', state.userInfo);
	},
	setFmWishList(state,val){
		state.fmWishList=val;
	},
	setFmList(state,val){
		state.fmList=val;
	},
	setClearUserInfo(state,val){
		let usesInfo=null;
		setSessionVal('userInfo', null);
	},
	//   暂时为头像上传
	setReplaceUserInfo(state,val){
		let usesInfo={...state.userInfo,...val};
		state.usesInfo=usesInfo;
		setSessionVal('userInfo', usesInfo);
	},
	setPlatform(state,val){
		state.platform=val;
	},
	setCertiResult(state,val){
		state.certiResult=val;
	},
	setIsLoginShow(state,val){
		state.isLoginShow=val;
	}
	
}

const getters = {
   
}

const actions = {

}


export default new Vuex.Store({
	state,
	mutations,
	getters,
	actions
})

//整理登录获取到的用户数据
function SortingUserInfo(data) {
	let {
		customer,
		AvatarUrl,
		Gender,
		IdPictureUrl,
		IdPicture1Url,
		ProfessionalLicensesUrl,
		dateOfBirth
	} = data;

	let {
		Id,
		Email,
		QQ,
		NickName,
		RealName,
		Username,
		StatusForConsultant,
		WeChat,
		CustomerGuid,
		ConsultantInfo,
		CustomerBalance
	} = customer

	var obj = {
		AvatarUrl,
		IdPictureUrl,
		IdPicture1Url,
		ProfessionalLicensesUrl,
		Email,
		QQ,
		NickName,
		RealName,
		Username,
		CustomerGuid,
		Gender,
		customerId: Id,

		StatusForConsultant, //审核到第几部 0、null未审核  1第一步审核完
		WeChat,
		Birthday: dateOfBirth,
		...ConsultantInfo,
		...customer.Addresses[0],
		CustomerBalance,
	};

	if (customer.CustomerRoles) {
		obj.SystemName = customer.CustomerRoles[0].SystemName; //Registered:用户   Consultant:咨询师
	};

	return obj;
}
