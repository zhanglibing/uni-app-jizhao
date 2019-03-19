<template>
	<view class="page-box">
		<view class="center-box">
			<!-- 头部 -->
			<view class="header-box flex-row" v-if="userInfo">
				<view class="img-box">
					<image :src="userInfo.AvatarUrl"></image>
				</view>
				<view class="right">
					<block v-if="userInfo">
						<view class="name">{{ userInfo.RealName }}</view>
						<view class="gender">{{ userInfo.Gender == 'M' ? '男' : '女' }}</view>
					</block>
				</view>
				<navigator class="edit" url="/pages/userInfo/userInfo">编辑</navigator>
			</view>
			<view class="header-box flex-row" v-else="">
				<view class="img-box">
					<image :src="wxInfo.avatarUrl"></image>
				</view>
				<view class="right">
					<block>
						<view class="name">{{ wxInfo.nickName }}</view>
						<view class="gender">{{ userInfo.Gender == '1' ? '男' : '女' }}</view>
					</block>
				</view>
				<navigator class="edit" url="/pages/login/login">点击登录</navigator>
			</view>
			
			
			<view class="tab-box"  v-if="userInfo">
				<navigator url="/pages/money/money" class="item">
					<view class="img-box">
						<image src="/static/images/center/money.png"></image>
					</view>
					<text>账户余额</text>
					 <view>￥{{ userInfo.CustomerBalance }}</view>
				</navigator>
				<navigator url="/pages/order/order" class="item">
					<view class="img-box">
						<image src="/static/images/center/order.png"></image>
					</view>
					<text>咨询订单</text>
				</navigator>
				<navigator url="/pages/myCourse/index" class="item">
					<view class="img-box">
						<image src="/static/images/center/course.png"></image>
					</view>
					<text>课程订单</text>
				</navigator>
			</view>
			<view class="contain-box">
				<view class="list-box" v-for="(item,index) in list" :key=index>
					<view class="item" @tap="listTap(child)" v-for="(child,i) in item" :key="i">
						<view class="title-box">
							<image :src="child.img"></image>
							<text>{{child.title}}</text>
						</view>
						<image class="arrow" src="../../static/images/arrow.png"></image>
						<button v-if="child.type=='contact'" open-type="contact"></button>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import api from '../../api/user.js';
export default {
	data() {
		return {
			list:[
				[
					{
						title:'我的话题',url:'/pages/discussion/myTopic/myTopic',
						img:'../../static/images/center/topic.png',
						needLogin:true,
					},
					{
						title:'我的测试',url:'/pages/test/myTest/myTest',
						img:'../../static/images/center/test.png',
						needLogin:true,
					},
					{
						title:'我的收藏',url:'/pages/fm/collect/collect',
						img:'../../static/images/center/collect.png',
						needLogin:true,
					},
				],
				[
					{
						title:'联系我们',
						tel:'051269576237',
						img:'../../static/images/center/tel.png'
					},
					{
						title:'在线客服',
						type:'contact',
						img:'../../static/images/center/concat.png'
					},
					{
						title:'设置',url:'/pages/setting/setting',
						img:'../../static/images/center/setting.png'
					},
				],
				[
					{
						title:'专家入驻',url:'/pages/expertIn/expertIn',
						img:'../../static/images/center/expertin.png',
						needLogin:true,
					},
		
				]
			]
		};
	},
	onLoad() {
		uni.getProvider({
			service: 'share',
			success: function(res) {
				console.log(res);
				console.log(res.provider);
				if (~res.provider.indexOf('qq')) {
					uni.login({
						provider: 'qq',
						success: function(loginRes) {
							console.log(JSON.stringify(loginRes));
						}
					});
				}
			}
		});
	},
	onShow() {
		api.getUserInfo();
	},
	methods: {
		listTap(item){
			if(item.url){
				if(!item.needLogin||(this.userInfo&&item.needLogin)){
					uni.navigateTo({
						url:item.url
					})
				}else{
					uni.showModal({
						title: '提示',
						content: '还没登录账号，请前往登录',
						showCancel: true,
						confirmText: '前往登录',
						success: res => {
							if(res.confirm){
								uni.navigateTo({
									url: '../login/login',
								});
							}
						},
					});
				}
				
				return false;
			}
			if(item.tel){
				uni.makePhoneCall({
					phoneNumber:item.tel
				})
			}
		}
	},
	computed: mapState(['userInfo','wxInfo'])
};
</script>

<style lang="scss">
.page-box {
	background: #f2f2f2;
	padding: 0 30upx;
	box-sizing: border-box;
}
.header-box {
	background: #fff;
	border-radius: 20upx;
	padding: 50upx 26upx;
	box-sizing: border-box;
	margin-bottom: 30upx;
	position: relative;
	.edit {
		position: absolute;
		top: 20upx;
		right:0;
		color: #888;
		padding:10upx 30upx;
		font-size: 30upx;
	}
	.img-box {
		width: 166upx;
		height: 166upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 40upx;
	}
	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 60upx;
		.name {
			font-size: 40upx;
		}
		.gender {
			margin-top: 30upx;
			font-size: 30upx;
		}
		.submit-btn{
			width:200upx;
			height:60upx;
			font-size: 30upx;
		}
	}
}

.tab-box {
	border-radius: 20upx;
	margin-bottom: 30upx;
	background: #fff;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	padding: 30upx 20upx;
	.img-box {
		width: 56upx;
		height: 56upx;
		margin-bottom: 30upx;
	}
	.item {
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	  
		text{
			color:#9B9B9B;
		}
	}
}

.list-box{
	background: #fff;
	border-radius: 20upx;
	margin-bottom: 30upx;
	padding:0 30upx;
	.item{
		border-bottom: 1px solid #E5E5E5;
		line-height: 90upx;
		font-size: 32upx;
		color:#000;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: relative;
		&:last-child{
			border-bottom: none;
		}
		.title-box{
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 image{
			 	width:32upx;
			 	height:32upx;
			 	margin-right: 30upx;
			 }
		}
		
		.arrow{
			width:12upx;
			height:22upx;
		}
		button{
			position: absolute;
			left:0;
			top:0;
			width:100%;
			height:100%;
			background: transparent;
			&::after{
				border:none;
			}
		}
	}
}

</style>
