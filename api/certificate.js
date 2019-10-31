import {Ajax} from './ajax.js'

//获取列表
function getList(option) {
  return new Promise((resolve,reject) => {
    Ajax('Certificate/GetList', option).then(res => {
      let {Code, GetList} = res;
      if (Code == 200) {
        resolve(GetList);
        return false;
      }
      reject('error')
    })
  })
}



export default {
  getList,
}
