<template>
	<view class="course-list-com">
		<view :data-id='item.Id' @tap="goView" class='item flex-row' v-for="(item,index) in data" :key="index">
			<view class='img-box'>
				<image :src="item.BannerPictureUrl"></image>
			</view>
			<view class='content flex-column'>
				<view class='title'>
					{{item.Title}}
				</view>
				<view class="watchs">观看人数:{{item.Watchs}}</view>
				<view class='price-box'>
					<text>{{item.CreateDate}}</text>
					<text class='price' v-if="item.Price>0">￥{{item.Price}}</text>
					<text class='price' v-if="!item.Price">免费课程</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
    props: ['data'],
    methods: {
        goView(e) {
            wx.navigateTo({
                url: '/pages/course/view/view?id=' + e.currentTarget.dataset.id
            });
        }
    }
};
</script>

<style lang="scss">
.course-list-com {
	padding: 40upx 30upx;
	background: #fff;
    .item {
        margin-bottom: 40upx;
        color: #666;
       
        .img-box {
            width: 300upx;
            height: 200upx;
            margin-right: 20upx;
            position: relative;
        }
        .content {
            flex: 1;
            font-size: 30upx;
            flex-direction: column;
            height: 200upx;
            .title {
                flex: 1;
            }
			.watchs{
				font-size: 12px;
				color:#666;
				margin-bottom: 15upx;
			}
        }
    }

    .price-box {
        height: 30upx;
        position: relative;
        font-size: 12px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
		align-items: flex-end;
    }

    .img-box image {
        width: 100%;
        height: 100%;
    }
}
</style>
