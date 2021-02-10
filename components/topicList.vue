<template>
	<view>
		<view @tap="goView(item.Id)" class='item flex-row' v-for="(item,index) in data" :key="index">
			<view class='avatar-box'>
				<image :src="item.AvatarUrl"  mode="aspectFill"></image>
			</view>
			<view class='content'>
				<view class='auther'>
					<!-- <view>{{item.Customer.RealName}}</view> -->
					<view>{{item.CreatedOnUtc}}</view>
					
				</view>
				<view class='title textOver2'>{{item.Subject}}</view>
				<view class='desc  textOver3'>{{item.Details}}</view>
				<view class='img-box'>
					<image :src="item.pictureUrl"></image>
				</view>
				<view class='btn-box flex-row'>
					<view>
						阅读数：{{item.Views}}
					</view>
					<view>
						评论数：{{item.NumPosts}}
					</view>
				</view>
				<view class="status-box" v-if="isShow">审核状态: {{item.flag?'审核通过':'审核中'}}</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		// props: ['data','isShow’],
		props:{
			data:{
				type:Array,
				default:()=>{
					return [];
				}
			},
			isShow:{
				type:Boolean,
				default:false
			}
		},
		methods: {
			goView(id) {
				uni.navigateTo({
					url: '/pages/discussion/view/view?id=' + id
				});
			},
			
		}
	};
</script>

<style lang="scss" scoped="scoped">
	.img-box image {
		width: 100%;
		height: 100%;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.item {
		background: #fff;
		padding: 40rpx;
		margin-bottom: 30rpx;

	}

	.avatar-box {
		width: 60rpx;
		height: 60rpx;
		margin-right: 30rpx;
		background: #000;
		border-radius: 50%;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.item .content {
		flex: 1;
	}

	.auther {
		font-size: 12px;
		margin-bottom: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.title {
		font-size: 16px;
		margin-bottom: 30rpx;
	}

	.desc {
		font-size: 12px;
		line-height: 36rpx;
		margin-bottom: 30rpx;
		color: #666;
	}

	.img-box {
		width: 120rpx;
		height: 80rpx;
		background: #000;
		margin-bottom: 30rpx;
	}

	.btn-box {
		font-size: 10px;
		color: rgba(159, 159, 159, 1);
	}

	.btn-box>view {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-right: 20rpx;
		color: #000;
		font-size: 10px;
	}
	.status-box{
		padding-top: 20upx;
		font-size: 14px;
		color:#666;
	}

	.textOver1 {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 1;
	}

	.textOver2 {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 2;
	}

	.textOver3 {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		/*! autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 3;
	}
</style>
