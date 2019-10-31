<template>
	<view class="page">
		<view class='title'>{{info.Title}}</view>
		<view class='publish flex-row'>
			<view>发表于：{{info.CreatedOnUtc}}</view>
			<view>阅读数：{{info.Views}}</view>
		</view>
		<view class='img-box'>
			<image :src="info.PictureUrl" mode="widthFix"></image>
		</view>
		<view class='desc' v-html="info.Body">

		</view>
		<view class="btn-view" @tap="goExpert">找 Ta 咨询</view>
	</view>
</template>

<script>
	import api from '../../../api/article.js'
	export default {
		data() {
			return {
				info: {},
				userId:''
			};
		},
		onLoad(options) {
			let {id,userId}=options;
			this.userId=userId;
			api.getArticleView(id).then(res => {
				this.info= res
			})
		},
		methods:{
			goExpert(){
				uni.navigateTo({
					url:'/pages/experts/view/view?id='+this.userId
				})
			}
		},
				//转发话术
		onShareAppMessage(res) {
			
		},
	}
</script>

<style lang="scss" scoped="">
	.page {
		padding: 30upx;
		padding-bottom: 120upx;
		box-sizing: border-box;
		background: #fff;
	}

	.title {
		font-size: 36upx;
		margin-bottom: 30upx;
	}

	.publish {
		font-size: 12px;
		margin-bottom: 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color:#666;
	}

	.img-box {
		width: 100%;
		margin-bottom: 30upx;
	}
	.desc{
		font-size: 32upx;
		line-height: 60upx;
	}
	.btn-view{
		position: fixed;
		bottom:0;
		left:0;
		width:100%;
		height:110upx;
		line-height: 110upx;
		text-align: center;
		background: #F5A623;
		color:#fff;
	}
</style>
