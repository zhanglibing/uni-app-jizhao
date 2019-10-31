<template>
	<view class="expertIn-box">
		<view class="en-title">NEED YOU</view>
		<view class="text">
			心理咨询是一种实践性很强的职业，我们为您提供了最专业、最广阔的提升与展示平台，以及完善的成长体系建设，让您在释放自身能量的同时，也可以实现自我完善。让我们一起用更优质的服务获取到更多的用户，用好互联网这个工具，推动心理咨询行业的发展和社会化普及并提升心理咨询师收益。
		</view>
		<view class="list">
			<view>自由的工作时间</view>
			<view>丰富的案例督导 </view>
			<view>丰厚的咨询报酬</view>
			<view>宝贵的成长机会</view>
		</view>
		<view class="block-btn" @tap="joinUs">
			JOIN US
		</view>
	<!-- 	<navigator
			target="miniProgram"
			open-type="navigate"
			app-id="wx49e55ff660f24bd6"
			:path="'pages/start/start'"
			extra-data="123456"
			version="develop"
		  >
			打开绑定的小程序
		  </navigator> -->
	</view>
</template>

<script>
	import api from '../../api/user.js'
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			joinUs(){
				//先判断是否登录
				if(!this.$isLogin()){return false;}
				//先更新用户信息
				api.getUserInfo().then(res=>{
					let status=res.StatusForConsultant;
					let path='./basic/basic'
					if(status==1){
						path='./background/background'
					}
					if(status==4){
						uni.showModal({
							content:'您已经是咨询师,确认前往咨询师小程序',
							confirmText:'确认前往',
							success(res) {
								if(res.confirm){
									uni.navigateToMiniProgram({
									  appId: 'wx49e55ff660f24bd6', // 要跳转的小程序的appid
									  path: 'pages/start/start', // 跳转的目标页面
									  extarData: {
										open: 'auth'
									  },
									  success(res) {
										// 打开成功  
									  }
								   }) 
								}
								
							}
						})
				
						return false;
					}
					if(status>=2){
						path='./audit/audit'
					}
					uni.navigateTo({
						url:path
					})
				});
				
			}
		}
	}
</script>

<style lang="scss">
.expertIn-box{
	height:calc(100vh);
	box-sizing: border-box;
	padding:100upx 50upx;
	color:#fff;
	background: url('https://back.jizhaojk.com/content/images/WeChat/needyou_pic.png') center no-repeat;
	.en-title{
		color:#fff;
		text-align: center;
		font-size: 70upx;
		margin-bottom: 60upx;
	}
	.text{
		color:#fff;
		font-size: 12px;
		line-height: 46upx;
		margin-bottom: 50upx;
	}
	.list{
		 margin-bottom: 50upx;
		  view{
			  text-align: center;
			  line-height: 100upx;
			  font-weight: bold;
			  font-size: 16px;
			 
		  }
	}
	.block-btn{
		background: #fff;
		color:#000;
		height:86upx;
		width:320upx;
	}
}

</style>
