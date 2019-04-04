<template>
	<view>
		<view class="model-box">
			<view class="model-title">心情</view>
			<view class="select-box mood">
				<view
					v-for="(item, index) in moodList"
					:key="index"
					@tap="goList('mood', item.name)"
				>
				    <view class="title">{{ item.name }}</view>
					<image :src="item.path" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="model-box">
			<view class="model-title">听书</view>
			<view class="select-box scene">
				<view
					v-for="(item, index) in sceneList"
					:key="index"
					@tap="goList('scene', item.name)"
				>
				    <image :src="item.path" mode="widthFix"></image>
				    <view class="title">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="model-box">
		   <view class="model-title">推荐 
		     <navigator url="list/list">更多</navigator>
		   </view>
		   <fm-list></fm-list>
		</view>
	</view>
</template>

<script>
import fmList from '../../components/fmList'
export default {
	components:{
		fmList
	},
	data() {
		return {
			moodList: [
				{ name: '烦躁', path: '../../static/images/mood/fanzao.png' },
				{ name: '悲伤', path: '../../static/images/mood/sad.png' },
				{ name: '孤独', path: '../../static/images/mood/lonely.png' },
				{ name: '已弃疗',path:'../../static/images/mood/treated.png' },
				{ name: '减压', path: '../../static/images/mood/pressure.png' },
				{ name: '无奈', path: '../../static/images/mood/helpless.png' },
				{ name: '快乐', path: '../../static/images/mood/happy.png' },
				{ name: '感动', path: '../../static/images/mood/moved.png' },
				{ name: '迷茫', path: '../../static/images/mood/confused.png' }
			],
			sceneList: [
				{ name: '睡前', path: '../../static/images/scene/sleep.png' },
				{ name: '旅行', path: '../../static/images/scene/travel.png' },
				{ name: '散步', path: '../../static/images/scene/walk.png' },
				{ name: '坐车', path: '../../static/images/scene/car.png' },
				{ name: '独处', path: '../../static/images/scene/alone.png' },
				{ name: '失恋', path: '../../static/images/scene/brokenhearted.png' },
				{ name: '失眠', path: '../../static/images/scene/insomnia.png' },
				{ name: '无聊', path: '../../static/images/scene/boring.png' },
				{ name: '随便', path: '../../static/images/scene/casually.png' }
			]
		};
	},

	methods: {
		//前往列表页面
		goList(type,name){
			uni.navigateTo({
				url:`./list/list?${type}=${name}`
			})
		}
	},
			//转发话术
	onShareAppMessage(res) {
		
	},
};
</script>

<style lang="scss">
.model-title {
	font-size: 20px;
	height: 90upx;
	color: #010101;
	margin-bottom: 30upx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	navigator{
		width:80upx;
		height:40upx;
		line-height: 40upx;
		text-align: center;
		border-radius:22upx;
		font-size: 12px;
		border:1px solid rgba(151,151,151,1);
		color:#666;
	
	}
}
.model-box{
	background: #fff;
	padding:30upx 40upx;
	margin-bottom: 30upx;
}
/*
  心情模块
  */
$mood:
    (
		imgPath: 'fanzao',
		bgHover: #f4a19d
	),
	(
		imgPath: 'sad',
		bgHover: #b69bd4
	),
	(
		imgPath: 'lonely',
		bgHover: #a7d784
	),
	(
		imgPath: 'treated',
		bgHover: #e7925d
	),
	(
		imgPath: 'pressure',
		bgHover: #e7925d
	),
	(
		imgPath: 'helpless',
		bgHover: #f47c8c
	),
	(
		imgPath: 'happy',
		bgHover: #76b4be
	),
	(
		imgPath: 'moved',
		bgHover: #7cb556
	),
	(
		imgPath: 'confused',
		bgHover: #b59ad2
	);
.select-box {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	&.mood{
		& > view {
			height:120upx;
			width:30%;
			margin-right: 5%;
			margin-bottom: 30upx;
			border-radius: 10upx;
			color:#fff;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			&:nth-child(3n){
				margin-right: 0;
			}
			@for $i from 1 through length($mood) {
				$item: nth($mood, $i);
				&:nth-child(#{$i}) {
					background: map-get($item, bgHover);
				}
			}
			image{
				max-width: 40upx;
				max-height: 40upx;
				margin-left: 40upx;
			}
		}
	}
	&.scene{
		&>view{
			width:100upx;
			height:100upx;
			margin-right: 36upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background:rgba(255,255,255,1);
			border-radius:10upx;
			border:1px solid rgba(229,229,229,1);
			margin-bottom: 30upx;
			font-size: 14px;
			&:nth-child(5n){
				margin-right: 0;
			}
			image{
				max-height: 30upx;
				max-width: 30upx;
				margin-bottom: 10upx;
			}
		}
	}
	
}
</style>
