<template>
	<view>
		<view class="test-box">
			
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view class="scroll-view-item_H scroll-test" v-for="(item, index) in testList" :key="index">
					<view class="item-box" @tap="goTest(item.Id)">
						<view class="img-box">
							<image :src="item.BannerPictureUrl" mode=""></image>
						</view>
						<view class="title textOver1">
							{{item.Title}}
						</view>
						<view class="num">
							{{item.TestQuantity}}人已测试
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import commonTitle from '../components/commonTitle.vue';
	import test from '../api/test.js';
	export default {
		components:{
			commonTitle
		},
		data() {
			return {
				testList:[]
			};
		},
		created() {
			test.getList().then(res => {
				this.testList=res.Data;
			});
		},
		methods:{
			goTest(id){
				uni.navigateTo({
					url:'/pages/test/view/view?id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
.test-box{
	margin-bottom: 40upx;
	padding-bottom: 40upx;
	background: #fff;
}
.scroll-view_H {
	white-space: nowrap;
	width: 100%;
	padding: 0 40upx;
	background: #fff;
	display: flex;
	flex-direction: row;
	.scroll-view-item_H {
		display: inline-block;
		margin-right: 40upx;
		
	}
	.scroll-test{
		width: 348upx;
		height:300upx;
		.img-box{
			width:348upx;
			height:190upx;
			background:rgba(216,216,216,1);
			border-radius:20upx;
			border:1px solid rgba(151,151,151,1);
			overflow: hidden;
			margin-bottom: 30upx;
		}
		.title{
			font-size: 24upx;
			margin-bottom: 20upx;
			white-space: normal;
		}
		.num{
			font-size: 10px;
			color:#666;
		}
	}
}
</style>
