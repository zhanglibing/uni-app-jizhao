/** 2018/10/15
 *author:zhanglibing
 *email:1053081179@qq.com
 *功能: 测试题计算规则
 */

function filterLen(arr, type) {
  return arr.filter(val => val == type).length;
}

//获取分组合得分 均分 、总分
function getZuheScore(info, results, isAll = false) {  //isAll 是否指定求总数
  let {SubjectModels, Formulas1} = info;
  let qids = JSON.parse(Formulas1);  //题目组合
  let obj = {};  //存放组合以及对应的分数 (组合名称作为key   val为总分或者平均数)
  qids.forEach(val => {
    let qid = val.qid.split('-'); //组合对应的所有题目
    qid = qid.map(v => v * 1);
    let resultNum = 0; //得分总和
    SubjectModels.forEach((v, index) => {
      let key = index + 1;
      if (qid.indexOf(key) != -1) {
        resultNum += v.PsychtestSubjectAnswers.filter(v1 => v1.Id == results[key])[0].Score * 1;
      }
    })
    if (val.operation == 1 && !isAll) {  //求平均数
      resultNum = (resultNum / qid.length).toFixed(2)
    }
    obj[val.qidName] = resultNum;
  })
  return obj;
}


//数组对象倒序排序
function compare(prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  }
}


function getResults(info, results) {
  // let {SubjectModels, Rules, PsychtestAnswers, Formulas1, Formulas2} = info;
  let {Rules} = info;
  //得分规则
  if (Rules == 0) {
    let {SubjectModels, PsychtestAnswers} = info;
    let resultNum = 0; //得分总和
    SubjectModels.forEach((val, index) => {
      let key = index + 1;
      let score = val.PsychtestSubjectAnswers.filter(v => v.Id == results[key])[0].Score * 1;
      resultNum += score;
    })
    return PsychtestAnswers.filter(val => resultNum >= val.ScoreStart && resultNum <= val.ScoreEnd)[0].FinalAnswer;
  }
  //字母得分 对比   组合结果
  else if (Rules == 1) {
    let {SubjectModels, PsychtestAnswers, Formulas1} = info;
    let result = [];
    SubjectModels.forEach((val, index) => {
      let key = index + 1;
      let score = val.PsychtestSubjectAnswers.filter(v => v.Id == results[key])[0].Score;
      if (score) {
        result.push(score)
      }
    })
    //Formulas1='I-E|N-S|F-T|P-J'
    let str = '';
    Formulas1.split('|').forEach(val => {
      let arr = val.split('-');
      str += filterLen(result, arr[0]) >= filterLen(result, arr[1]) ? arr[0] : arr[1];
    })
    let msg = ''
    PsychtestAnswers.forEach(val => {
      if (val.ScoreStart == str) {
        msg = val.FinalAnswer;
      }
    })
    return msg;
  }
  //字母组合得分比较得分大小
  else if (Rules == 2) {
    let {SubjectModels, PsychtestAnswers, Formulas2} = info;
    let result = [];
    SubjectModels.forEach((val, index) => {
      let key = index + 1;
      let score = val.PsychtestSubjectAnswers.filter(v => v.Id == results[key])[0].Score;
      if (score) {
        result.push(score)
      }
    })
    let arr = Formulas2.split('|');
    arr = Array.from(new Set(arr)) //数组去重
    let newArr = []
    arr.forEach(val => {
      newArr.push(result.filter(v => v == val).length);
    })
    let maxIndex = newArr.indexOf(Math.max.apply(Math, newArr)); //数组中最大值的索引
    let str = arr[maxIndex]; //得分最大值字母
    let msg = '';
    PsychtestAnswers.forEach(val => {
      if (val.ScoreStart == str) {
        msg = val.FinalAnswer;
      }
    })
    return msg;
  }
  //分组积分，附加条件,满足条件对应结果
  else if (Rules == 3) {
    let {SubjectModels, PsychtestAnswers, Formulas1, Formulas2} = info;
    let tiaojian = JSON.parse(Formulas2); //条件
    let obj = getZuheScore(info, results);  //存放组合以及对应的分数 (组合名称作为key   val为总分或者平均数)

    let resultIndex = 0; //符合条件对应结果
    tiaojian.forEach((val, index) => {
      let flag = val.every(v => {
        let {qidName, operation, val} = v;
        val = val * 1;
        if (operation == 1) {
          return obj[qidName] > val;
        }
        if (operation == 2) {
          return obj[qidName] < val;
        }
        if (operation == 3) {
          return obj[qidName] >= val;
        }
        if (operation == 4) {
          return obj[qidName] <= val;
        }
        if (operation == 5) {
          return obj[qidName] == val;
        }

      })
      if (flag) {
        resultIndex = index;
      }
    })
    return PsychtestAnswers[resultIndex].FinalAnswer;
  }
  //分组积分，分组积分嵌套公式得到结果值,对应结果值比较大小
  else if (Rules == 4) {  //組合4的時候
    let {SubjectModels, PsychtestAnswers, Formulas1, Formulas2} = info;
    let res = JSON.parse(Formulas2); //结果公式
    let obj = getZuheScore(info, results);  //存放组合以及对应的分数 (组合名称作为key   val为总分或者平均数)
    let arr = []; //存放
    res.forEach((val, index) => {
      let total = 0;
      val.forEach(v => {
        let {qidName, operation, val, type} = v;
        val = val * 1;
        //type=='fenzu' 时为分组总计分与数值做运算   type:num  时 为纯数字运算
        let zuhe = type == 'fenzu' ? obj[qidName] * 1 : 1;
        if (operation == 1) {
          total += zuhe + val;
        }
        if (operation == 2) {
          total += zuhe - val;
        }
        if (operation == 3) {
          total += zuhe * val;
        }
        if (operation == 4) {
          return zuhe / val;
        }
      })
      arr.push(total)
    })
    let maxIndex = arr.indexOf(Math.max.apply(Math, arr)); //数组中最大值的索引
    return PsychtestAnswers[maxIndex].FinalAnswer;
  }
  //分组积分，比较多少，前几位组合对应组合结果
  else if (Rules == 5) {
    let {PsychtestAnswers, Formulas2} = info;
    let res = JSON.parse(Formulas2); //几位组合
    let obj = getZuheScore(info, results);  //存放组合以及对应的分数 (组合名称作为key   val为总分或者平均数)
    let arr = [];
    Object.keys(obj).forEach(val => {
      arr.push({name: val, score: obj[val]})
    })
    //数组对象排序
    arr.sort(compare('score'));
    let str = '';
    arr.forEach((val, index) => {
      if (index < res) {
        str += val.name;
      }
    })
    let msg = '';
    PsychtestAnswers.forEach(val => {
      if (val.ScoreStart == str) {
        msg = val.FinalAnswer;
      }
    })
    msg = msg ? msg : PsychtestAnswers[0].FinalAnswer;  //如果找不到返回第一条 结果
    return msg;
  }
  //分组积分，SCL-90 症状自测量表专用
  else if (Rules == 6) { //SCL-90 症状自测量表  专用
    let {PsychtestAnswers, Formulas2, Formulas3, Formulas, SubjectModels} = info;
    let res = JSON.parse(Formulas2); //因子对应区间 严重程度 严重星级
    let obj = getZuheScore(info, results);  //存放分组均分
    let obj2 = getZuheScore(info, results, true);  //指定求分组总数
    let obj3 = {...obj} //用于存放各因子 严重程度  星级
    res.forEach(val => {
      //求得分区间
      let junfen = obj[val.qidName];
      val.arr.forEach((v, i) => {
        if (junfen >= v.start * 1 && junfen <= v.end * 1) {
          obj3[val.qidName] = {
            degree: i,  //星级
            degreeText: v.degree, //严重等级
          }
        }
      })
    })
    //求个因子均分和总分以及对应值得严重程度  yinziArr
    let yinziArr = [];
    let yinzi = Object.keys(obj);
    yinzi.forEach(val => {
      yinziArr.push({
        name: val,
        TotalScore: obj2[val],
        divide: obj[val],
        ...obj3[val]
      })
    })

    //求总分
    let TotalScore = Object.values(obj2).reduce(function (prev, curr, idx, arr) {
      return prev + curr;
    });
    //总症状指数
    let TotalSymptomIndex = (TotalScore / 90).toFixed(2);
    let totalDegree = JSON.parse(Formulas);
    let degree = '';
    totalDegree.forEach(val => {
      if (val.start * 1 <= TotalSymptomIndex && TotalSymptomIndex <= val.end * 1) {
        degree = val.degree;
      }
    })
    //阴性项目数表示被试“无症状”的项目有多少。
    let yingxing = 0;
    SubjectModels.forEach((val, index) => {
      let key = index + 1;
      let score = val.PsychtestSubjectAnswers.filter(v => v.Id == results[key])[0].Score * 1;
      if (score == 1) {  //无症状
        yingxing += 1
      }
    })

    //阳性症状指数
    let PositiveSymptomIndex = (TotalScore / (90 - yingxing)).toFixed(2);


    let result = [];
    // yinziArr.forEach(val => {
    //   if (val.degree) {
        PsychtestAnswers.forEach(v => {
          result.push(v);  //暂时全部展示
          // if (v.ScoreStart == val.name) {
          //   result.push(v);
          // }
        })
    //   }
    // })

    let zong = JSON.parse(Formulas3);
    zong[0].score = TotalScore;
    zong[1].score = TotalSymptomIndex;
    zong[2].score = 90 - yingxing;
    zong[3].score = yingxing;
    zong[4].score = PositiveSymptomIndex;
    //综合项
    let zonghe = {
      zong,
      degree,
      yinziArr,
      result
    }

    return zonghe
  }
  //分组积分，分组区间对应结果，展示分组对应结果整合结果
  else if(Rules == 7){
    let {PsychtestAnswers, Formulas2, SubjectModels} = info;
    let res = JSON.parse(Formulas2); //分子对应区间 对应结果
    let obj = getZuheScore(info, results);  //存放组合以及对应的分数 (组合名称作为key   val为总分或者平均数)
    console.log(obj)
    let msg='';
    res.forEach(val => {
      //求得分区间
      let junfen = obj[val.qidName];
      val.arr.forEach((v, i) => {
        if (junfen >= v.start * 1 && junfen <= v.end * 1) {
          msg+=`${v.degree} <br>`
        }
      })
    })
    return msg;
  }
  //分组积分，得分排序展示结果
  else{
    let {Formulas2} = info;
    let res = JSON.parse(Formulas2); //分子对应区间 对应结果
    let resultObj={};  //组合名称为key   组合对应结果为value
    res.forEach(val=>{
      resultObj[val.qidName]=val.result;
    })
    let obj = getZuheScore(info, results);  //存放组合以及对应的分数 (组合名称作为key   val为总分或者平均数)
    let arr = [];
    Object.keys(obj).forEach(val => {
      arr.push({name: val, score: parseFloat(obj[val])})
    })
    //数组对象排序
    arr.sort(compare('score'));
    let msg='';
    arr.forEach(val=>{
      msg+=`${resultObj[val.name]}</br>`
    })
    return msg;
  }

}


//比较运算符

// {name: '大于', type: 1},
// {name: '小于', type: 2},
// {name: '大于等于', type: 3},
// {name: '小于等于', type: 4},
// {name: '等于', type: 5},

//算法
// {name: '加', type: 1},
// {name: '减', type: 2},
// {name: '乘', type: 3},
// {name: '除', type: 4},

export {
  getResults
}
