<template>
	<view>
		<view class="block">
			<view class="select-name">
				<view class="line"></view>
				{{activeName}}
			</view>
		</view>
		<view class="result-box">
			<view class="avatar-box">
				<image :src="info.AvatarUrl" mode=""></image>
			</view>
			<view class="content-box">
				<view class="item">
					<text>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区:</text>
					<view>{{info.ProvinceName}}-{{info.CityName}}</view>
				</view>
				<view class="item">
					<text>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</text>
					<view>{{info.Sex=='M'?"男":"女"}}</view>
				</view>
				<view class="item" v-if="info.CertificateType!=27">
					<text>身份证号:</text>
					<view>{{info.IDCard}}</view>
				</view>
				<view class="item">
					<text>证书编号:</text>
					<view>{{info.CertificateNo}}</view>
				</view>
				<view class="item">
					<text>发证时间:</text>
					<view>{{info.SendDate}}</view>
				</view>
			</view>
			<view class="certi-img" @click="isShowBig=true">
				<image :src="info.CertificatePicUrl" mode="widthFix"></image>
				<view>点击查看大图</view>
			</view>
		</view>
		<view class="link-box">
			<button class="btn" open-type="contact">考证报名</button>
			<button class="btn" @click="call">报考答疑</button>
			<button class="btn" @click="goInfo">证书介绍</button>
			<button class="btn" open-type="contact">了解更多</button>
		</view>
		<view class="support">
			搜索结果由幸福谋方全力支持
		</view>
		<view class="show-big" v-if="isShowBig" @click="isShowBig=false">
			<image :src="info.CertificatePicUrl" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				activeName: '',
				isShowBig: false
			};
		},
		created() {
			this.info = this.$store.state.certiResult;
			this.activeName = this.info.CertificateType == 27 ? '《中国心理卫生协会》会员证' : '《心理健康辅导员资格证书》'
		},
		methods:{
			//前往课程详情
			goInfo(){
				let id=this.info.CertificateType==27?2282:13
				uni.navigateTo({
					url:'/pages/course/view/view?id='+id
				})
			},
			call(){
				uni.makePhoneCall({
					phoneNumber:'4001661085'
				})
			}
		}
	}
</script>

<style lang="scss" scoped="">
	.block {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		height: 126upx;
		padding: 0 40upx;
		font-size: 30upx;
		margin-bottom: 30upx;

		.select-name {
			display: flex;
			flex-direction: row;
			align-items: center;

			.line {
				width: 11upx;
				height: 52upx;
				background: rgba(3, 137, 228, 1);
				border-radius: 6upx;
				margin-right: 15upx;
			}
		}


	}

	.result-box {
		display: flex;
		flex-direction: column;
		justify-items: center;
		background: #fff;
		padding: 40upx;

		.avatar-box {
			display: flex;
			justify-content: center;
			margin-bottom: 50upx;

			image {
				width: 150upx;
				height: 150upx;
			}
		}

		.content-box {
			margin-bottom: 20upx;

			.item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-bottom: 15upx;

				text {
					flex: 1;
					color: #BBBBBB;
					margin-right: 20upx;
					text-align: right;
				}

				view {
					flex: 3;
				}
			}
		}

		.certi-img {
			padding: 0 80upx;
			font-size: 28upx;
			color: #bbb;
		}
	}

	.show-big {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		box-sizing: border-box;
		padding: 0 30upx;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.link-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 40upx 70upx;
		justify-content: space-between;

		.btn {
			min-width: 250upx;
			background: #fff;
			margin-bottom: 50upx;
			line-height: 70upx;
			text-align: center;
			border-radius: 40upx;
			font-size: 28upx;
			color: #0389E4;

			&::after {
				border: none;
			}
		}
	}

	.support {
		margin-top: 60upx;
		text-align: center;
		color: #bbb;
		margin-bottom: 100upx;
	}
</style>
