<template>
	<view class="page-fm-list">
		 <fm-list :data="list" :isHome="false"></fm-list> 
		 <uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import fmList from '../../../components/fmList.vue';
	import fm from '../../../api/fm.js';
	export default {
		components:{
			fmList
		},
		data() {
			return {
				loadingType:0,
				list: [],
				Page: 1,
				PageSize: 10,
				total: 0,
				Scene: '',
                Mood: ''
			};
		},
		onLoad(option) {
			let {mood,scene}=option;
			this.Scene=scene?scene:'';
			this.Mood= mood?mood:'';
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
				let { Page, PageSize, Scene,Mood} = this;
				fm.getList({ Page, PageSize,Scene,Mood}).then(res => {
					uni.hideLoading();
					let { Data, Total } = res;
					this.list = this.list.concat(Data);
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

<style lang="scss" scoped="">
.page-fm-list{
   padding-top:30upx;
   background: #fff;
}
</style>
