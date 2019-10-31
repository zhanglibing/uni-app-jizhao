<template>
	<view class="edit-box">
		<textarea v-model="Contenttext" placeholder="请填写回复内容"></textarea>
		<view @tap="formSubmit" class="block-btn">发送</view>
		<login></login>
	</view>
</template>

<script>
import api from '../../../api/article.js';
import login from '../../../components/login'
export default {
	components:{
		login
	},
	data() {
		return {
			option: {},
			Contenttext: ''
		};
	},
	onLoad(options) {
		this.option = options;
	},
	methods: {
		formSubmit() {
			if(!this.$isLogin()){return false;} //判断是否登录
			if (!this.Contenttext) {
				return this.$msg.error('回复内容不能为空');
			}
			let { TopicId, PostId } = this.option;
			let option = {
				Contenttext: this.Contenttext,
				TopicId
			};
			if (PostId) {
				option.PostId = PostId;
			}
			let fun = PostId ? api.postpostCreate : api.postCreate;
			fun(option)
				.then(res => {
					uni.showToast({
						title: '回复成功',
						icon: 'success'
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						});
					}, 1000);
				})
				.catch(res => {
					return this.$msg.error('系统错误');
				});
		}
	}
};
</script>

<style scoped="scoped">

textarea {
	width: 100%;
	background: #fff;
	box-sizing: border-box;
	margin-bottom: 60upx;
	border-radius: 10rpx;
	padding: 30upx;
}
</style>
