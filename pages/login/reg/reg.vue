<template>
	<view class='login-box'>
		<view class="row">
			<view class="title">账号</view>
			<input v-model="option.Username" @blur="blur" :maxlength="11" type='number' placeholder='请输入账号'></input>
		</view>
		<view class="row sms">
			<view class="title">短信验证码</view>
			<view class="sms-box">
				<input v-model="option.VerificationCode" type='number' placeholder='请输入验证码'></input>
				<view class="submit-btn" :class="{disabled:option.Username.length<11}" v-if="count==60" @tap="send">获取验证码</view>
				<view class="submit-btn disabled-btn" v-else>重发({{count}}s)</view>
			</view>
		</view>
		<view class="row">
			<view class="title">设置密码</view>
			<input v-model="option.Password" password="true" placeholder='请输入密码'></input>
		</view>
		<view class="row">
			<view class="title">确认密码</view>
			<input v-model="option.repsd" password="true" placeholder='请输入确认密码'></input>
		</view>
		<navigator url="../../regAgreement/regAgreement" class="seting-box flex-row">
			注册及同意“幸福谋方用户协议“
		</navigator>
		<view @tap="submitPsdChange" :class="{disabled:!canSubmit}" class="block-btn">确认提交</view>
	</view>
</template>

<script>
	import {sendSms,reg,phoneIsReg} from '../../../api/login.js'
	
	export default {
		data() {
			return {
				userNameIsReg: false, //判断用户是否已经注册
				option:{
					Password:'',
					Username:'',
					repsd:'',
					VerificationCode:'',
					NickName:''
				},
				isReg:true,
				count: 60, //倒计时
			};
		},
		onShow() {
			this.option.NickName=this.$store.state.wxInfo.nickName;
		},
		methods:{
			 //确认找回密码
			submitPsdChange(){
				if(!this.canSubmit){
					return false;
				}
				if (!this.checkPsdAndCode()) {
				  return false
				}
				reg(this.option).then(res => {
					uni.showToast({
						icon:"success",
						title:'注册成功'
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:'../login?type=noBack'
						})
					},1000)
				}).catch(res=>{
					this.msg(res)
				})
			},
		    //发送短信验证码
			send(){
				if(!this.isReg){
					this.msg("该手机已经注册");
					return false;
				}
				let {Username}=this.option;
				let option = {
				  tel: Username,
				  Frompage: "注册",
				}	
				if(Username.length<11){
					uni.showToast({
						icon:"none",
						title:"请输入正确的手机号"
					})
					return false;
				}
				sendSms(option).then(res=>{
					uni.showToast({
						icon:"none",
						title:"短信发送成功"
					})
					this.count = 59;
					this.setTime();
				})
			},
		    //验证手机号是否已经注册
		    blur(){
		    	if(this.option.Username<11){
		    		return false;
		    	}
		    	phoneIsReg(this.option.Username).then(res=>{
		    		this.isReg=res;
		    		if(!res){
		    			this.msg("该手机已经注册");
		    		}
		    		
		    	})
		    },
			 //设置倒计时
			setTime(){
				let a = 0;
				let t = setInterval(() => {
				  this.count--;
				  if (this.count == 0) {
					clearInterval(t)
				  }
				}, 1000)
			},
		    //验证
			checkPsdAndCode(){
				if(this.isReg){
					this.msg("该手机已经注册");
					return false;
				}
				let {
					Password,
					Username,
					repsd,
					VerificationCode
				}=this.option;
				if (!VerificationCode) {
				  this.msg("短信验证码不能为空");
				  return false;
				}
				if (!Password) {
				  this.msg("密码不能为空");
				  return false;
				}
				if (Password.length < 6) {
				  this.msg("密码长度至少为6位");
				  return false;
				}
				if (!repsd) {
				  this.msg("确认密码不能为空");
				  return false;
				}
				if (repsd != Password) {
				  this.msg("两次密码输入不一致");
				  return false;
				}
				return true;
			},
			//提示语
			msg(msg){
				uni.showToast({
					icon:"none",
					title:msg
				})
			}
		},
		computed:{
			canSubmit(){
				let {
					Password,
					Username,
					repsd,
					VerificationCode
				}=this.option;
				return Username&&Password&&repsd&&VerificationCode;
			}
		}
	}
</script>

<style lang="scss" scoped="">
	.login-box {
		padding: 30upx 40upx;
		box-sizing: border-box;
	}
	.row{
		margin-bottom: 40upx;
		.title{
			margin-bottom: 15upx;
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
    .sms-box{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		input{
			flex: 1;
		}
		.submit-btn{
			width:220upx;
			margin-left: 30upx;
			line-height: 100upx;
			&.disabled-btn{
				background: #DADADA;
				color:#fff;
			}
		}
		
	}
	.block-btn{
		width:100%;
		height:100upx;
		line-height: 100upx;
	}
	
	.seting-box{
		margin-bottom: 30upx;
	}
</style>
