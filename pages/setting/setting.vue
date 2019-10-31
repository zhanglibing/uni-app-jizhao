<template>
	<view class="seting-box">
		<view class="item">
			<text>清除缓存</text>
			<image class="arrow" src="../../static/images/arrow.png" mode="widthFix"></image>
		</view>
		<navigator url="/pages/about/about" class="item">
			<text>关于幸福谋方</text>
			<image class="arrow" src="../../static/images/arrow.png" mode="widthFix"></image>
		</navigator>
		<view class="btn-logout" @tap="logOut">退出当前账号</view>
	</view>
</template>

<script>
import {logOut} from '../../api/login.js';

export default {
	data() {
		return {};
	},
	methods:{
		//切换账号
		logOut(){
		
			logOut();
			this.$store.commit('setUserInfo','')
		}
		
	}
};
</script>

<style lang="scss" scoped="">
.seting-box {
	.item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		line-height: 100upx;
		padding:0 40upx;
		margin-bottom: 20upx;
		color:#666;
		font-size: 16px;
		image {
			width:12upx;
			height:22upx;
		}
	}
}
.btn-logout {
	width: 642upx;
	height: 82upx;
	margin: 100upx auto 0;
	text-align: center;
	line-height: 82upx;
	background: rgba(255, 255, 255, 1);
	border-radius: 10upx;
	border: 1px solid rgba(151, 151, 151, 1);
	color: #666;
	font-size: 32upx;
}
</style>
