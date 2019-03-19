<template>
	<view class="testView">
			<view class="title">{{ info.Title }}</view>
			<view class="pass">{{ info.TestQuantity }} 人已测试</view>
			<view class="img-box"> <image :src="info.BannerPictureUrl" mode="widthFix"></image> </view>
			<view> <rich-text :nodes="info.Description" /> </view>
			<view class="start-btn"  @tap="goTesting">立即测试</view>
	</view>
</template>

<script>
	import api from '../../../api/test.js';
export default {
	data() {
		return {
			 info:{},
		};
	},
	  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取测试题详情 
    api.getTestDetails(options.id).then(res=>{
      this.info=res;
    })
  },
  methods:{
	    //开始测试
  goTesting(){
		if(!this.$isLogin()){return false;}
    wx.navigateTo({
      url: `../testing/testing?id=${this.info.Id}`,
    })
  },
  }
};
</script>

	
<style lang="scss">
page{
	background: #fff;
	padding:50upx 40upx 100upx;
	box-sizing: border-box;
}

.title {
  font-size: 20px;
  width: 500rpx;
  margin: 0 auto;
  text-align: center;
  font-weight: 700;
  line-height: 36px;
}

.pass {
  color: rgb(153, 153, 153);
  text-align: center;
  margin: 16px 0;
}

.img-box {
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
}

.img-box  img {
  width: 100%;
}
.submit-btn{
	height:80upx;
	line-height: 80upx;
}

.start-btn{
	position: fixed;
	bottom:0;
	left:0;
	width:100%;
	color:#fff;
	height:100upx;
	text-align: center;
	line-height: 100upx;
	background: #F5A623;
	font-size: 36upx;
	}
</style>
