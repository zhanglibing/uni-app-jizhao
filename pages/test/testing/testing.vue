<template>
	<view>
		<view class="title-box">
			<view class="title">{{ info.Title }}</view>
			<view class="pass">
				<view>{{ info.TestQuantity }}人测过</view>
				<view class="current">
					<text>当前第</text> <view>{{ activeIndex }}</view> /
					<view>{{ info.SubjectModels.length }}</view>
				</view>
			</view>
		</view>
		<!-- 开始测试 -->
		<view class="testing-box">
			<view class="test-list-box"
				v-for="(item, index) in info.SubjectModels"
				:key="index"
				v-if="activeIndex == index + 1"
			>
				<view class="title">{{ activeIndex }}、{{ item.PsychtestSubject.Title }}</view>
				<radio-group class="radio-group" @change="radioChange">
					<label
						class="radio"
						v-for="(child, i) in item.PsychtestSubjectAnswers"
						:key="i"
					>
						<radio
							color="#095389"
							:value="child.Id"
							:checked="results[activeIndex] == child.Id"
						/>{{ child.Title }}
					</label>
				</radio-group>
			</view>
			<view class="btn-box">
				<!-- v-if="activeIndex > 1" -->
				<button  :disabled="activeIndex == 1" @tap="pre">上一题</button>
				<button @tap="getResult" :disabled="isDisalbed" v-if="activeIndex == info.SubjectModels.length">
					查看结果
				</button>
				<button v-else="" @click="next"  :disabled="!results[activeIndex]">下一题</button>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../../api/test.js';
import {getResults} from '../../../common/test.js'
export default {
	data() {
		return {
			id: '',
			info: {},
			activeIndex: 1,
			results: {},
			msg: '',
			isDisalbed:true,
		};
	},
	onLoad(option) {
		this.id=option.id;
		//获取测试题
		api.getTestDetails(this.id).then(res => {
			this.info = res;
		});
	},
	methods: {
		pre() {
			this.activeIndex--;
		},
		//下一题
		next() {
			if (this.results[this.activeIndex]) {
				this.activeIndex++;
			}
		},
		// 选项改变
		radioChange: function(e) {
			let {activeIndex,info}=this;
			let len=info.SubjectModels.length;
			this.results[activeIndex] = e.detail.value;
			if(this.activeIndex == len){
				this.isDisalbed=false;
			}
			if(this.activeIndex < len){
				this.activeIndex ++;
			}
			
		},
		// 查看测试结果
		getResult() {
			let result = getResults(this.info, this.results);
			if(this.info.Rules!=6){
			  result=result.replace(/\n/g, '</br>').replace(/\r/g, '&nbsp;');
			  this.resultMsg=result;
			}
			this.saveMyTest()
		},
		//保存测试结果
		saveMyTest() {
			let { BannerPictureUrl, Category, Description, Rules } = this.info;
			let params = {
				PsychtestId: this.id,
				CustomerAnswer: JSON.stringify({
					imgUrl: BannerPictureUrl,
					Category,
					Description,
					Rules,
					resultMsg: '测试结果:' + this.resultMsg,
					results: this.results
				})
			};

			api.saveUserTest(params).then(res => {
				let {Id, PsychtestId, Title} = res;
				let type = Title == 'SCL-90 症状自测量表' || Rules == 6?'get':'';
				uni.navigateTo({
					url:`../result/result?id=${PsychtestId}&PsychtestId=${Id}&type=${type}`
				})
			});
		}
	},
			//转发话术
	onShareAppMessage(res) {
		
	},
};
</script>

<style lang="scss">
page {
	background: #fff;
	padding: 10px 20px;
	box-sizing: border-box;
}

/* 头部 */

.title-box {
	padding-bottom: 40upx;
	.title {
		font-size: 18px;
		line-height: 30px;
		margin-bottom: 20upx;
	}
	.pass {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 40upx;
		color: #666;
		.current {
			display: flex;
			flex-direction: row;
		}
	}
}

/* 开始测试 选择 */
.testing-box {
	background: #fff;
	box-sizing: border-box;
	.title {
		font-size: 18px;
		margin-bottom: 20px;
		line-height: 30px;
		color: rgb(51, 51, 51);
	}
	label {
		display: block;
		margin-bottom: 15px;
	}
	.test-list-box{
		margin-bottom: 100upx;
	}
}

.btn-box{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	button {
		width:240upx;
		background: #095389;
		color:#fff;
		&[type='primary'] {
			background: #095389;
		}
		&::after {
			border:none;
		}
		&.button-hover {
			background: #095389;
			color: #fff;
		}
		&:disabled{
			background:#B2B2B2;
		}
	}
	
}
</style>
