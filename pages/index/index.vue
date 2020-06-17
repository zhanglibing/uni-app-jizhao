<template>
	<view class="page">
		<!-- 头部 -->
		<view class="banner-box">
			<navigator url="../search/search" class="search-box">
				<icon type="search" size="16"></icon>搜索话题或专家姓名
			</navigator>
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :circular="true" indicator-active-color="#fff" :indicator-dots="true" :autoplay="true"
					 :interval="5000" :duration="500">
						<swiper-item>
							<navigator open-type="switchTab" url="../experts/experts">
								<image :src="bannerl" mode=""></image>
							</navigator>
						</swiper-item>
						<swiper-item>
							<navigator url="../test/test">
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
					<view class="icon-img">
						<image :src="item.path" mode=""></image>
					</view>
					<text>{{ item.title }}</text>
				</view>
			</view>
			<view class="btn-box">
				<navigator open-type="switchTab" url="../experts/experts" class="submit-btn1">
					<image src="../../static/images/index/appoint.png" mode=""></image>
				</navigator>
				<navigator url="../test/test" class="submit-btn1">
					<image src="../../static/images/index/test.png" mode=""></image>
				</navigator>
			</view>
		</view>
		<!-- 热门专家 -->
		<view class="expert-box">
			<commonTitle index="1" url="../experts/experts" openType="switchTab">热门专家</commonTitle>
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view class="scroll-view-item_H scroll-expert" v-for="(item, index) in consultation" :key="index">
					<view class="item-box" @tap="goExpert(item.Id)">
						<view class="avatar-box">
							<view class="avatar">
								<image :src="item.AvatarUrl" mode=""></image>
							</view>
							<view>{{ item.Address1 }}</view>
						</view>
						<view class="info">
							<view class="name">
								<text>{{ item.RealName }}</text>
								<text class="year">从业：{{item.WorkingYears}}年</text>
							</view>
							<!-- <text space="emsp" class="textOver3">{{item.PersonalIntroduction}}</text> -->
							<view class="desc textOver3" v-html="item.PersonalIntroduction"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 热门测试 -->
		<view class="host-test">
			<commonTitle index="2" url="../test/test">热门测试</commonTitle>
			<hostTest></hostTest>
		</view>

		<!-- 心理FM -->
		<view class="article-box">
			<commonTitle  index="3"  url="../fm/fm">FM</commonTitle>
			<fm-list></fm-list>
		</view>
		<!-- 文章分享 -->
		<view class="article-box">
			<commonTitle  index="4"  url="../article/article">文章分享</commonTitle>
			<article-list :isHome="true" pageSize="5"></article-list>
		</view>

		<view>
			<commonTitle  index="5"  url="../course/course">热门课程</commonTitle>
			<courseList  :isHome="true"></courseList>
		</view>
		<kefu></kefu>
	</view>
</template>

<script>
	import articleList from '../../components/articleList.vue';
	import hostTest from '../../components/hostTest.vue';
	import commonTitle from '../../components/commonTitle.vue';
	import courseList from '../../components/courseList.vue';
	import fmList from '../../components/fmList'
	import test from '../../api/test.js';
	import {
		getHotList
	} from '../../api/consultation.js';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			articleList,
			hostTest,
			commonTitle,
			courseList,
			fmList,
			
		},
		data() {
			return {
				
				tabList: [{
						title: '婚姻家庭',
						path: '../../static/images/index/hunyin.png'
					},
					{
						title: '恋爱情感',
						path: '../../static/images/index/love.png'
					},
					{
						title: '情绪压力',
						path: '../../static/images/index/press.png'
					},
					{
						title: '孩子教育',
						path: '../../static/images/index/qinzi.png'
					},
					{
						title: '职业规划',
						path: '../../static/images/index/work.png'
					},
					{
						title: '家庭关系',
						path: '../../static/images/index/xinzuo.png'
					},
					{
						title: '个人成长',
						path: '../../static/images/index/grow.png'
					},
					{
						title: '性心理',
						path: '../../static/images/index/xinli.png'
					}
				],
				bannerl: this.$imgPrePath + 'banner1.png',
				banner2: this.$imgPrePath + 'banner2.png',
				consultation: [],

			};
		},
		onLoad() {
			getHotList().then(res => {
				this.consultation = res;
			});
		},
		methods: {
			goExpert(id) {
				uni.navigateTo({
					url: '/pages/experts/view/view?id=' + id
				})
			},
			//tap 点击前往专家列表页面
			goExpertList(item) {
				this.$store.commit('setExperts', {
					GoodFieldid: item.title
				});
				uni.switchTab({
					url: '/pages/experts/experts'
				})
			},

		},
		//转发话术
		onShareAppMessage(res) {

		},
	};
</script>

<style lang="scss">
	.page {
		background: #f2f2f2;
		width: 750upx;
		overflow-x: hidden;
	}

	.banner-box {
		height: 430upx;
		background: #095389;
		position: relative;

		.search-box {
			position: absolute;
			left: 20upx;
			top: 20upx;
			width: 710upx;
			height: 56upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 10upx;
			border: 1px solid rgba(230, 230, 234, 1);
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			color: #B2B2B2;
			z-index: 100;

			icon {
				margin-right: 10upx;
			}
		}

		.swiper {
			height: 430upx;
		}

		.swiper-item {
			display: block;
			height: 430upx;
			line-height: 430upx;
			text-align: center;

			navigator {
				width: 100%;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.icon-wrapper {
		position: relative;
		padding: 0 20upx;
		box-sizing: border-box;
		margin-bottom: 40upx;

		.icon-box {
			background: #fff;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-bottom: 30upx;
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
					width: 86upx;
					height: 86upx;
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

			.submit-btn1 {
				flex: 1;
				height: 218upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32upx;

				&:first-child {
					margin-right: 30upx;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}


	.expert-box {
		margin-bottom: 40upx;
		padding-bottom: 40upx;
		background: #fff;
	}

	.host-test,
	.article-box {
		margin-bottom: 40upx;
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

		.scroll-expert {
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
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;

						.year {
							font-size: 22upx;
							color: #666;
						}
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
	}
</style>
