<template>
	<view class='box' >
		<input v-model="Subject" placeholder='请在此编辑文章标题'></input>
		<textarea v-model="Details" placeholder='请在此编辑内容'></textarea>
		<view class='upload img-box' @tap='uploadImg'>
				<image v-if="!imgUrl" class='upload-icon' src="/static/images/upload.png"></image>
				<image v-if="imgUrl" :src="imgUrl"></image>
		</view>
		<view @tap='formSubmit' class="block-btn">立即发表</view>
	</view>
</template>

<script>
import api from '../../../api/article.js';
export default {
    data() {
        return {
            imgUrl: '',
            base64: '',
            Subject: '',
            Details: ''
        };
    },
    methods: {
        //提交
        formSubmit(e) {
            if (!this.Subject) {
                uni.showModal({
                    title: '提示',
                    content: '文章标题不能为空',
                    showCancel: false
                });
                return;
            }
            if (!this.Details) {
                uni.showModal({
                    title: '提示',
                    content: '文章内容不能为空',
                    showCancel: false
                });
                return;
            }
            if (!this.base64) {
                uni.showModal({
                    title: '提示',
                    content: '请上传图片',
                    showCancel: false
                });
                return;
            }
            let option = {
                Subject: this.Subject,
                Details: this.Details,
                imageStream: this.base64
            };
            api.publishPosting(option).then(res => {
                uni.showToast({
                    title: '发表成功',
                    icon: 'success'
                });
                setTimeout(() => {
                    uni.navigateBack({
                        delta: 1
                    });
                }, 1000);
            });
        },
        //上传图片
        uploadImg() {
            let that = this;
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    // data: image / jpeg; base64,
                    let img = uni
                        .getFileSystemManager()
                        .readFileSync(res.tempFilePaths[0], 'base64');
                    uni.showToast({
                        title: '图片上传成功',
                        icon: 'success'
                    });
                    // tempFilePath可以作为img标签的src属性显示图片
                    that.imgUrl = res.tempFilePaths;
                    that.base64 = img;
                }
            });
        }
    }
};
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
	}
	
	input {
		background: #fff;
		height: 80upx;
		font-size: 14px;
		margin-bottom: 30upx;
		box-sizing: border-box;
		padding:0 30upx;
	}

	textarea {
		width: 100%;
		box-sizing: border-box;
		margin-bottom: 50upx;
		border-radius: 10upx;
		padding: 30upx;
		font-size: 14px;
		min-height: 500upx;
		background: #fff;
	}

	.upload {
		width: 200upx;
		height: 200upx;
		margin-left: 30upx;
		background: #fff;
		border-radius: 10upx;
		margin-bottom: 40upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.upload .upload-icon {
		width: 100upx;
		height: 100upx;
	}
	.block-btn{
		width:690upx;
	}
</style>
