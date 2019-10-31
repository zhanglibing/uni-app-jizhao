<template>
	<view class="">
		<view class="search-warpper">
			<search-model @searching="searching"></search-model>
		</view>
		<view class="test-container">
			<view class="left-wrapper">
				<view class="list">
					<block v-for="(item, index) in classList" :key="index">
						<view :class="{ 'active-item': Category == item.Id }" @tap="selectTab(item.Id)">{{ item.Name }}</view>
					</block>
				</view>
			</view>
			<view class="list-box">
				<block v-for="(item, index) in list" :key="index">
					<view class="item" @tap="goTestView(item.Id)">
						<view class="content">
							<text class="title">{{ item.Title }}</text>
							<view class="desc">{{ item.Description }} </view>
							<view class="info">{{ item.TestQuantity }}人已测试</view>
						</view>
						<view class="img-box">
							<image :src="item.BannerPictureUrl" mode="aspectFill"></image>
						</view>
					</view>
				</block>
			</view>
		</view>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>

</template>

<script>
	import api from '../../api/test.js';
	import searchModel from '../../components/searchModel.vue'
	export default {
		components: {
			searchModel
		},
		data() {
			return {
				loadingType: 0,
				classList: [],
				list: [],
				Category: 0,
				strWhere: '',
				PageIndex: 1,
				PageSize: 10,
				total: 0
			};
		},
		onLoad(option) {
			this.Category = option.id ? option.id : 0;
			uni.showLoading({
				title: "加载中"
			})
			this.getClassList();
			this.init();
		},

		methods: {
			init() {
				this.PageIndex = 1;
				this.list = [];
				this.getList();
			},
			//获取测试分类
			getClassList() {
				api.getClassList().then(res => {
					uni.hideLoading();
					res = [{
						Name: '全部',
						Id: 0
					}, ...res];
					res.map(val => (val.Name = val.Name.slice(0, 2)));
					this.classList = res;
				});
			},
			searching(val) {
				console.log(val)
				this.strWhere = val;
				this.loadingType = 0;
				this.list = [];
				this.PageIndex = 1;
				this.getList()
			},
			//获取测试题列表
			getList() {
				uni.stopPullDownRefresh();
				let {
					PageIndex,
					PageSize,
					Category,
					strWhere
				} = this;
				api.getList({
					PageIndex,
					PageSize,
					Category,
					strWhere
				}).then(res => {
					uni.hideLoading();
					uni.stopPullDownRefresh();
					this.list = this.list.concat(res.Data);
					this.total = res.Total;
					this.loadingType = PageIndex * PageSize >= res.Total ? 2 : 0;
				});
			},

			selectTab(id) {
				if (id == this.Category) {
					return false;
				}
				this.Category = id;
				this.list = [];
				this.PageIndex = 1;
				this.getList();
			},

			//前往测试详情页
			goTestView(id) {
				wx.navigateTo({
					url: `/pages/test/view/view?id=${id}`
				});
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
			this.PageIndex++;
			this.getList();
		},
		//转发话术
		onShareAppMessage(res) {
			return {
				path: '/pages/test/test?id='+this.Category
			}
		},
	};
</script>

<style lang="scss">
	.test-container {
		display: flex;
		flex-direction: row;
		padding-top: 110upx;
	}

	.search-warpper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1;
		background: #F2F2F2;
	}

	/*
 *测试分类
*/

	.left-wrapper {
		position: relative;
		width: 70px;
	}

	.left-wrapper .list {
		position: fixed;
		width: 70px;
		left: 0;
		top: 110upx;
		bottom: 0;
		text-align: center;
		background: #F2F2F2;
	}

	.left-wrapper .list view {
		position: relative;
		line-height: 50px;
		font-size: 14px;
	}

	.active-item {
		font-size: 18px;
		background: #fff;
	}

	.active-item:after {
		content: '';
		background: #1387c2;
		width: 3px;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	/*
 * 测试列表
*/

	.list-box {
		flex: 1;
		overflow-x: hidden;
		background: #fff;
	}

	.item {
		position: relative;
		display: flex;
		flex-direction: row;
		padding: 30upx 20upx;
		border-bottom: 1px solid #eaeaea;
	}

	.item .content {
		position: relative;
		flex: 1;
		font-size: 14px;
		margin-right: 16upx;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.item .content .title {
		line-height: 20px;
		font-size: 14px;
		font-weight: 700;
		color: #000;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 4px;
	}

	.item .content .desc {
		font-size: 12px;
		line-height: 18px;
		color: #8a8a8a;
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.info {
		position: absolute;
		bottom: 0upx;
	}

	.item .img-box {
		width: 200rpx;
		min-width: 200rpx;
		height: 170rpx;
		background: #000;
	}

	.item .img-box image {
		width: 100%;
		min-height: 170upx;
		// height: 100%;
	}
</style>
