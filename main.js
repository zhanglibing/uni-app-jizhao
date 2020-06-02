import Vue from 'vue'
import App from './App'
import store from './vuex/store.js'


import pictureCom from './components/pictureCom.vue'
import nothingBottom from './components/nothing-bottom.vue'
import uniLoadMore from './components/uni-load-more.vue'
import kefu from './components/kefu.vue'
Vue.component('picture-com',pictureCom)
Vue.component('nothing-bottom',nothingBottom)
Vue.component('uni-load-more',uniLoadMore)
Vue.component('kefu',kefu)

Vue.config.productionTip = false
Vue.prototype.$store = store;

//服务器图片统一配置
Vue.prototype.$imgPrePath = 'https://back.jizhaojk.com/content/images/WeChat/';



//提示
Vue.prototype.$msg={
  success(){

  },
  error(text){
    wx.showModal({
      title: '提示',
      content: text,
      showCancel: false
    })
  }
}

Vue.prototype.$isLogin=()=>{
	if(store.state.userInfo){
		return true;
	}
	store.commit('setIsLoginShow',true)
	// uni.navigateTo({
	// 	url:'/pages/login/login'
	// })
	return false;
}



App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
