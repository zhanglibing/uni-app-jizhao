<template>
	<view>
		<view class="search-warpper">
			<view class="search-box">
				<icon type="search" size="16"></icon>
				<input  v-model="search" @confirm="searching"
					type="text"
					confirm-type="search" />
				<view class="empty" v-if="search" @tap="empty" >
					<icon class="clear" type="clear" size="16"></icon>
				</view>
			</view>
		</view>
		<view class="content-box" v-if="!list.length&&!search">
			 <view class="title">热门推荐</view>
			 <view class="list-item-box">
				 <view class="item" @click="goGood(item.GoodField)" v-for="(item,index) in GoodFiel" :key="index">{{item.GoodField}}</view>
			 </view>
		</view>
		<view class="nothing" v-if="loadingType==2&&!list.length">
			<view class="desc">没有符合条件的内容</view>
			<navigator url="../experts/experts" class="block-btn">去专题页搜索</navigator>
		</view>
		<expert-list :list="list"></expert-list>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import api from '../../api/user.js';
	import expertList from '../../components/expertList.vue';
	import user from '../../api/consultation.js';
	export default {
		components:{
			expertList
		},
		data() {
			return {
				loadingType:0,
				Page: 1,
				PageSize: 10,
				total: 0,
				search:'',
				GoodFiel:[],
				list:[],
				isGood:'',
			};
		},
		onShow() {
			this.init();
		},
		methods:{
			init(){
				this.list = [];
				this.Page = 1;
				this.loadingType = 0;
				api.getGoodFile().then(res => {
					this.GoodFiel = [{ GoodField: '不限' }, ...res];
				});
			},
			//清空
			empty(){
				this.search='';
				this.isGood=false;
				this.init();
			},
			searching(){
				if(!this.search){
					this.init();
					uni.showToast({
						title:"搜索内容不能为空"
					})
				}
				
				this.list = [];
				this.Page = 1;
				this.getList()
			},
			//获取搜索结果
			getList() {
				let search=this.search=='不限'?'':this.search;
				let option = {
					pageIndex: this.Page,
					pageSize: this.PageSize,
					RealName: this.isGood?'':search,
					GoodFieldid:this.isGood?search:'',
					startPrice:  0,
					endPrice:  0,
					ProvinceId: 0,
				};
				user.getList(option).then(res => {
					uni.stopPullDownRefresh();
					uni.hideLoading();
					let { Total, customers } = res;
					this.list = this.list.concat(customers);
					this.total = Total;
					this.loadingType = this.Page * this.PageSize >= Total ? 2 : 0;
				});
			},
			goGood(item){
				this.search=item;
				this.isGood=true;
				this.searching();
			}
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			this.Page++;
			this.getList();
		},
	}
</script>

<style lang="scss">
.search-warpper{
	padding-bottom: 15upx;
	border-bottom:1px solid rgba(0,0,0,0.1) ;
}
.search-box{
	width:710upx;
	height:56upx;
	background:rgba(255,255,255,1);
	border-radius:10upx;
	border:1px solid rgba(230,230,234,1);
	margin:0 auto;
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding:0 20upx;
	box-sizing: border-box;
	input{
       flex: 1;
	}
	icon{
        margin-right: 20upx;
 	}
	.empty{
		height:100%;
		width:60upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		margin-right: -20upx;
	}
	
}

.content-box{
	padding:35upx 45upx;
	.title{
		font-size: 18px;
		margin-bottom: 30upx;
	}
	.list-item-box{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.item{
			width:180upx;
			height:64upx;
			line-height: 64upx;
			text-align: center;
			background:rgba(216,216,216,1);
			border-radius:8upx;
			margin-bottom: 40upx;
			margin-right: 58upx;
			font-size: 14px;
			&:nth-child(3n){
				margin-right: 0;
			}
		}
	}
}

.nothing{
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	padding-top: 100upx;
	.desc{
		margin-bottom: 60upx;
		font-size: 16px;
	}
	.block-btn{
		width:400upx;
	}
}
</style>
