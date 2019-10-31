<template>
	<view>
		 <article-list :data="list"></article-list> 
		 <uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import articleList from '../../components/articleList.vue';
	import article from '../../api/article.js';
	export default {
		components:{
			articleList
		},
		data() {
			return {
				loadingType:0,
				list: [],
				Page: 1,
				PageSize: 10,
				total: 0
			};
		},
		onShow() {
			this.init();
		},
		methods: {
			init(){
				uni.showLoading({
					title:"加载中"
				})
				this.Page=1;
				this.list=[];
				this.getList();
			},
			//获取列表
			getList() {
				uni.stopPullDownRefresh();
				var that = this;
				let { Page, PageSize } = this;
				article.getArticleList({ Page, PageSize}).then(res => {
					uni.hideLoading();
					let { list, Total } = res;
					let data = this.list.concat(list);
					this.list = data;
					this.total = Total;
					this.loadingType = Page * PageSize >= Total ? 2 : 0;
				});
			},
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
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
	}
</script>

<style>

</style>
