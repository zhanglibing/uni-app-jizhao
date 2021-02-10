<template>
	<view class="Experts-box">
		<view class="Experts-list">
			<view
				class="item"
				v-for="(item, index) in list"
				:key="index"
				@tap="goView(item.Id)"
			>
				<view class="img-box"><image :src="item.AvatarUrl" alt=""/></view>
				<view class="info">
					<view class="name-box">
						<view class="name">
							{{ item.RealName }} <text>从业{{ item.WorkingYears }}年</text>
						</view>
						<view class="submit-btn">详情</view>
					</view>
					<view class="introduce ">
						<text space="emsp" class="textOver3">{{item.PersonalIntroduction}}</text>
						<!-- <view v-html="item.PersonalIntroduction" class="textOver3"></view> -->
					</view>
					<view class="price">
						<view class="address">{{
							item.Address2 ? item.Address2 : item.Address1
						}}</view>
						<view class="num">¥ {{ item.SerivcePrice }}元</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		props: ['list'],
		data() {
			return {
				
			};
		},
		methods:{
			goView(id) {
				uni.navigateTo({
					url: '../experts/view/view?id=' + id
				});
			}
		}
	}
</script>

<style lang="scss">
	.Experts-list {
		padding: 0 20upx;
		background: #fff;
		.item {
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid rgba(229, 229, 229, 1);
			padding: 40upx 0;
			.img-box {
				width: 110upx;
				height: 110upx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 40upx;
			}
			.info {
				flex: 1;
			}
			.name-box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30upx;
				.name {
					font-size: 18px;
				}
				text {
					font-size: 12px;
					margin-left: 50upx;
				}
				.submit-btn {
					width: 120upx;
					height: 60upx;
					line-height: 60upx;
				}
			}
			.introduce {
				color: #666;
				margin-bottom: 30upx;
			}
			.price {
				color: #666;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;
				.num {
					width: 300upx;
				}
			}
		}
	}
	

</style>
