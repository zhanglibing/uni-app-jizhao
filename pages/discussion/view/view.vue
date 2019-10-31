<template>
	<view class="topic-view-box">
		<view class="info-box">
			<view class="title">{{ info.Subject }}</view>
			<view class="user flex-row">
				<view class="time">{{ info.CreatedOnUtc }}</view>
				<view>{{ info.Customer.RealName }}</view>
			</view>
			<view class="img-box1">
				<picture-com :imgUrl="info.pictureUrl" :maxWidth="650"></picture-com>
			</view>
			<view class="Details" v-html="info.Details"></view>
		</view>
		<view class="comment-title">评论区</view>
		<view class="comment-list">
			<block v-if="info.ForumPosts.length">
				<view
					class="item-box flex-row"
					v-for="(item, index) in info.ForumPosts"
					:key="index"
				>
					<view class="avatar-box"><image :src="item.AvatarUrl"></image></view>
					<view class="content">
						<view class="user-name">
							<view class="name">{{ item.ForumPost.Customer.NickName }}</view>
							<view class="time">{{ item.ForumPost.CreatedOnUtc }}</view>
						</view>
						<view class="desc">
							<rich-text :nodes="item.ForumPost.Text"></rich-text>
						</view>
						<!--别人的回复  -->
						<view
							class="other-box flex-row"
							v-for="(items, i) in item.ForumPostPostHandleModels"
							:key="i"
						>
							<view class="avatar-box"><image :src="items.AvatarUrl"></image></view>
							<view class="content">
								<view class="user-name">
									<view class="name">
										{{ items.ForumPostPost.Customer.NickName }}
									</view>
									<view class="time">{{ items.ForumPostPost.CreatedOnUtc }}</view>
								</view>
								<view class="desc">
									<rich-text :nodes="items.ForumPostPost.Text"></rich-text>
								</view>
							</view>
						</view>
						<view class="reply-other flex-row">
							<text></text>
							<view
								class="submit-btn btn"
								:data-id="item.ForumPost.Id"
								@tap="goReplyOther"
							>
								回复
							</view>
						</view>
					</view>
				</view>
			</block>
			<view v-else="">暂无评论</view>
		</view>
		<view class="submit-btn bottom-btn" @tap="goReply">回复帖子</view>
	</view>
</template>

<script>
import api from '../../../api/article.js';
export default {
	data() {
		return {
			id: '',
			info: null
		};
	},
	onLoad(options) {
		this.id = options.id;
	},
	onShow() {
		uni.showLoading({
			title: '加载中...'
		});
		api.getTopicView(this.id).then(res => {
			wx.hideLoading();
			this.info = res;
		});
	},
	methods: {
		goReply() {
			uni.navigateTo({
				url: '/pages/discussion/reply/reply?TopicId=' + this.id
			});
		},
		goReplyOther(e) {
			uni.navigateTo({
				url: `/pages/discussion/reply/reply?TopicId=${this.id}&PostId=${
					e.currentTarget.dataset.id
				}`
			});
		},
				//转发话术
		onShareAppMessage(res) {
			
		},
	}
};
</script>

<style lang="scss" scoped="scoped">
.topic-view-box {
	padding-bottom: 120upx;
	.page {
		padding: 30rpx 30rpx 120rpx 30rpx;
		background: rgba(245, 245, 245, 1);
		box-sizing: border-box;
	}

	.info-box,
	.comment-list {
		background: #fff;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		margin-bottom: 30rpx;
	}

	.info-box {
		.Details {
			font-size: 14px;
			line-height: 50upx;
			color: #444;
		}
		.title {
			font-size: 18px;
			margin-bottom: 30rpx;
		}
	}

	.user {
		margin-bottom: 30rpx;
		color: #666;
		.time {
			margin-right: 60upx;
		}
	}

	.avatar-box {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 40rpx;
		background: #000;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.img-box1 {
		width: 100%;
		margin-bottom: 30upx;
	}

	.comment-title {
		font-size: 16px;
		margin: 0 0 30rpx;
		font-weight: bold;
		padding: 0 30upx;
	}

	.btn-box {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100rpx;
		width: 100%;
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.reply-btn {
		width: 300rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		text-align: center;
		background: #000;
		color: #fff;
		font-size: 30rpx;
		letter-spacing: 5rpx;
	}

	.item-box {
		font-size: 12px;
		margin-bottom: 30rpx;
		padding-bottom: 30rpx;
		border-bottom: 1px solid #e5e5e5;
		.time {
			color: rgba(155, 155, 155, 1);
			font-size: 10px;
		}
		.user-name {
			margin-bottom: 20rpx;
		}
		.content {
			flex: 1;
			margin-bottom: 10rpx;
			color: #666;
		}
		.other-box {
			padding-top: 30rpx;
		}
	}

	.item-box:last-child {
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}
	.other-box {
		background: rgba(245, 245, 245, 1);
		border-radius: 8upx;
		padding: 10upx 20upx;
		margin-top: 30upx;
	}
	.reply-other {
		padding-top: 20rpx;
		justify-content: space-between;
		text-align: right;
		.btn {
			width: 120rpx;
			height: 60upx;
			text-align: center;
			line-height: 60upx;
		}
	}
}
.bottom-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	border-radius: 0;
}
</style>
