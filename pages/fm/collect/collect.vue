<template>
	<view class="collect-fm-list">
		<view
			@tap="goView(item.Id)"
			class="item flex-row"
			v-for="(item, index) in list"
			:key="index"
		>
			<view class="img-box" @tap="goView(item)"> <image :src="item.BackgroundPictureUrl"></image> </view>
			<view class="content flex-column">
				<view class="title textOver2"  @tap="goView(item)"> {{ item.Title }} </view>
				<view class="price-box">
					<text>收藏:{{ item.WishlistQuantity }}</text>
					<text>评论:{{ item.CommentQuantity }}</text>
					<text class="views"  @tap="setWish(item.FMId)">取消收藏</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import fm from '../../../api/fm.js';
export default {
	data() {
		return {
		};
	},
	onShow() {
		if(!this.list.length){
			fm.getWishLists()
		}
	},
	methods: {
        //取消收藏
		setWish(id){
		   fm.setWish(id).then(res=>{
			   console.log(res)
			   uni.showToast({
			   	 title:res,
				 icon:"success"
			   })
			   setTimeout(()=>{
				  fm.getWishLists() 
			   },1000)
			  
		   })
		},
		//前往播放列表
		goView(item){
			let data=this.$store.state.fmWishList;
			data.forEach(val=>{val.Id=val.FMId})
			this.$store.commit('setFmList',data);
			uni.navigateTo({
				url:'/pages/fm/view/view?id='+item.FMId
			})
		}
	},
	computed:{
		list(){
			return this.$store.state.fmWishList;
		}
	}
};
</script>

<style lang="scss" scoped="">

.collect-fm-list {
	padding: 20upx 30upx;
	background: #fff;
    .item {
        margin-bottom: 40upx;
        color: #666;
        .img-box {
            width: 170upx;
            height: 130upx;
            margin-right: 20upx;
            position: relative;
			image{
				width:100%;
				height:100%;
			}
        }
        .content {
            flex: 1;
            font-size: 30upx;
            flex-direction: column;
			justify-content: space-between;
            .title {
                flex: 1;
				font-size: 28upx;
				color:#000;
            }
			.price-box {
			    // height: 30upx;
			    position: relative;
			    font-size: 12px;
			    width: 100%;
			    display: flex;
			    flex-direction: row;
			    justify-content: space-between;
				align-items: flex-end;
			}
			
        }
    }

    
}
</style>
