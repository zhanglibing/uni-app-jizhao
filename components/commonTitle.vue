<template>
	<view class="common-header">
		<view class="title"><slot></slot></view>
		<navigator :open-type="openType" :url="url" class="more">更多</navigator>
	</view>
</template>

<script>
	export default {
		props:{
			url:{
				type:String,
			},
			openType:{
				type:String,
				default:'navigate'
			}
		},
		data() {
			return {
				
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
	.title {
		font-size: 42upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		&::before{
			content:'';
			width:8upx;
			height:0upx;
			background: #000;
			border-bottom:20upx solid #095289;
			border-top:20upx solid #F5A623;
			margin-right:30upx;
		}
		
	}
	.more {
		width: 137upx;
		height: 56upx;
		border-radius: 34upx;
		border: 1px solid #D5D5D5;
		text-align: center;
		color: #666;
		font-size: 12px;
		line-height: 56upx;
	}
}

</style>
