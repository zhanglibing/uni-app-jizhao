<template>
	<view class="page">
		<form class='edit-box'>
			<textarea v-model="CommentText" placeholder='请填评价内容'></textarea>
			<view @tap="formSubmit" class="block-btn">提交</view>
		</form>
	</view>
</template>

<script>
	import api from '../../../api/order.js'
	export default {
		data() {
			return {
				CommentText: '',
				option: {},
				flag:true,
			};
		},
		onLoad(options) {
			this.option = options;
		},
		methods: {
			formSubmit() {

				if (!this.CommentText) {
					uni.showModal({
						title: '提示',
						content: '评价内容不能为空',
						showCancel: false
					})
					return false;
				}
				if(!this.flag){
					return false;
				}
				this.flag=false;
				uni.showLoading({
					title:'正在提交...'
				})
				let option = {
					CommentText: this.CommentText,
					...this.option,
				}

				api.courseEvalute(option).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '感谢您的成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1,
						})
					}, 1000)
				})
			},
		}
	}
</script>

<style lang="scss">
	textarea {
		width: 100%;
		background: #fff;
		box-sizing: border-box;
		margin-bottom: 60upx;
		border-radius: 10rpx;
		padding: 30upx;
	}
</style>
