<template>
	<view class="edit-box">
		<textarea v-model="CommentText" placeholder="点击进行评价"></textarea>
		<view @tap="SubmitComment" class="block-btn">发送</view>
	</view>
</template>

<script>
import fm from '../../../api/fm.js';
export default {
	data() {
		return {
			option: {},
			CommentText: '',
			id:''
		};
	},
	onLoad(options) {
		this.id = options.id;
	},
	methods: {
		 //提交评论
      SubmitComment(){
        let CommentText = this.CommentText;
        if (!CommentText) {
			uni.showToast({
				title: '评论内容不能为空',
				mask: false,
				duration: 1500
			});
            return false;
        }
        let option = {
          FMId: this.id,
          CommentText
        }
        fm.CreateComment(option).then(res => {
			this.CommentText = '';
			uni.showToast({
				title:'感谢您的评价',
				icon:"success"
			})
            setTimeout(()=>{
				uni.navigateBack({
					delta:1
				})
			},1000)
        })
      },
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
