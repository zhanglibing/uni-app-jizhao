
import {getUserId,Ajax} from './ajax.js'
import store from '../vuex/store.js'


//获取Fm列表
function getList(params) {
  let option = {
    Page: 1,
    PageSize: 5,
    Scene: '',
    Mood: '',
    IsShow: false,
    IsNew: true,
    IsHot: false,
    ...params
  }
  return new Promise((resolve, reject) => {
    Ajax('FMHandle/GetList', option).then(res => {
      resolve(res.GetList)
    })
  })
}


//获取Fm详情
function getFmDetails(Id) {
  return new Promise((resolve, reject) => {
    Ajax('FMHandle/get_ById', { Id }).then(res => {
        resolve(res.Create)
    })
  })
}

//获取评论列表
async function getCommentList(FMId){
  let option = {
    Page: 1,
    PageSize: 10000,
    FMId
  }
  return new Promise((resolve,reject)=>{
    Ajax('FMHandle/GetCommentList',option).then(res => {
        resolve(res.GetCommentList)
    })
  })
}

//提交评论
async function CreateComment(params){
	params.CustomerId=getUserId();
  return new Promise((resolve,reject)=>{
    Ajax('FMHandle/CreateComment',params).then(res => {
        resolve('ok')
    })
  })
}


//心理收藏列表
function getWishLists(){
  if(!store.state.userInfo){return false;}
  return new Promise((resolve,reject)=>{
    Ajax('FMHandle/GetWishLists', {CustomerId:getUserId()}).then(res => {
		store.commit('setFmWishList',res.CreateWishList)
        resolve(res.CreateWishList) ;
    })
  })
}



//心理fm收藏、取消收藏
function setWish(id){
  return new Promise((resolve,reject)=>{
    let option = {
      FMId: id,
      CustomerId:getUserId()
    }
    Ajax('FMHandle/CreateWishList', option).then(res => {
			  getWishLists();//更新收藏
        resolve(res.CreateWishList);
    })
  })
}

export default {
  getList,
  getFmDetails,
	getCommentList,
	setWish,
	getWishLists,
	CreateComment
}
