
import {Ajax,getUserId} from './ajax.js'

// 获取文章列表
function getArticleList(params) {
	let option ={
		Page: 1,
    PageSize: 10,
		flag:1,
		...params
	}
  return new Promise((resolve, reject) => {
    Ajax('BlogHandle/GetAllBlogList', option).then(res => {
			let {PictureUrl,Total,blogPosts}=res.GetAllBlogList;
			blogPosts.forEach(val=>{
				val.imgPath=PictureUrl[val.Id]
			})
      resolve({list:blogPosts,Total})
    })
  })
}



// 获取咨询师文章
function getMyArticle(params) {
  return new Promise((resolve, reject) => {
    Ajax('BlogHandle/GetBlogPostsByCustomerId', {
      flag: null, //1时为审核通过的   null所有
      ...params
    }).then(res => {
			let {PictureUrl,Total,blogPosts}=res.GetAllBlogList;
			blogPosts.forEach(val=>{
				val.imgPath=PictureUrl[val.Id]
			})
			resolve({list:blogPosts,Total})
    })
  })
}



// 发表讨论帖
function publishPosting(params) {
  return new Promise((resolve, reject) => {
    Ajax('ForumsHandle/TopicCreate', {
      customerId:getUserId(),
			TopicType:1,  //1普通用户   0咨询师
      ...params
    }).then(res => {
        resolve(res.GetConsultantOrderList)
    })
  })
}

// 获取讨论帖详情
function getTopicView(TopicId) {
  return new Promise((resolve, reject) => {
    Ajax('ForumsHandle/Topic', {
      TopicId
    }).then(res => {
      let {
				AvatarUrl,
        ForumPosts,
        pictureUrl,
        topic
      } = res.Topic
      topic.Details = setRichText(topic.Details);
      ForumPosts.forEach(val=>{
        val.ForumPost.Text = setRichText(val.ForumPost.Text)
        val.ForumPostPostHandleModels.forEach(v=>{
          v.ForumPostPost.Text = setRichText(v.ForumPostPost.Text)
        })
      })
      resolve({ AvatarUrl,pictureUrl,ForumPosts, ...topic})

    })
  })
}

// 获取文章详情
function getArticleView(Id) {
  return new Promise((resolve, reject) => {
    Ajax('BlogHandle/GetBlogpostById', {
      Id
    }).then(res => {
      let {
        PictureUrl,
        blogpost
      } = res;
      let body = blogpost.Body;
      blogpost.Body = setRichText(body);
      resolve({
        PictureUrl,
        ...blogpost
      })
    })
  })
}


//富文本显示转化
function setRichText(val){
  return `<div >${val.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;').replace(/_@/g, '<br>').replace(/_#/g, '&nbsp;')}</div>`
}

// 我的回复
function postCreate(params) {
  return new Promise((resolve, reject) => {
    Ajax('ForumsHandle/postCreate', {
      customerId:getUserId(),
      ...params,
    }).then(res => {
       resolve('ok')
    })
  })
}

// 回复别人的回复
function postpostCreate(params) {
  return new Promise((resolve, reject) => {
    Ajax('ForumsHandle/postpostCreate', {
      customerId:getUserId(),
      ...params,
    }).then(res => {
      resolve('ok')
    }).catch(res=>{
			reject('error')
		})
  })
}



export default {
  publishPosting,
  getTopicView,
  getMyArticle,
  getArticleView,
  postCreate,
  postpostCreate,
	getArticleList
}