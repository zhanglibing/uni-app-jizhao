<template>
	<view class="test-result">
		<view class="result_content">
			<!-- <view class="test_header" :style="{backgroundImage:`url(${list[0].CustomerAnswer.imgUrl})`}"> -->
			<view class="test_header">
				{{ list[0].Title }}
			</view>
			<view class="result_list_box">
				<!--  scl 专用结果展示-->
				<view class="scl-box" v-if="view">
					<view class="item-box" v-for="(item,index) in list" :key="index">
						<view class="time">
							<image src="https://back.jizhaojk.com/content/images/WeChat/date.png"></image>
							测试时间{{item.CreateDate}}</view>
						<view class="title">您的测试结果<text>{{ item.result.degree }}症状</text></view>
						<view class="table">
							<view class="title">【测评结果分析】</view>
							<view class="list-box">
								<view class="flex-row">
									<view>綜合项</view>
									<view>得分</view>
									<view>常模(均分±标准值)</view>
								</view>
								<view class="flex-row" v-for="(child, i) in item.result.zong" :key="i">
									<view>{{ child.name }}</view>
									<view>{{ child.score }}</view>
									<view>{{ child.standard }}</view>
								</view>
							</view>
							<view class="list-box">
								<view class="flex-row">
									<view>因子项</view>
									<view>得分</view>
									<view>均分</view>
								</view>
								<view class="flex-row" v-for="(child, i) in item.result.yinziArr" :key="i">
									<view>{{ child.name }}</view>
									<view>{{ child.TotalScore }}</view>
									<view>{{ child.divide }}</view>
								</view>
							</view>
						</view>
						<view class="rule-desc">
							您当前的心理状况严重程度为:<text>{{ item.result.degree }}</text>。
							本诊断结果按全国正常人SCL-90常模（N=1388）为依据评定（1-5级评分）
							仅作为参考而非绝对标准，应根据临床（要害）症状来划分。如有疑问，或已经影响到你的正常生活、学习以及工
							作，
							<view>
								建议尽早向心理专家咨询，进行专业的心理辅导。
								切勿不加重视，贻误机会，导致严重后果。
							</view>
						</view>
					</view>
				
				</view>
				
				<view v-if="list&&!view">
					<view class="nomal-box" v-for="(item,index) in list" :key="index">
						<view class="time">
							<image src="https://back.jizhaojk.com/content/images/WeChat/date.png"></image>
							测试时间{{item.CreateDate}}</view>
						<view class="title">测试结果:</view>
						<view class="testResult-text" v-html="item.CustomerAnswer.resultMsg"></view>
					</view>
				</view>
				
				<view class="btn_box1">
					<navigator url="../../experts/experts" open-type="switchTab" class="test-btn">
						<image src="https://back.jizhaojk.com/content/images/WeChat/find.png" mode=""></image>
						找专家咨询
					</navigator>
					<navigator url="../test" class="test-btn">
						<image src="https://back.jizhaojk.com/content/images/WeChat/more.png" mode=""></image>
						更多测试
					</navigator>
					<button open-type="share" class="test-btn">
						<image src="https://back.jizhaojk.com/content/images/WeChat/share.png" mode=""></image>
						分享结果
					</button>
				</view>
				
			</view>
			
		</view>
		<view class="commont_box" v-if="id">
			<testComment :id="id" :ids="id" ref="commentList"></testComment>
		</view>
		
		<kefu></kefu>
	</view>
</template>

<script>
	import api from '../../../api/test.js';
	import {
		getResults
	} from '../../../common/test.js';
	import {
		getUserId
	} from '../../../api/ajax.js';
	import testComment from '../../../components/test-comment.vue'
	export default {
		components: {
			testComment
		},
		data() {
			return {
				view: null, //测试题数据
				id: '',
				list: null,
				CustomerId: '',
			};
		},

		onLoad(option) {
			let {
				CustomerId,
				id,
			} = option;
			this.id = id;
			this.CustomerId = CustomerId ? CustomerId : getUserId();

			this.getList()
		},

		methods: {
			//获取详情
			async getView() {
				let view = await api.getTestDetails(this.id);
				this.list.map(val => {
					let {
						resultMsg,
						results
					} = val.CustomerAnswer;
					val.result = getResults(view, results);
					
					return val;
				})
				this.view = view;
			},
			// 获取列表
			getList() {
				let option = {
					page: 1,
					pageSize: 5000,
					PsychtestId: this.id,
					CustomerId: this.CustomerId,
				}

				api.getUserTestList(option).then(res => {
					uni.hideLoading();
					let {
						answers,
						TotalCount
					} = res;
					//小程序 换行标签 <br>
					answers.forEach(val=>{
						val.CustomerAnswer.resultMsg=val.CustomerAnswer.resultMsg?val.CustomerAnswer.resultMsg.replace(/<\/br>/g, '<br>'):''
					})
					
					this.list = answers;
					if (answers.length && answers[0].PsychtestId == 54) {
						this.getView()
					}

				})
			},
		},
		//转发话术
		onShareAppMessage(res) {
			let {
				Title,
				CustomerAnswer
			} = this.list[0];
			let img = CustomerAnswer.imgUrl;
			let obj = {
				Title
			};
			if (img) {

				obj.path = `/pages/test/result/result?id=${this.id}&CustomerId=${this.CustomerId}`
				obj.imageUrl = img;
			}
			return obj;
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			this.$refs.commentList.onBottom()
		},
	};
</script>

<style lang="scss" scoped="">
	.test-result {
		padding: 30upx;
		box-sizing: border-box;
		background: #F6F6F6;
		min-height: calc(100vh);
	}
	.result_content{
		background: #fff;
		.result_list_box{
			padding:0 20upx;
		}
	}
	.test_header{
		height:347upx;
		background: url('https://back.jizhaojk.com/content/images/WeChat/test_bg.png') center center no-repeat;
	    background-size: cover;
		display: flex;
		align-items: center;
        justify-content:center;
		margin-bottom: 40upx;
		font-size: 16px;
		color:#fff;
		padding:0 30upx;
	}
	



	.scl-box {
		.item-box {
			margin-bottom: 50upx;
			padding: 40upx 0;

			&:last-child {
				margin-bottom: 100upx;
				border-bottom: none;
			}

			.time {
				color: #666;
				font-size: 24upx;
				margin-bottom: 32upx;
				display: flex;
				align-items: center;
				image{
					width:34upx;
					height:34upx;
					margin-right: 30upx;
				}
			}
		}

		.title {
			margin-bottom: 32upx;
			color:#585858;
			font-size: 32upx;
		}

		.table {
			.flex-row {
				&>view {
					flex: 1;
					border-bottom: 1px solid #f2f2f2;
					border-right: 1px solid #f2f2f2;
					line-height: 46upx;
					text-align: center;
					font-size: 12px;
					color: #666;
				}
			}

			.list-box {
				margin-bottom: 40upx;
				border-top: 1px solid #f2f2f2;
				border-left: 1px solid #f2f2f2;
			}
		}

		.rule-desc {
			color: #666;
			font-size: 14px;
			line-height: 50upx;

			text {
				color: #000;
				font-size: 16px;
			}
		}
	}

	.nomal-box {
		padding: 30upx 0;

		&:last-child {
			margin-bottom: 100upx;
			border-bottom: none;
		}

		.time {
			color: #666;
			font-size: 24upx;
			margin-bottom: 32upx;
			display: flex;
			align-items: center;
			image{
				width:34upx;
				height:34upx;
				margin-right: 30upx;
			}
		}

		.title {
			margin-bottom: 32upx;
			color:#585858;
			font-size: 32upx;
		}

		.testResult-text {
			line-height: 50upx;
			color: #666;
			font-size: 24upx;
		}
	}

    .btn_box1{
		display: flex;
		justify-content: space-around;
		margin-bottom: 18upx;
		padding-bottom:60upx;
		button::before {
		  border:0;
		  border:none;
		}
		button::after {
		  border:0;
		  border:none;
		}
		.test-btn{
			display: flex;
			flex-direction: column;
			align-items: center;
			color:#9A9A9A;
			font-size: 26upx;
			border: none;
			line-height: 1;
			padding: 0;
			background: #fff;
			margin:0;

			image{
				width:104upx;
				height:104upx;
				margin-bottom: 20upx;
			}
		}
	}
	.commont_box{
		padding:40upx 30upx;
		width:750upx;
		box-sizing: border-box;
		margin-left: -30upx;
		background: #fff;
	}
</style>
