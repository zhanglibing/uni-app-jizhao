<template>
	<view class="steps-box">
		<view class="step" :class="{current:index==step-1}" v-for="(item,index) in list" :key="index">
			<view class="step-circle">0{{index+1}}</view>
			<view class="step-content">
				<view class="step-title">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			step:{
				default:1
			}
		},
		data() {
			return {
				list:['基本信息','从业背景','提交审核','审核結果']
			};
		}
	}
</script>

<style lang="scss">
.steps-box{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-bottom: 1px solid #C3C3C3;
	padding:40upx 60upx 0;
	margin-bottom: 40upx;
	.step{
		text-align: center;
		padding-bottom: 10upx;
		&.current{
			color:#00528B;
			border-bottom: 3px solid #00528B;
		}
	}
}
</style>
