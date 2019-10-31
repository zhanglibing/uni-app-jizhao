<template>
	<view class='login-box'>
		<view class="row">
			<view class="title">账号</view>
			<input v-model="option.Username" :maxlength="11"  type='number' placeholder='请输入账号'></input>
		</view>
		<view class="row">
			<view class="title">密码</view>
			<input v-model="option.Password" password="true" placeholder='请输入密码'></input>
		</view>
		<view class="seting-box flex-row">
			<navigator url="reg/reg">没有账号，立即注册</navigator>
			<navigator url="fogrotPsd/fogrotPsd">忘记密码</navigator>
		</view>
		<view @tap="submit" class="block-btn">登录</view>
	</view>

</template>

<script>
	import api from '../../api/user.js'
	
	export default {
		data() {
			return {
				option:{
					Password:'',
					Username:''
				},
				isBack:true,
				
				
			};
		},
		onLoad(option){
			console.log(this.$store.state.unionid)
			//从注册和忘记密码过来的情况  登录成功要直接指定到首页 不能后退
			if(option.type=='noBack'){
				this.isBack=false;
			}
		},
		methods:{
			//登录
			submit() {
				let unionid=this.$store.state.unionid;
// 				console.log('获取uid')
// 				console.log(unionid)
				if(unionid){
					this.option.unionid=unionid;
				}
				let {
					Username,
					Password,
				}=this.option;
				if (!Username) {
					return this.$msg.error('手机号不能为空')
				}
				if (!Password) {
					return this.$msg.error('密码不能为空')
				}
				
					
				api.login(this.option).then(res => {
					let pages = getCurrentPages();
					this.$store.commit('setUserInfo',res);
					if(pages.length>1&&this.isBack){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.switchTab({
							url: '../index/index',
						});
					}
					
				}).catch(res=>{
					this.$msg.error(res.customer)
				})
			}
		},
				//转发话术
		onShareAppMessage(res) {
			
		},
	}
</script>

<style lang="scss" scoped="">
	.login-box {
		padding: 30upx 40upx;
		box-sizing: border-box;
		height:calc(100vh);
		background: url('https://back.jizhaojk.com/content/images/WeChat/login-bg.png') center no-repeat;
		background-size: 100% 100%;
	}
	.row{
		margin-bottom: 40upx;
		.title{
			margin-bottom: 20upx;
			font-size: 30upx;
		} 
		input {
			border: 1px solid #ccc;
			background: #fff;
			height: 100upx;
			padding-left: 20upx;
			border-radius: 10upx;
		}
	}
    .seting-box{
		justify-content: space-between;
		color:#666;
		margin-bottom: 100upx;
		view{
		  padding:10upx 0;	
		}
	}
	.block-btn{
		width:100%;
		height:100upx;
		line-height: 100upx;
	}
</style>
