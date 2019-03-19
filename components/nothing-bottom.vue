<template>
	<view class='nothing'>
		<view class='line'></view>
		<text>我是有底线的</text>
		<view class='line'></view>
	</view>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped="scoped">
.nothing {
    text-align: center;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 650rpx;
    margin: 0 auto;
		text {
		    width: 260rpx;
		}
		.line {
		    flex: 1;
		    height: 1px;
		    background: #dcdcdc;
		}
}

</style>
