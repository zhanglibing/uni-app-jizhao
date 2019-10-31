<template>
	<view class="order-evaluate">
		<view v-for="(item,i) in 5" :key="i" @tap="setIndex(i)">
			<image  v-if="i<index"  src="/static/images/start_hover.png" mode="widthFix"></image>
			<image v-else="" src="/static/images/start.png" mode="widthFix"></image>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			index:{
				default:5
			},
			type:{
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			setIndex(i){
				this.$emit('setIndex',{type:this.type,value:i+1})
			}
		}
	}
</script>

<style lang="scss">
.order-evaluate{
	display: flex;
	flex-direction: row;
	view{
		margin-right: 10upx;
	}
	image{
		width:50upx;
		height:50upx;
	}
}
</style>
