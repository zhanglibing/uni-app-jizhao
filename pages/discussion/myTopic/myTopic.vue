<template>
	 <view class='list-bot'>
    <topic-list :data="list"></topic-list>
  </view>
</template>

<script>
import api from '../../../api/discussion.js';
import TopicList from '../../../components/topicList.vue';
export default {
    components: {
        TopicList
    },
    data() {
        return {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10
        };
    },
    methods: {
        //获取订单
        getlist() {
            let { page, pageSize } = this;
            uni.showLoading({
                title: '加载中...'
            });
            api.getMyTopic( {
                page,
                pageSize
            }).then(res => {
							console.log(res)
                uni.hideLoading();
                uni.stopPullDownRefresh();
                let list = this.list;
                this.list=list.concat(res);
            });
        },

        //前往订单详情页面
        goView(e) {
            uni.navigateTo({
                url: '/pages/discussion/view/index?id=' + e.currentTarget.dataset.id
            });
        }
    },
    onShow() {
        this.list = [];
        this.page = 1;
        this.getlist();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.onShow();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        let { page, pageSize, total } = this;
        if (page * pageSize < total) {
            this.page = page + 1;
            this.getlist();
        }
    }
};
</script>

<style lang="scss" scoped="scoped">
.list-box {
    background: rgba(245, 245, 245, 1);
    padding: 30rpx;
    box-sizing: border-box;
}
</style>
