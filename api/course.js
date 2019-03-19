import {Ajax,getUserId} from './ajax.js'

//获取课程列表
async function getList(option) {
  let params = {
    IsShow: false,
    IsNew: false,
    IsPrice: false,
    CustomeType:1,  //1 普通用户  2 咨询师
    Page: 1,
    PageSize: 6,
    ...option
  }
  return new Promise((resolve, reject) => {
    Ajax('CurriculumHandle/GetList', params).then(res => {
        resolve(res.GetList)
    })
  })
}

//获取课程详情
async function getById(Id){
  return new Promise((resolve, reject) => {
    Ajax('CurriculumHandle/get_ById', {Id}).then(res => {
      let { Get_ById } = res;
			  Get_ById.Description=Get_ById.Description.replace(/<img/g, "<img style=\"max-width:100%;\"");
        Get_ById.Description = `<div style="font-size:12px;line-height:20px;">${Get_ById.Description}</div>`
        resolve(Get_ById)
    })
  })
}

//获取视频详情
async function getVidepUrl(VideoId) {
  return new Promise((resolve, reject) => {
    Ajax('CurriculumHandle/GetVideoPathUrl', { VideoId }).then(res => {
      resolve(res.Get_ById)
    })
  })
}


//获取分类
async function getClass(type = '') { //type有值时用来筛选器对应子集分类
  return new Promise((resolve, reject) => {
    let option = {
      SearchCategoryName: '',
      Page: 1,
      PageSize: 1000,
    }
    Ajax('Admin/ProductHandle/CategoryList', option).then(res => {
      let list = res.CategoryList.Data;
        if (type) {
          list = list.filter(val => val.ParentCategoryId == type)
        }
        resolve(list);
    })
  })
}

//获取了课程评论
async function getComents(option) { //type有值时用来筛选器对应子集分类
  return new Promise((resolve, reject) => {
    Ajax('CurriculumHandle/GetComments_ById', option).then(res => {
      let {Code, GetComments_ById} = res;
        GetComments_ById.model.forEach(val=>{
          let name=val.NickName?val.NickName:val.ReakName;
          if(name){
            name=`${name.slice(0,1)}**`
          }else{
            name="匿名";
          }
          val.NickName=name;
        })
        resolve(GetComments_ById);
    })
  })
}
export default{
  getList,
  getById,
  getVidepUrl,
  getClass,
	getComents
  
}