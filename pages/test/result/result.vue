<template>
	<view class="test-result">
		<view class="test-title">{{ list[0].Title }}</view>
		<!--  scl 专用结果展示-->
		<view class="scl-box" v-if="view">
			<view class="item-box" v-for="(item,index) in list" :key="index">
				<view class="time">测试时间{{item.CreateDate}}</view>
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
				<view class="time">测试时间{{item.CreateDate}}</view>
				<view class="title">测试结果:</view>
				<view class="testResult-text" v-html="item.CustomerAnswer.resultMsg"></view>
			</view>
		</view>

		<view class="btn-box">
			<view class="goPage flex-row">
				<navigator url="../test" class="submit-btn">更多测试</navigator>
				<navigator url="../../experts/experts" open-type="switchTab" class="submit-btn">找专家咨询</navigator>
			</view>
			<view class="share block-btn">
				<button type="primary" open-type="share">分享结果</button>
			</view>
		</view>
		<testComment :id="id" ref="commentList"></testComment>
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
			console.log(option)
			let {
				CustomerId,
				id
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
	.test-title {
		margin-bottom: 40upx;
		font-size: 16px;
	}

	.test-result {
		padding: 30upx;
		box-sizing: border-box;
		background: #fff;
		min-height: calc(100vh);
	}

	.scl-box {
		.item-box {
			margin-bottom: 50upx;
			padding: 40upx 0;
			border-bottom: 1px solid #bbb;

			&:last-child {
				margin-bottom: 100upx;
				border-bottom: none;
			}

			.time {
				color: #666;
			}
		}

		.title {
			font-size: 16px;
			margin-bottom: 10upx;
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
		border-bottom: 1px solid #bbb;

		&:last-child {
			margin-bottom: 100upx;
			border-bottom: none;
		}

		.time {
			color: #666;
		}

		.title {
			margin-bottom: 20upx;
		}

		.testResult-text {
			line-height: 50upx;
			color: #666;
			font-size: 14px;
		}
	}

	.btn-box {
		margin-top: 150upx;
		width: 540upx;
		margin: 0 auto 100upx;

		.flex-row {
			justify-content: space-between;
			margin-bottom: 80upx;

			.submit-btn {
				width: 240upx;
				height: 80upx;
				line-height: 80upx;
			}
		}

		.share {
			width: 100%;
			background: #f5a623;

			button {
				width: 100%;

				&[type='primary'] {
					background: transparent;
				}

				&::after {
					border: none;
				}

				&.button-hover {
					background: #f5a623;
					color: #fff;
				}
			}

		}

	}
</style>
