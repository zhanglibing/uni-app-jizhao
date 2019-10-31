<template>
	<view class="login-wrapper" v-if="isLoginShow">
		<view class="content-box">
			<view class="tishi">提示！</view>
			<view class="title">您还没有登录账号</view>
			<view class="more-text">请先登录账号，解锁更多功能</view>
			<image src="/static/images/tankuang.png" mode="widthFix"></image>
			<view class="btn-box">
				<view @click="hide">暂不登录</view>
				<view class="login" @click="login">立即登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {

			};
		},
		methods: {
			hide() {
				this.$store.commit('setIsLoginShow', false)
			},
			login(){
				uni.navigateTo({
					url: '/pages/login/login',
					success: res => {
						this.hide();
					},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		computed: mapState(['isLoginShow'])
	}
</script>

<style lang="scss" scoped>
	.login-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		bottom: -100upx;
		right: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 200;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.content-box {
			position: absolute;
			width: 642upx;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 1);
			border-radius: 20upx;
			padding: 60upx 40upx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.tishi {
				color: #9B9B9B;
				font-size: 34upx;
				margin-bottom: 20upx;
			}

			.title {
				font-size: 40upx;
				margin-bottom: 20upx;
			}

			.more-text {
				color: #767676;
				font-size: 24upx;
			}
		}

		.btn-box {
			display: flex;
			width: 100%;
			justify-content: space-between;

			view {
				width: 240upx;
				height: 82upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36upx;
				border: 1px solid #095389;
				border-radius: 10upx;
				color: #095389;

				&.login {
					color: #fff;
					background: #095389;
				}
			}
		}
	}
</style>
