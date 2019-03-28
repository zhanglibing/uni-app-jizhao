<template>
	<view class="course-box">
		<view class="search-warpper">
			<view class="search-fixed">
				<search-model @searching="searching"></search-model>
				<view class="select-wrapper">
					<view :class="{active:CategoryIds}"  @tap="showSelect('isFilter')"
						>课程类别 <image src="../../static/images/double-arrow.png" mode="widthFix"></image
					></view>
					<view :class="{active:Watchs||IsPrice}"   @tap="showSelect('isOrder')"
						>排序 <image src="../../static/images/double-arrow.png" mode="widthFix"></image
					></view>
				</view>
				
			</view>
			<!-- @tap="close" -->
			<view class="select-box"  v-show="isShowSelect">
		    		<view class="filter-box" v-if="isFilter">
						<view class="list-box">
							<view
								v-for="(item, index) in classList"
								:key="index"
								@tap="setCategory(item.Id)"
								:class="{ active: item.Id == CategoryIds }"
							>
								{{ item.Name}}
							</view>
						</view>
						<view class="submit-btn" @tap="init">确定</view>
		    			
		    		</view>
		    		<view class="order-box" v-if="isOrder">
		    			<view :class="{active:!IsPrice&&!Watchs}" @tap="select('')">不限</view>
		    			<view :class="{active:IsPrice}"  @tap="select('IsPrice')">起步价格由高到低</view>
		    			<view :class="{active:Watchs}"  @tap="select('Watchs')">观看人数由高到低</view>
		    		</view>
		    	</view>
		    
		</view>
		<courseList :data="list"></courseList>
	    <uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
	
</template>

<script>
import courseList from '../../components/courseList.vue';
import searchModel from '../../components/searchModel.vue'
import api from '../../api/course.js';


export default {
    components: {
        courseList,
		searchModel
    },
    data() {
        return {
			loadingType:0,
            list: [],
            Page: 1,
            PageSize: 10,
            total: 0,
			//筛选条件
			strWhere:'',
			Watchs: false,
            IsPrice: false,
			CategoryIds:'',
			
			classList:[],
			isShowSelect:false,
			isFilter:false,
			isOrder:false,
        };
    },
    onLoad() {
        this.init();
		//获取课程分类
		uni.showLoading({
		    title: '加载中',
		    mask: true
		});
		api.getClass(8).then(res => {
			this.classList =res;
		});
    },
    methods: {
		//初始化
		init(){
			this.loadingType=0;
			this.Page = 1;
			this.list = [];
			this.close();
			this.getList();
		},
		//显示总筛选框
		showSelect(type) {
			if (this[type]) {
				this.close();
				return false;
			}
			this.close();
			this.isShowSelect = true;
			this[type] = true;
		},
		//关闭所有
		close() {
			this.isShowSelect = false;
			this.isFilter = false;
			this.isOrder = false;
		},
		//点击排序
		select(name) {
			this.Watchs= false;
			this.IsPrice= false;
			this[name]=true;
			this.init();
		},
		//课程类别筛选
		setCategory(id){
			this.CategoryIds=this.CategoryIds==id?'':id;
		},
		//搜索
		searching(val){
			this.strWhere=val;
			this.init();
		},
        //获取课程列表
        async getList() {
            let { Page, PageSize } = this;
            let { Data, Total } = await api.getList({
                Page,
                PageSize,
				Watchs: this.Watchs,
				IsPrice: this.IsPrice,
				CategoryIds:this.CategoryIds,
				strWhere:this.strWhere,
                IsNew: true
            });
            uni.stopPullDownRefresh();
            uni.hideLoading();
			let data = this.list.concat(Data);
			this.list = data;
			this.total = Total;
			this.loadingType = Page * PageSize >= Total ? 2 : 0;
        },
    },
    onPullDownRefresh() {
		this.init();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
       if (this.loadingType !== 0) {
       	return;
       }
       this.loadingType = 1;
       this.Page++;
       this.getList();
    },
			//转发话术
	onShareAppMessage(res) {
		
	},
};
</script>

<style lang="scss" scoped="">
/* pages/course/course.wxss */
.course-box{
	padding-top: 210upx;
}
.search-warpper{
	padding-bottom: 10upx;
	position: fixed;
	left:0;
	top:0;
	width:100%;
	z-index: 10;
	.search-fixed{
		background: #f2f2f2;
	}
}
.select-wrapper {
		display: flex;
		flex-direction: row;
		background: #fafafa;
		height: 90upx;
		& > view {
			flex: 1;
			border-right: 1px solid #cccccc;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			color: #353535;
			&.active{
				color:#095389;
			}
			image {
				width: 16upx;
				height:28upx;
				margin-left: 20upx;
			}
		}
		
		
		
	}
	
.select-box {
		min-height: calc(100vh - 190upx);
		background: rgba(0,0,0,0.6);
		box-sizing: border-box;
		.order-box {
			padding: 30upx 40upx 80upx;
			background: #fff;
			view {
				line-height: 90upx;
				border-bottom: 1px solid #eeeeee;
				color: #666;
				&:last-child{
					border-bottom: none;
				}
				&.active{
					color:#095389;
				}
			}
		}
		.filter-box {
			padding: 30upx 40upx 80upx;
			background: #fff;
			.list-box{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				margin-bottom: 40upx;
				& > view {
					width: 30%;
					height: 70upx;
					line-height: 70upx;
					margin-right: 5%;
					font-size: 26upx;
					background: #f2f2f2;
					text-align: center;
					margin-bottom: 30upx;
					font-family: PingFangSC-Regular;
					color: rgba(102, 102, 102, 1);
					border: 1px solid #f2f2f2;
					border-radius:6upx;
					box-sizing: border-box;
					&:nth-child(3n){
						margin-right: 0;
					}
					&.active{
						color:#095389;
						border:1px solid #095389;
						background: #fff;
					}
				}
			}
			
			.submit-btn{
				width:100%;
				height:80upx;
				line-height: 80upx;
			}
		}
	}
	

</style>
