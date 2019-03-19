<template>
	<view class="audio-box">
		<view class="success" v-if="status==2">
			<view class="big">已提交，正在审核</view>
			<view class="min" @tap="call">
				如果有疑问请联系客服询问
			</view>
		</view>
		<block v-if="status==3">
			<view class="success">
				<view class="big">审核失败,请修改信息重新提交</view>
				<view class="min"  @tap="call">
					如有疑问请联系客服询问
				</view>
			</view>
			<view class="btn-box">
				<navigator url="../expertIn" class="block-btn back">返回首頁</navigator>
				<navigator url="../basic/basic" class="block-btn">重新提交</navigator>
			</view>
			
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:2
			};
		},
		onShow() {
			 let {StatusForConsultant} = this.$store.state.userInfo;
			 this.status=StatusForConsultant;
		},
		methods:{
			call(){
				uni.makePhoneCall({
					phoneNumber:'051269576237'
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
		padding-top: 150upx;
	}
	.success{
		margin-top: 150upx;
		margin-bottom: 50upx;
		color:#000;
		.big{
			font-size: 30upx;
			margin-bottom: 50upx;
			font-weight: bold;
			text-align: center;
		}
		.min{
			width:100%;
			font-size: 36upx;
			box-sizing: border-box;
			line-height: 60upx;
			text-align: center;
			color:#666666;
		}
	}
    .btn-box{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width:80%;
		margin:0 auto;
		.back{
			margin-right: 50upx;
			background: #fff;
			color:#666666;
			border:1px solid #666666;
		}
	}
     
</style>
