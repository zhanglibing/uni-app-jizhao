
import store from '../vuex/store.js'
const host = 'https://back.jizhaojk.com/'; //正式环境
// const host = 'http://xfmfxl.iok.la/';//测试环境？？

function Ajax(path, option,methods='POST'){
  return new Promise((resolve, reject) => {
    uni.request({
      url: host + path,
      method: methods,
      data: option,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res) => {
		 
        if (res.data.Code == 200) {
          resolve(res.data);
        }
        reject(res.data)

      },
      fail: (res) => {
		   console.log(res)
        // wx.navigateTo({
        //   url: "/pages/authorize/index"
        // })
        reject('请求失败')
      }
    })
  })
}

//全局获取用户id
function getUserId(){
	let userInfo=store.state.userInfo;
  if(!userInfo){
    wx.navigateTo({
      url: '/pages/login/login',
    })
    return false;
  }
  return userInfo.customerId;
}

export {
  Ajax ,
	getUserId,
	host
}