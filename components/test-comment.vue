<template>
	<view class="comment-list">
		<view class="comment-title">最新评价</view>
		<view class="item flex-row" v-for="(item, index) in list":key="index">
			<view class="avatar-box">
				<image v-if="item.Avatar" :src="item.Avatar"></image>
			</view>
			<view class="content">
				<view class="name">
					<view>{{ item.NickName }}</view>
					<view class="time">{{ item.CreateTime }}</view>
				</view>
				<view class="desc-content"> {{ item.CommentText }} </view>
			</view>
		</view>
		
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import api from '../api/test.js'
	import {moment} from '../common/moment.js'
	export default {
		props: ['id'],
		data() {
			return {
				list:[],
				page:1,
				pageSize:10,
				loadingType:0,
			};
		},
		onLoad() {
			this.getCommentList()
		},
		methods:{
			// 获取列表
			getCommentList(){	
				let option={
					page: this.page,pageSize:this.pageSize,id:this.id
				}
				api.getTestComment(option).then(res=>{
					let {model, TotalCount}=res;		
					this.list = this.list.concat(model);
					this.list.forEach(val=>{
						val.CreateTime=moment(val.CreateDate).fromNow();
						console.log(val.CreateDate)
					})
					this.total = TotalCount;
					this.loadingType = this.page * this.pageSize >= TotalCount ? 2 : 0;
				})
			},
		    onBottom(){
				console.log('shangla')
				if (this.loadingType !== 0) {
					return;
				}
				this.loadingType = 1;
				this.page++;
				this.getCommentList();
			}
		},
	}
</script>

<style lang="scss">
/* 评论区 */
.comment-title{
	height:42px;
	font-size:18px;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(0,0,0,1);
	line-height:42px;
	// padding:0 40upx;
	border-bottom: 1px solid #eee;
	margin-bottom: 30upx;
}
.comment-list {
	.item {
		margin-bottom: 30upx;
		padding-bottom: 20upx;
		.name {
			font-size: 14px;
			margin-bottom: 20upx;
			line-height: 40upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			color:#000;
			.time {
				font-size: 12px;
				color: #666;
			}
		}
		.content{
			flex:1;
		}
	}

	.avatar-box {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 40upx;
		background: #666;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.desc-content {
		font-size: 14px;
	}
}

</style>
