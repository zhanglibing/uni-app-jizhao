<template>
	<view class="page">
		<!-- 头部 -->
		<view class="banner-box">
			<navigator url="../search/search" class="search-box">
				<icon type="search" size="16"></icon>搜索话题或专家姓名
			</navigator>
			<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :circular="true" indicator-active-color="#fff" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500">
							<swiper-item>
								<navigator open-type="switchTab" url="../experts/experts">
									<image :src="bannerl" mode=""></image>
								</navigator>
							</swiper-item>
							<swiper-item>
								<navigator  url="../test/test">
									<image :src="banner2" mode=""></image>
								</navigator>
							</swiper-item>
						</swiper>
					</view>
				</view>
			
		</view>

		<view class="icon-wrapper">
			<view class="icon-box">
				<view class="icon" v-for="(item, index) in tabList" :key="index" @tap="goExpertList(item)">
					<view class="icon-img"><image :src="item.path" mode=""></image> </view>
					<text>{{ item.title }}</text>
				</view>
			</view>
			<view class="btn-box">
				<navigator open-type="switchTab" url="../experts/experts" class="submit-btn"
					>预约专家</navigator
				>
				<navigator url="../test/test" class="submit-btn">心理测试</navigator>
			</view>
		</view>
		<!-- 热门专家 -->
		<view class="expert-box">
			<view class="common-header">
				<view class="title">热门专家</view>
				<navigator open-type="switchTab" url="../experts/experts" class="more">更多</navigator>
			</view>
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view class="scroll-view-item_H scroll-expert" v-for="(item, index) in consultation" :key="index">
					<view class="item-box" @tap="goExpert(item.Id)">
						<view class="avatar-box">
							<view class="avatar"
								><image :src="item.AvatarUrl" mode=""></image
							></view>
							<view>{{ item.Address1 }}</view>
						</view>
						<view class="info">
							<view class="name">{{ item.RealName }}</view>
							<view class="desc textOver3" v-html="item.PersonalIntroduction"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 热门测试 -->
		<view class="test-box">
			<view class="common-header">
				<view class="title">热门测试</view> 
				<navigator url="../test/test" class="more">更多</navigator>
			</view>
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view class="scroll-view-item_H scroll-test" v-for="(item, index) in testList" :key="index">
					<view class="item-box" @tap="goTest(item.Id)">
						<view class="img-box">
							<image :src="item.BannerPictureUrl" mode=""></image>
						</view>
						<view class="title textOver1">
							{{item.Title}}
						</view>
						<view class="num">
							{{item.TestQuantity}}人已测试
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 文章分享 -->
		<view class="article-box">
			<view class="common-header">
				<view class="title">文章分享</view>
				<navigator url="../article/article" class="more">更多</navigator>
			</view>
			<article-list :data="list"></article-list>
		</view>

		
	</view>
</template>

<script>
import articleList from '../../components/articleList.vue';
import test from '../../api/test.js';
import { getList } from '../../api/consultation.js';
import article from '../../api/article.js';

import { mapState } from 'vuex';
export default {
	components: {
		articleList
	},
	data() {
		return {
			tabList: [
				{ title: '婚姻家庭', path: '../../static/images/index/hunyin.png' },
				{ title: '恋爱情感', path: '../../static/images/index/love.png' },
				{ title: '情绪压力', path: '../../static/images/index/press.png' },
				{ title: '亲子关系', path: '../../static/images/index/qinzi.png' },
				{ title: '人际职场', path: '../../static/images/index/work.png' },
				{ title: '星座占卜', path: '../../static/images/index/xinzuo.png' },
				{ title: '个人成长', path: '../../static/images/index/grow.png' },
				{ title: '性心理', path: '../../static/images/index/xinli.png' }
			],
			bannerl:this.$imgPrePath+'banner1.png',
			banner2:this.$imgPrePath+'banner2.png',
			list: [],
			consultation: [],
			testList: []
		};
	},
	onLoad() {
		getList().then(res => {
			this.consultation = res.customers;
		});
		test.getList().then(res => {
			this.testList=res.Data;
		});
		article.getArticleList().then(res=>{
			this.list = res.list;
		})
	},
	methods: {
		goExpert(id){
			uni.navigateTo({
				url:'/pages/experts/view/view?id='+id
			})
		},
		//tap 点击前往专家列表页面
		goExpertList(item){
			this.$store.commit('setExperts',{GoodFieldid:item.title});
			uni.switchTab({
				url:'/pages/experts/experts'
			})
		},
		goTest(id){
			uni.navigateTo({
				url:'/pages/test/view/view?id='+id
			})
		}
	},
		//转发话术
	onShareAppMessage(res) {
		
	},
};
</script>

<style lang="scss">
.page {
	background: #f2f2f2;
	width:750upx;
	overflow-x: hidden;
}
.banner-box {
	height: 336upx;
	background: #095389;
	position: relative;
	.search-box{
		position: absolute;
		left:20upx;
		top:20upx;
		width:710upx;
		height:56upx;
		background:rgba(255,255,255,1);
		border-radius:10upx;
		border:1px solid rgba(230,230,234,1);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color:#B2B2B2;
		z-index: 100;
		icon{
			margin-right: 10upx;
		}
	}
    .swiper {
    	height: 336upx;
    }
    .swiper-item {
    	display: block;
    	height: 336upx;
    	line-height: 336upx;
    	text-align: center;
		navigator{
			width:100%;
			height:100%;
			image{
				width:100%;
				height:100%;
			}
		}
    }
}

.icon-wrapper {
	position: relative;
	padding: 0 40upx;
	box-sizing: border-box;
	margin-bottom: 40upx;
	.icon-box {
		background: #fff;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-bottom: 10upx;
		border-radius: 10upx;
		position: relative;
		top: -10upx;
		padding: 40upx 10upx 0;
		.icon {
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 22upx;
			margin-bottom: 40upx;
			.icon-img {
				width: 84upx;
				height: 84upx;
				margin-bottom: 10upx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.btn-box {
		display: flex;
		flex-flow: row;
		justify-content: space-between;
		.submit-btn {
			flex: 1;
			height: 82upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			&:first-child {
				margin-right: 30upx;
			}
		}
	}
}

/* 头部公用样式 */
.common-header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 40upx;
	height: 110upx;
	background: #fff;
	.title {
		font-size: 42upx;
	}
	.more {
		width: 80upx;
		height: 36upx;
		border-radius: 20upx;
		border: 1px solid rgba(151, 151, 151, 1);
		text-align: center;
		color: #666;
		font-size: 10px;
		line-height: 36upx;
	}
}
.expert-box{
	margin-bottom: 40upx;
	padding-bottom: 40upx;
	background: #fff;
}
.test-box{
	margin-bottom: 40upx;
	padding-bottom: 40upx;
	background: #fff;
}
.scroll-Y {
	height: 300upx;
}

.scroll-view_H {
	white-space: nowrap;
	width: 100%;
	padding: 0 40upx;
	background: #fff;
	display: flex;
	flex-direction: row;
	.scroll-view-item_H {
		display: inline-block;
		margin-right: 40upx;
		
	}
	.scroll-expert{
		width: 542upx;
		height: 300upx;
		.item-box {
			display: flex;
			flex-direction: row;
			background: #f2f2f2;
			padding: 50upx 45upx;
			border-radius: 20upx;
			.avatar-box {
				margin-right: 40upx;
				.avatar {
					width: 132upx;
					height: 132upx;
					border-radius: 50%;
					overflow: hidden;
					margin-bottom: 30upx;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			.info {
				flex: 1;
				.name {
					font-size: 36upx;
					font-weight: bold;
					margin-bottom: 25upx;
				}
				.desc {
					white-space: normal;
					color: #666;
					font-size: 24upx;
					line-height: 36upx;
				}
			}
		}
	}
	.scroll-test{
		width: 348upx;
		height:300upx;
		.img-box{
			width:348upx;
			height:190upx;
			background:rgba(216,216,216,1);
			border-radius:20upx;
			border:1px solid rgba(151,151,151,1);
			overflow: hidden;
			margin-bottom: 30upx;
		}
		.title{
			font-size: 24upx;
			margin-bottom: 20upx;
			white-space: normal;
		}
		.num{
			font-size: 10px;
			color:#666;
		}
	}
}


</style>
