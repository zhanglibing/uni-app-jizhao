<template>
	<view class="home-box">
		<topic-list :data="list"></topic-list>
		<view class='published'>
		  <navigator url="/pages/discussion/published/published">发帖</navigator>
		</view>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
import api from '../../api/discussion.js';
import topicList from '../../components/topicList.vue';

export default {
    components: {
        topicList
    },
    data() {
        return {
			loadingType:0,
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
        };
    },
    onShow() {
       this.init();
    },

    methods: {
		init(){
			 uni.showLoading({
			    title: '加载中...'
			});
			this.loadingType=0;
			this.list = [];
			this.page = 1;
			this.getlist();
		},
        //获取订单
        async getlist() {
            uni.stopPullDownRefresh();
            let option = {
                page: this.page,
                pageSize: this.pageSize
            };
           
            let { GetAllTopics, Total } = await api.getList(option);
            uni.hideLoading();
			this.list = this.list.concat(GetAllTopics);
			this.total = Total;
			this.loadingType = this.page * this.pageSize >= Total ? 2 : 0;
        }
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
        this.page++;
        this.getList();
    },
			//转发话术
	onShareAppMessage(res) {
		
	},
};
</script>

<style scoped="scoped">
.home-box {
    background: rgba(245, 245, 245, 1);
    box-sizing: border-box;
}

.published {
    width: 110rpx;
    height: 110rpx;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 50%;
    position: fixed;
		bottom:150upx;
		/*ifdef MP-WEIXIN */
    bottom: 100upx;
		/* endif*/
    right:50upx;
    color: #fff;
    text-align: center;
    line-height: 110upx;
    font-size: 30upx;
}
</style>
