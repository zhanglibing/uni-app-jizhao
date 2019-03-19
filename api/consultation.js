/** 2019/01/21
 *author:zhanglibing
 *email:1053081179@qq.com
 *功能:
 */
import {
	Ajax,
	getUserId
} from './ajax.js'

import store from '../vuex/store'
//获取专家列表
async function getList(params) {
	let option = {
		pageIndex: 1,
		pageSize: 5,
		...params
	}
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/SearchCustomers', option).then(res => {

			let {
				Code,
				SearchCustomers
			} = res;
			SearchCustomers.customers.forEach(val => { //转义字符串
				val.PersonalIntroduction = val.PersonalIntroduction.replace(/_@/g, '<br>')
				// val.PersonalIntroduction = textDecode(val.PersonalIntroduction);
				if (val.Address2) {
					val.Address2 = val.Address2.split('-').slice(0, 2).join(' - ').replace('省', '').replace('市', '');
				}
			});
			resolve(SearchCustomers)
		})
	})
}

//获取专家详情
async function gtConsultantInfo(customerId) {
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/GetConsultantInfo', {
			customerId
		}).then(res => {
			let {
				ConsultantInfo,
				AvatarUrl
			} = res.GetConsultantInfo;
			let {Skilled,PersonalIntroduction,CareerBackground}=ConsultantInfo.ConsultantInfo;
			ConsultantInfo.ConsultantInfo.Skilled=Skilled.split(',');
			ConsultantInfo.ConsultantInfo.PersonalIntroduction=PersonalIntroduction.replace(/_@/g,'<br>'); 
			ConsultantInfo.ConsultantInfo.CareerBackground=CareerBackground.replace(/_@/g,'<br>'); 
			resolve({
				...ConsultantInfo,
				AvatarUrl
			})

		})
	})
}

//获取评论列表
async function gtListComment(params) {
	let option={
		 Page: 1,
         PageSize:1000,
		 ...params,
       
	}
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/ListCommentsByConsultantId', option).then(res => {
			resolve(res.ListComments)
		})
	})
}


//专家入驻第一步
async function BeConsultant_one(params) {
	params.customerId=getUserId();
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/BeConsultant_one', params).then(res => {
			params.StatusForConsultant=1;
			store.commit('setReplaceUserInfo',params)
			resolve(res.ListComments)
		})
	})
}

//专家入驻第第二步
async function BeConsultant_confirm(params) {
	params={
		...params,
		customerId:getUserId(),
		ConsultingNumber: 0, //预留参数 咨询数据
		CustomerNumber: 0, //预留参数 客户数据
		ArticleNumber: 0, //预留参数 文章数据
		Income: 0, //预留参数  收入
	}
	return new Promise((resolve, reject) => {
		Ajax('CustomerHandle/BeConsultant_confirm', params).then(res => {
			params.StatusForConsultant = 2;
			store.commit('setReplaceUserInfo',params)
			resolve(res.ListComments)
		})
	})
}




export default {
	getList,
	gtConsultantInfo,
	gtListComment
}

export {
	getList,
	gtConsultantInfo,
	gtListComment,
	BeConsultant_one,
	BeConsultant_confirm
	
}
