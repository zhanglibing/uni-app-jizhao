<template>
	<view>
		<view class="select-box">
			<view class="block" @click="show">
				<view class="select-name">
					<view class="line"></view>
					{{activeObj.name}}
				</view>
				<image v-if="isShowSelect" src="../../static/images/certi/up.png" mode=""></image>
				<image v-else="" src="../../static/images/certi/down.png" mode=""></image>
			</view>
			<view class="show-search" v-if="isShowSelect">
				<view class="item"  @click="select(item)" v-for="item in classType" :key="item.id">
					<view class="img">
						<image :src="item.img" mode=""></image>
					</view>
					<view class="desc">
						<view class="name">{{item.name}}</view>
						<view class="btn">
							点击查看
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="search-box">
			<view class="input-box">
				<input type="text" v-model="CertificateNo" placeholder="请输入证书编号">
				<input type="text" v-model="UserName" placeholder="请输入姓名" />
				<input type="text" v-model="IDCard" placeholder="请输入身份证号" v-if="CertificateType!=27" />
			</view>
			<view class="desc" v-if="CertificateType!=27">注：以上三项输入任意两项即可查询。</view>
			<view class="search-btn" @click="search">一键查询</view>

		</view>
		<view class="link-box">
			<button class="btn" open-type="contact">考证报名</button>
			<button class="btn" @click="call">报考答疑</button>
			<button class="btn" @click="goInfo">证书介绍</button>
			<button class="btn" open-type="contact">了解更多</button>
		</view>
		<view class="support">
			搜索结果由幸福谋方全力支持
		</view>
	</view>
</template>

<script>
	import api from '../../api/certificate.js'
	export default {
		data() {
			return {
				isHasHttp: false,
				isShowSelect: false,
				info: null,
				classType: [{
						id: 1062,
						name: '《心理健康辅导员资格证书》',
						img: '../../static/images/certi/1.png'
					},
					{
						id: 27,
						name: '《中国心理卫生协会》会员证',
						img: '../../static/images/certi/2.png'
					},
				],
				activeObj: {
					id: 27,
					name: '《中国心理卫生协会》会员证'

				},
				UserName: '',
				CertificateNo: '',
				CertificateType: 27,
				IDCard: '',
			}

		},
		methods: {
			show(obj) {
				this.isShowSelect = !this.isShowSelect;
			},
			select(obj) {
				this.isShowSelect = false;
				this.activeObj = obj;
				this.CertificateType = obj.id;
			},
			//搜索
			async search() {
				
				let {
					UserName,
					CertificateNo,
					IDCard
				} = this;
				let option = {
					UserName,
					CertificateNo,
					CertificateType: this.CertificateType,
					IDCard,
				}
				if (Number(Boolean(UserName)) + Number(Boolean(CertificateNo)) + Number(Boolean(IDCard)) < 2) {
					let msg=this.CertificateType==27?'两项必须都填':'以上三项输入任意两项即可查询'
					uni.showToast({
						title:msg,
						icon:'none'
					})
					return false;
				}
				try {
					let res = await api.getList(option);
					if(res.Data.length){
						let data=res.Data[0];
						data.CertificateNo=data.CertificateNo.slice(0,10)
						console.log(data)
						this.$store.commit('setCertiResult',data)
						uni.navigateTo({
							url:'./view/view'
						})
					}else{
						uni.showToast({
							title:'没有搜索到内容',
							icon:'none'
						})
					}
					
					this.isHasHttp = true;
				} catch (e) {
					this.isHasHttp = true;
				}
			},
		    //前往课程详情
			goInfo(){
				let id=this.activeObj.id==27?2282:13
				uni.navigateTo({
					url:'/pages/course/view/view?id='+id
				})
			},
			call(){
				uni.makePhoneCall({
					phoneNumber:'4001661085'
				})
			}
		}
	}
</script>

<style lang="scss" scoped="">
	// 筛选框
	.select-box {
		margin-bottom: 40upx;

		.block {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			background: #fff;
			height: 126upx;
			padding: 0 40upx;
			font-size: 30upx;

			.select-name {
				display: flex;
				flex-direction: row;
				align-items: center;

				.line {
					width: 11upx;
					height: 52upx;
					background: rgba(3, 137, 228, 1);
					border-radius: 6upx;
					margin-right: 15upx;
				}
			}

			image {
				width: 38upx;
				height: 20upx;
			}

		}

		.show-search {
			position: fixed;
			top: 126upx;
			left: 0;
			bottom: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.6);
			z-index: 10;

			.item {
				display: flex;
				flex-direction: row;
				align-items: center;
				background: #fff;
				padding: 20upx 40upx;
				border-top: 1px solid #D5D5D5;

				.img {
					margin-right: 50upx;

					image {
						width: 126upx;
						height: 170upx;
					}
				}

				.desc {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.name {
						color: #0389E4;
						margin-bottom: 30upx;
					}

					.btn {
						width: 185upx;
						height: 67upx;
						background: rgba(3, 137, 228, 1);
						border-radius: 41upx;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 24upx;
					}
				}
			}
		}
	}


	.search-box {
		background: #fff;
		padding: 40upx 40upx 60upx;
        margin-bottom: 30upx; 
		.input-box {
			input {
				box-shadow: 0px 0px 13upx 0px rgba(213, 213, 213, 0.5);
				border-radius: 10upx;
				height: 90upx;
				margin-bottom: 30upx;
				box-sizing: border-box;
				padding-left: 30upx;
			}
		}
		.desc {
			margin-bottom: 60upx;
			color: #BBBBBB;
			font-size: 28upx;
		}
	}

	.search-btn {
		width: 545upx;
		height: 94upx;
		background: linear-gradient(90deg, rgba(64, 183, 255, 1) 0%, rgba(5, 140, 255, 1) 100%);
		border-radius: 47upx;
		color: #fff;
		font-size: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}

	.link-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 40upx 70upx;
		justify-content: space-between;

		.btn {
			min-width: 250upx;
			background: #fff;
			margin-bottom: 50upx;
			line-height: 70upx;
			text-align: center;
			border-radius: 40upx;
			font-size: 28upx;
			color: #0389E4;
			&::after{
				border:none;
			}
		}
	}
    .support{
		position: fixed;
		bottom:100upx;
		width:100%;
		text-align: center;
		color:#bbb;
	} 
</style>
