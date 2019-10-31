<template>
	<view class="course-list-com">
		<view :data-id='item.Id' @tap="goView" class='item flex-row' v-for="(item,index) in data.length?data:list" :key="index">
			<view class='img-box'>
				<image :src="item.BannerPictureUrl"></image>
			</view>
			<view class='content flex-column'>
				<view class='title textOver2'>
					{{item.Title}}
				</view>
				<view class="watchs">观看人数:{{item.Watchs}}</view>
				<view class='price-box'>
					<text>{{item.CreateDate}}</text>
					<text class='price' v-if="!item.Price||platform==='ios'">免费课程</text>
					<text class='price' v-else="">￥{{item.Price}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../api/course.js';
export default {
	props: {
		data:{
			type:Array,
			default:()=>{
				return []
			}
		},
		pageSize:{
			type:Number,
			default:10
		}
	},
	data(){
		return{
			list:[],
			platform:''
		}
	},
	onLoad(){
		//发现模块展示
		if(!this.list.length){
			 this.getList();
		}
		
	},
    methods: {
		async getList(){
			let { Page, PageSize } = this;
			let { Data, Total } = await api.getList({
			    Page:1,
			    PageSize:5,
				IsShow:true,
				IsPrice: false,
				CategoryId:0,
			    IsNew: false,
				CustomeType: 1
			});
			Data.forEach(val=>{
				val.CreateDate=val.CreateDate.slice(0,10);
			})
			this.list = Data;
		},
        goView(e) {
            wx.navigateTo({
                url: '/pages/course/view/view?id=' + e.currentTarget.dataset.id
            });
        }
    },
	created(){
		this.platform=this.$store.state.platform;

	}
};
</script>

<style lang="scss">
.course-list-com {
	padding: 0 30upx 30upx;
	background: #fff;
    .item {
        margin-bottom: 40upx;
        color: #666;
		&:last-child{
			margin-bottom: 0;
		}
        .img-box {
            width: 270upx;
            height: 180upx;
            margin-right: 20upx;
            position: relative;
        }
        .content {
            flex: 1;
            font-size: 30upx;
            flex-direction: column;
			justify-content: space-between;
            height: 180upx;
            .title {
                flex: 1;
				line-height: 45upx;
				max-height: 90upx;
            }
		
			.watchs{
				font-size: 10px;
				color:#666;
				// margin-bottom: 15upx;
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
