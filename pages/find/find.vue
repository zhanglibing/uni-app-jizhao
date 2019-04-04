<template>
	<view class="find-box">
		<view>
			<commonTitle url="../course/course">热门课程</commonTitle>
			<courseList></courseList>
		</view>
		<hostTest></hostTest>
		<view>
			<common-title url="../article/article">文章分享</common-title>
			<article-list :pageSize="5"></article-list>
		</view>
		<view class="fm-box">
			<commonTitle url="../fm/fm">FM</commonTitle>
			<fm-list></fm-list>
		</view>
		
	</view>
</template>

<script>
	import commonTitle from '../../components/commonTitle.vue';
	import articleList from '../../components/articleList.vue';
	import hostTest from '../../components/hostTest.vue';
	import courseList from '../../components/courseList.vue';
	import fmList from '../../components/fmList'
	export default {
		components: {
			courseList,
			articleList,
			hostTest,
			commonTitle,
			fmList
		},
		data() {
			return {
				
			};
		},
				//转发话术
		onShareAppMessage(res) {
			
		},
	}
</script>

<style lang="scss">
.find-box{
	width:100%;
	&>view{
		margin-bottom: 40upx;
	}
	.fm-box{
		background: #fff;
		padding:0 40upx 20upx;
	}
}
</style>
