<template>
	<view class="find-box">
		<navigator url="/pages/course/course">
			<image src="../../static/images/find/course.png" mode=""></image>
		</navigator>
		<navigator url="/pages/fm/fm">
			<image src="../../static/images/find/fm.png" mode=""></image>
		</navigator>
		<navigator url="/pages/article/article">
			<image src="../../static/images/find/article.png" mode=""></image>
		</navigator>
		<navigator url="/pages/test/test">
			<image src="../../static/images/find/test.png" mode=""></image>
		</navigator>
		
	</view>
</template>

<script>
	export default {
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
	navigator{
		background: #fff;
		text-align: center;
		height:256upx;
		image{
			width:100%;
			height:100%;
		}
	}
}
</style>
