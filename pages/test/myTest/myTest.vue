<template>
	<view>
		<view class="list-box" v-if="list.length">
		  <view v-for="(item,index) in list" :key="index">
			<view class="main-box">
			  <view class="img-box">
				   <image :src="item.CustomerAnswer.imgUrl" ></image>
			  </view>
			  <view class="content">
				<view class="title textOver1">{{item.Title}}</view>
				<view>测试时间：{{item.CreateDate}}</view>
				<view class="result-msg textOver1"><view v-html="item.CustomerAnswer.resultMsg"></view></view>
			  </view>
			</view>
			<view class="btn-box">
			  <text>已完成</text>
			  <view class="btn1" @tap="goResult(item)">查看报告</view>
			</view>
		  </view>
		</view>
        <view class="nothing-box"  v-if="!list.length&&loadingType">
		  <view>不测不知道,测测更健康</view>
		  <navigator url="../test" class="goTest">测一个</navigator>
		</view>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import api from '../../../api/test.js'
	export default {
		data() {
			return {
				loadingType:0,
				total:0,
				page: 1,
				pageSize:8,
				list: []
			};
		},
		onShow() {
			this.page=1;
			this.loadingType=0;
			this.list=[];
			this.getList();
		},
		methods:{
			// 获取列表
			getList(){
			
				let option={
					page: this.page,pageSize:this.pageSize
				}
					console.log(option)
				api.getUserTestList(option).then(res=>{
					let {answers, TotalCount}=res;
					let data = this.list.concat(answers);
					this.list = data;
					this.total = TotalCount;
					this.loadingType = this.page * this.pageSize >= TotalCount ? 2 : 0;
				})
			},
			//查看报告
			goResult(item){
				let {Id, PsychtestId, Title, CustomerAnswer} = item;
				let type = '';
				if (Title == 'SCL-90 症状自测量表' || CustomerAnswer.Rules == 6) {
				  type = 'get'
				}
				uni.navigateTo({
					url:`../result/result?id=${PsychtestId}&PsychtestId=${Id}&type=${type}`
				})
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh() {
			this.onShow();
		},
		
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			this.page++;
			this.getList();
		}
		
	}
</script>

<style lang="scss" scoped="">

  .mytest {
    background: #eee;
  }

  .nothing-box {
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    view {
      font-size: 20px;
      margin-bottom: 30px;
    }
    .goTest {
      width: 120px;
      height: 36px;
      border-radius: 4px;
      text-align: center;
      line-height: 36px;
      background: #095289;
      color: #fff;
      font-size: 18px;
    }
  }

  .list-box {
    &>view {
      margin-bottom: 15px;
      background: #fff;
      padding: 15px 15px;
    }
    .main-box {
      display: flex;
      flex-direction: row;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
      .img-box {
        width: 200upx;
				height:150upx;
        margin-right: 10px;
				overflow: hidden;
        image {
          width: 100%;
					height:150upx;
        }
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
				justify-content: space-between;
        color: #999;
        .title {
          font-size: 14px;
          color: #2b2b2b;
          margin-bottom: 6px;
        }
        .time {
          font-size: 10px;
          margin-bottom: 4px;
        }
        .result-msg {
          font-size: 12px;
        }
      }
    }
    .btn-box {
      padding-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: #999;
      .btn1 {
        width: 80px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }
  }
</style>
