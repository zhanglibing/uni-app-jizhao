import {Ajax,getUserId} from './ajax.js'
import api from './user.js';
import store from '../vuex/store'
//获取下单参数（整理不同情况的参数）
function getOption(obj) {
  let {
    sessionId,
    userInfo
  } = store.state;
	
	console.log(sessionId)
  let CustomerBalance = userInfo.CustomerBalance;
  let price = obj.price * 100;
	//咨询订单
	if(!obj.ProductNum){
		obj.ProductNum=1;
	}
	let orderTotal=obj.ProductNum*price; //计算总价
	obj.orderTotal=orderTotal;
  obj.price = price;
  let customerBalance = CustomerBalance ? Math.round(CustomerBalance * 100) : 0;
  let needMoney = orderTotal - customerBalance;
  let payType = 'WXP';
  if (needMoney <= 0) { //账户余额大于付款金额时
    payType = 'YEP';
    needMoney = 0;
    customerBalance = orderTotal;
  }
	//充值
  if (obj.ProductType=='CZ'){
    customerBalance=0;
    needMoney= price;
  }
  return {
    ProductType: 'V',
    ...obj,
    needMoney,
    payType,
    customerId:getUserId(),
    customerBalance,
    sessionId,
  }
}

//下单 请求调用微信支付所需参数
function wxpay(obj) {
	// h5页面暂时不支持支付功能呢
	//#ifdef H5
	 uni.showModal({
	 	title:'H5页面暂时不支持支付功能'
	 })
	 return false;
	//#endif
	 wx.hideLoading();
  //先调跟新用户余额防止其他平台变更余额导致余额不一致
  api.getUserInfo(true).then(res=>{
    let option = getOption(obj);
    let lastUrl = obj.orderId ?'MiniOrderGo':'MiniOrder';
    option.type=1;  //区分咨询师和普通用户 
		if(option.customerBalance){
			uni.showModal({
				 title:'消费提醒',
				 content:`当前账户余额为${option.customerBalance/100}元 ,购买时先扣所剩余额,还需付款${option.needMoney/100}元`,
				 cancelText:'在看看',
				 confirmText:'确认购买',
				 success(res) {
					 if(res.confirm){
						 paying(lastUrl,option);
					 }
				 }
			})
		}else{
			 paying(lastUrl,option);
		} 
  })
}

function paying(lastUrl,option){
	Ajax(`OrderHandle/${lastUrl}`, option).then(res => {
	    //调用微信支付
	  wxPaying(res.GetPrepayid, option)
	}).catch(res => {
	  wx.showToast({
	    title: res.MiniOrder,
	    icon: "none"
	  })
	})
}

//调用微信支付
function wxPaying(params, option,url){
  //余额支付情况
  if (option.needMoney == 0) {
    //更新用户余额
    api.getUserInfo(true);
    //跳转到下单页面
    wx.redirectTo({
      url: option.redirectUrl
    });
    return false;
  }
  // 余额小于订单总价情况
  let {
    appId,
    nonceStr,
    paySign,
    signType,
    prepay_id,
    timeStamp,
    orderId
  } = params;
  //调用微信支付
  wx.checkSession({
    success: () => {
      wx.requestPayment({
        appId,
        timeStamp,
        nonceStr,
        package: "prepay_id=" + prepay_id,
        signType,
        paySign,
        fail: function (aaa) {
          wx.showToast({
            title: '支付失败:' + aaa
          })
        },
        success: function () {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功'
          })
          //通知客户付款成功
          InitOrdersByPay({
            OrderId: orderId,
            sessionId: option.SessionId,
            Url: option.redirectUrl
          })
        }
      })
    },
    fail: () => {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
      reject('请求失败')
    }
  })
 
}

//付款成功后通知后台去通知客户付款成功
function InitOrdersByPay(obj) {
  Ajax('OrderHandle/InitOrdersByPay', obj).then(res => {
      //更新用户余额
      api.getUserInfo(true);
      wx.redirectTo({
        url: obj.Url
      });
  })

}

export default{
	wxpay
}
