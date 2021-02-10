<template>
	<view class="evaluate-box">
		 <textarea value="" placeholder="请输入评价内容" v-model="CommentContent" />
		 <view class="tishi">你的评价会帮助到其他小伙伴</view>
		 <view class="rateBox"  v-if="!ProductId">
			<view><text>描述服务</text><el-rate type="DescriptionConsistent" :index="DescriptionConsistent" @setIndex="setIndex"></el-rate></view>
			<view><text>解答程度</text><el-rate type="AnswerDegree" :index="AnswerDegree" @setIndex="setIndex"></el-rate></view>
			<view><text>客服态度</text><el-rate type="ServiceAttitude" :index="ServiceAttitude" @setIndex="setIndex"></el-rate></view>
		</view>
		<view class="block-btn" @tap="submit">确定</view>
	</view>
</template>

<script>
	import api from '../../../api/order.js'
	import {checkContent} from '../../../api/login.js';
	import elRate from '../../../components/elRate.vue'
	export default {
		components:{
			elRate
		},
		data() {
			return {
				CommentContent:'',
				DescriptionConsistent:5,
				AnswerDegree:5,
				ServiceAttitude:5,
				Anonymous:false,
				id:''
			};
		},
		onLoad(option){
			this.id=option.id;
		},
		methods:{
			//提交评价
			async submit(){
				let option={
				  CommentContent:this.CommentContent,
				  DescriptionConsistent:this.DescriptionConsistent,
				  AnswerDegree:this.AnswerDegree,
				  ServiceAttitude:this.ServiceAttitude,
				  orderId:this.id,
				  Anonymous:this.Anonymous,
				}
				const {errcode}=await checkContent(this.CommentContent)
				if(errcode=='87014'){
					this.$msg.error('内容含有违法违规内容!');
					return false;
				}
				api.orderEvalute(option).then(res=>{
					uni.showToast({
						title: '评价成功',
						mask: false,
                        icon:"success", 
						duration: 1000
					});
					setTimeout(()=>{
						uni.navigateBack({
							delta: 1
						});
					})
				})
			},
			setIndex(val){
				let {type,value}=val;
				this[type]=value;
			}
		}
	}
</script>

<style lang="scss">
	.evaluate-box{
		textarea{
			background: #fff;
			width:100%;
			margin-bottom: 30upx;
			padding:20upx;
			box-sizing: border-box;
		}
		.tishi{
			padding:30upx 40upx;
			color:#666;
		}
		.rateBox{
			padding:0 40upx;
			color:#666;
			margin-bottom: 60upx;
			&>view{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 20upx;
				text{
					margin-right: 20upx;
					font-size: 16px;
				}
			}
			
		}
	}
		

</style>
