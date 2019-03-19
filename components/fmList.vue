<template>
	<view class="fm-list-com">
		<view  @tap="goView(item.Id,item.CustomerId)" class='item flex-row' v-for="(item,index) in data" :key="index">
			<view class='img-box'>
				<image :src="item.BackgroundPictureUrl"></image>
			</view>
			<view class='content flex-column'>
				<view class='title textOver1'>
					{{item.Title}}
				</view>
				<view class='price-box'>
					<text>收藏 {{item.WishlistQuantity}}</text>
					<text>评论:{{item.CommentQuantity}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
    props: ['data'],
    methods: {
        goView(id) {
			let data=this.data;
			this.$store.commit('setFmList',this.data);
            wx.navigateTo({
                url: `/pages/fm/view/view?id=${id}`
            });
        }
    }
};
</script>

<style lang="scss">
.fm-list-com {
    .item {
        margin-bottom: 40upx;
        color: #666;
        .img-box {
            width: 160upx;
            height: 140upx;
            margin-right: 20upx;
            position: relative;
        }
        .content {
            flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
            font-size: 30upx;
            .title {
				width:100%;
				font-size: 32upx;
				height: 40upx;
				overflow: hidden;
				color:#000;
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
		color:#666;
        
    }

    .img-box image {
        width: 100%;
        height: 100%;
    }
}
</style>
