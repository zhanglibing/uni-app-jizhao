<template>
	<view class="test-result">
		<view class="test-title">{{ httpResult.Title }}</view>
		<!--  scl 专用结果展示-->
		<view class="scl-box" v-if="!resultMsg&& result">
			<view class="title"
				>您的测试结果<text>{{ result.degree }}症状</text></view
			>
			<view class="table">
				<view class="title">【测评结果分析】</view>
				<view class="list-box">
					<view class="flex-row">
						<view>綜合项</view> <view>得分</view> <view>常模(均分±标准值)</view>
					</view>
					<view class="flex-row" v-for="(item, index) in result.zong" :key="index">
						<view>{{ item.name }}</view> <view>{{ item.score }}</view>
						<view>{{ item.standard }}</view>
					</view>
				</view>
				<view class="list-box">
					<view class="flex-row">
						<view>因子项</view> <view>得分</view> <view>均分</view>
					</view>
					<view class="flex-row" v-for="(item, index) in result.yinziArr" :key="index">
						<view>{{ item.name }}</view> <view>{{ item.TotalScore }}</view>
						<view>{{ item.divide }}</view>
					</view>
				</view>
			</view>
			<view class="rule-desc">
				您当前的心理状况严重程度为:<text>{{ result.degree }}</text>。
				本诊断结果按全国正常人SCL-90常模（N=1388）为依据评定（1-5级评分）
				仅作为参考而非绝对标准，应根据临床（要害）症状来划分。如有疑问，或已经影响到你的正常生活、学习以及工
				作，
				<view>
					建议尽早向心理专家咨询，进行专业的心理辅导。
					切勿不加重视，贻误机会，导致严重后果。
				</view>
			</view>
		</view>
		<view class="nomal-box" v-else="">
			<view class="title">测试结果:</view>
			<view class="testResult-text" v-html="resultMsg"></view>
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
	</view>
</template>

<script>
import api from '../../../api/test.js';
import { getResults } from '../../../common/test.js';
export default {
	data() {
		return {
			view: {}, //测试题数据
			httpResult: {},
			result: null,
			resultMsg: '',
			option: {}
		};
	},
	onLoad(option) {
		this.option = option;
	},
	onShow() {
		this.getView();
	},
	methods: {
		//获取详情
		async getView() {
			let { type, id } = this.option;
			if (type) {
				this.view = await api.getTestDetails(id);
			}
			this.getMyTest();
		},
		//获取我的测试结果
		getMyTest() {
			api.getUserTest(this.option.PsychtestId).then(res => {
				this.httpResult = {...res,...res.CustomerAnswer};
				let { resultMsg, results } = res.CustomerAnswer;
				this.resultMsg = resultMsg;
				if (this.option.type) {
					this.resultMsg = '';
					this.result = getResults(this.view, results);
				}
			});
		}
	},
	//转发话术
	onShareAppMessage(res) {
// 		if (res.from === 'button') {
// 		  // 来自页面内转发按钮
// 		  console.log(res.target)
// 		}
        let title=this.httpResult.Title;
		let img=this.httpResult.imgUrl;
		let {id,type,PsychtestId}=this.option;
		let obj={title};
		if(img){
			obj.imageUrl=img;
		}
		return obj;
  },
  onUnload() {
  	// this.$store.commit('setTestResult',null)
  }
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
	 margin-bottom: 150upx;
	.title {
		font-size: 16px;
		margin-bottom: 10upx;
	}
	.table {
		.flex-row {
			& > view {
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
	margin-bottom: 150upx;
	.title {
		margin-bottom: 40upx;
	}
	.testResult-text {
		line-height: 50upx;
		color: #666;
		font-size: 14px;
	}
}

.btn-box {
	margin-top: 150upx;
	width:540upx;
	margin:0 auto;
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
		width:100%;
		background: #f5a623;
		button {
			width: 100%;
			&[type='primary'] {
				background: transparent;
			}
			&::after {
				border:none;
			}
			&.button-hover {
				background: #f5a623;
				color: #fff;
			}
		}
		
	}

}
</style>
