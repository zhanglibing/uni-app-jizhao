import {Ajax,getUserId} from './ajax.js'
//获取当前年月日 星期
function getTime() {
  var myDate = new Date();
  var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
  var month = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
  var day = myDate.getDate();        //获取当前日(1-31)
  var seven = myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
  var h = myDate.getHours();
  var s = myDate.getMinutes();
  var m = myDate.getSeconds();
  month = (month < 10) ? ("0" + month) : month;
  day = (day < 10) ? ("0" + day) : day;
  h = (h < 10) ? ("0" + h) : h;
  s = (s < 10) ? ("0" + s) : s;
  m = (m < 10) ? ("0" + m) : m;
  return year + '-' + month + '-' + day + '- ' + h + ":" + s;
}
//获取咨询订单列表
async function getList(params) {
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/GetCustomerOrderList', {
      customerId:getUserId(),
      orderStatus: '',
      ...params
    }).then(res => {
      resolve(res.GetCustomerOrderList)
    })
  })
}

//获取课程订单列表
async function getCourseList(params) {
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/GetConsultantOrderList', {
      customerId:getUserId(),
      ProductType: 'V',
      ...params
    }).then(res => {
      resolve(res.GetConsultantOrderList)
    })
  })
}


// 获取子订单
async function getOrderChild(orderId) {
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/GetOrderItems_ById', { orderId }).then(res => {
        resolve(res.GetOrderItems_ById)
    })
  })
}


// 获取订单详情
async function getDetailsById(orderId) {
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/Get_ById', { orderId}).then(res => {
      resolve(res.Get_ById)
    })
  })
}

// 获取订单评价
async function getOrderComment(orderId) {
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/ListComments', { orderId }).then(res => {
     resolve(res.ListComments)

    })
  })
}



// 获取随笔记录

 //关闭订单、取消订单
async function closedOrder(orderId) {
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/ClosedOrder', {orderId}).then(res => {
      resolve('ok')
    })
  })
}

//课程评价
async function courseEvalute(params) {
  let option={
    CustomerId: getUserId(),
    ...params
  }
  return new Promise((resolve, reject) => {
    Ajax('CurriculumHandle/CreateComment', option).then(res => {
        resolve('ok')
    })
  })
}

//咨询订单评价
async function orderEvalute(params) {
  let option={
    CustomerId: getUserId(),
    ...params
  }
  return new Promise((resolve, reject) => {
    Ajax('OrderHandle/CreaterComment', option).then(res => {
        resolve('ok')
    })
  })
}

async function getEssaysRecord(orderId) {
  let option = {
    Page:1,
    PageSize:1000,
    orderId
  }
  return new Promise((resolve, reject) => {
    Ajax('/OrderHandle/GetOrderEssaysRecords_ByOrderId', option).then(res => {
        resolve(res.GetOrderEssaysRecords_ByOrderId)
    })
  })
}

export default {
  getList,
  getOrderChild,
  getDetailsById,
  getOrderComment,
  getCourseList,
  closedOrder,
  courseEvalute,
	orderEvalute,
  getEssaysRecord,
	getTime

}