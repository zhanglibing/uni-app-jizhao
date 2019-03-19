<template>
	<view class='upload img-box' @tap='uploadImg'>
		<image v-if="!imgUrl" class='upload-icon' src="/static/images/upload.png"></image>
		<block v-if="imgUrl">
			<image v-if="newUrl" :src="newUrl"></image>
			<image v-else="" :src="imgUrl"></image>
		</block>
		
	</view>
</template>

<script>
	import {host,getUserId} from '../api/ajax.js'
	export default {
		props:{
			imgUrl:{
				default:''
			},
			type:{
				default:''
			}
		},
		data() {
			return {
				newUrl:''
			};
		},
		methods:{
			 //上传图片
			    uploadImg() {
			        let that = this;
			        uni.chooseImage({
			            count: 1,
			            sizeType: ['original', 'compressed'],
			            sourceType: ['album', 'camera'],
			            success(res) {
			                
			                let tempFilePaths = res.tempFilePaths;
							that.newUrl=tempFilePaths;
							wx.uploadFile({
							  url: `${host}CustomerHandle/UploadIDPicture?customerId=${getUserId()}&type=${that.type}`, 
							  filePath: tempFilePaths[0],
							  name: 'file',
							  success(res) {
								  uni.showToast({
								      title: '图片上传成功',
								      icon: 'success'
								  });
								 let {Code,UploadIDPicture} = JSON.parse(res.data);
								 let imgUrl = UploadIDPicture.IDPictureUrl+'?'+ Math.random();
								 that.$emit('getImgId',{type:that.type,path:imgUrl,id:UploadIDPicture.IDPictureId});

							  }
							})
			            }
			        });
			    }
			
		}
	}
</script>

<style lang="scss" scoped="">
.upload{
	width:100upx;
	height:100upx;
	border:1px solid #C3C3C3;
	width:180upx;
	height:180upx;
}
</style>
