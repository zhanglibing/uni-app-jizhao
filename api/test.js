import {
	Ajax,
	getUserId
} from './ajax.js'

//获取测试题分类
function getClassList(){
  return new Promise((resolve, reject) => {
    Ajax('ProductHandle/PsychtestCategoryList', { Page: 1, PageSize: 100 }).then(res => {
      resolve(res.CategoryList)
    })
  })
}


//获取测试题列表
function getList(params){
  let option = {
    Category: 0,
    strWhere: '',
    PageIndex: 1,
    PageSize: 5,
    IsShow: false,
    ...params
  }
  return new Promise((resolve, reject) => {
    Ajax('PsychtestHandle/GetList', option).then(res => {
        resolve(res.GetList)
    })
  })
}


//获取测试详情
function getTestDetails(Id) {
  return new Promise((resolve, reject) => {
    Ajax('PsychtestHandle/Get_ById', { Id }).then(res => {
      let {Get_ById } = res;
        Get_ById.Description = `<div style="font-size:14px;line-height:26px;">${Get_ById.Description.replace(/\n/g, '<br>').replace(/\r/g, '&nbsp;')}</div>`;
        resolve(Get_ById)
    })
  })
}

//保存用户测试结果
async function saveUserTest(params) {
	params.CustomerId=getUserId();
  return new Promise((resolve, reject) => {
    Ajax('PsychtestHandle/InsertCustomerAnswer',params).then(res => {
        resolve(res.InsertCustomerAnswer)
    })
  })
}

//获取用户测试列表
async function getUserTestList(params) {
	params.CustomerId=getUserId();
	params={...params,page: 1,pageSize: 5}
  return new Promise((resolve, reject) => {
    Ajax('PsychtestHandle/CustomerAnswers',params).then(res => {
				 res.CustomerAnswers.answers.forEach(val => {
				   val.CustomerAnswer = JSON.parse(val.CustomerAnswer)
				 })
        resolve(res.CustomerAnswers)
    }).catch(res=>{
			 res.CustomerAnswers.answers.forEach(val => {
          val.CustomerAnswer = JSON.parse(val.CustomerAnswer)
        })
			  resolve(res.CustomerAnswers)
		})
  })
}


//获取单个测试结果
async function getUserTest(CustomerAnswerId) {
  return new Promise((resolve, reject) => {
    Ajax('PsychtestHandle/GetAnswer_ById',{CustomerAnswerId}).then(res => {
		  	res.GetAnswer_ById.CustomerAnswer=JSON.parse(res.GetAnswer_ById.CustomerAnswer);
        resolve(res.GetAnswer_ById)
    }).catch(res=>{
			res.GetAnswer_ById.CustomerAnswer=JSON.parse(res.GetAnswer_ById.CustomerAnswer);
			 resolve(res.GetAnswer_ById)
		})
  })
}


export default{
  getClassList,
  getList,
  getTestDetails,
	saveUserTest,
	getUserTestList,
	getUserTest
	
}
