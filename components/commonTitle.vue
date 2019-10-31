<template>
	<view class="common-header">
		<view class="title">
			<view class="icon-box">
				<image :src="titles[index].icon" mode=""></image>
			</view>
			<view class="tt">
				<view class="t">
					{{titles[index].title}}
					<text  v-if="index==1" class="red1">HOT</text>
					<text  v-if="index==2" class="red2">HOT</text>
				</view>
				<view class="en">{{titles[index].en}}</view>
			</view>
		</view>
		<navigator :open-type="openType" :url="url" class="more">
			更多
			<image src="../../static/images/index/more.png" mode=""></image>
		</navigator>
	</view>
</template>

<script>
	export default {
		props: {
			url: {
				type: String,
			},
			openType: {
				type: String,
				default: 'navigate'
			},
			index: {
				type: String,
				defalut: '1'
			}
		},
		data() {
			return {
				titles: {
					1: {
						icon: '../../static/images/index/t1.png',
						title: '热门专家',
						en: 'HOT EXPERTS',
					
					},
					2: {
						icon: '../../static/images/index/t2.png',
						title: '热门测试',
						en: 'HOT TEST',
					
					},
					3: {
						icon: '../../static/images/index/t3.png',
						title: 'FM',
						en: 'FANMEETUNF'
					},
					4: {
						icon: '../../static/images/index/t4.png',
						title: '文章分享',
						en: 'THE ARTICLE TO SHARE'
					},
					5: {
						icon: '../../static/images/index/t5.png',
						title: '热门课程',
						en: 'TMOST POPULAR COURSES'
					},
				}
			};
		}
	}
</script>

<style lang="scss">
	.common-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 20upx;
		height: 120upx;
		background: #fff;

		.icon-box {
			width: 55upx;
			height: 55upx;
			margin-right: 20upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 42upx;
			display: flex;
			flex-direction: row;
			align-items: center;

			.tt {
				display: flex;
				flex-direction: column;
				justify-content: center;

				.t {
					color: #000;
					font-size: 36upx;
					font-weight: bold;

					text {
						font-size: 28upx;
						margin-left: 20upx;
					}
					.red1{
						color:#FF0000;
					}
					.red2{
						color:#0389E4;
					}
				}

				.en {
					color: #D2D2D2;
					font-size: 20upx;
				}
			}
		}

		.more {
			width: 137upx;
			height: 56upx;
			border-radius: 34upx;
			border: 1px solid #D5D5D5;
			color: #000;
			font-size: 26upx;
			line-height: 56upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			image {
				width: 17upx;
				height: 23upx;
				margin-left: 15upx;
			}
		}
	}
</style>
