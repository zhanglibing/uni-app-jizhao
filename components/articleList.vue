<template>
	<view class="article-list-com">
		<view @tap="goView(item)"  class='item flex-row' v-for="(item,index) in showData" :key="index">
			<view class='img-box' >
				<image :src="item.imgPath"></image>
			</view>
			<view class='content flex-column'>
				<view class='title textOver2'>
					{{item.Title}}
				</view>
				<view class='price-box'>
					<text>{{item.CreatedOnUtc}}</text>
					<text class='views'>阅读数:{{item.Views}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import article from '../api/article.js';
export default {
    props: {
		datas:{
			type:Array,
			default:()=>{
				return []
			}
		},
		pageSize:{
			type:Number,
			default:10
		},
		isHome:{
			type:Boolean,
			defaule:false,
		}
	},
	data(){
		return{
			list:[]
		}
	},
	created(){
		
		if(this.isHome){
			article.getArticleList({PageSize:this.pageSize}).then(res=>{
				this.list = res.list;
			})
		}
		
	},
	computed:{
		showData(){
			return this.datas.length?this.datas:this.list;
		}
	},
    methods: {
        goView({Id,CustomerId}) {
            uni.navigateTo({
                url: `/pages/article/view/view?id=${Id}&userId=${CustomerId}`
            });
        },
		
    }
};
</script>

<style lang="scss">
.article-list-com {
	padding: 0 30upx 20upx;
	background: #fff;
    .item {
        margin-bottom: 40upx;
        color: #666;
       
        .img-box {
            width: 180upx;
            height: 120upx;
            margin-right: 20upx;
            position: relative;
        }
        .content {
            flex: 1;
            font-size: 30upx;
            flex-direction: column;
            height: 120upx;
            .title {
                flex: 1;
				font-size: 32upx;
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
        
    }

    .img-box image {
        width: 100%;
        height: 100%;
    }
}
</style>
