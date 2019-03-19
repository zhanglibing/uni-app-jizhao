<template>
	<view>
		<view class="edit-box">
			<view class='input-box'>
				<text>￥</text>
				<input v-model="money" placeholder="请输入充值金额" placeholder-style="font-size:16px" type='digit'></input>
			</view>
			<view class='hasMoney flex-row'>
				<text>备注：最低充值金额1元</text>
			</view>	
		</view>
		<view @tap='submit' class="block-btn"> 立即充值 </view>
	</view>
	
</template>

<script>
import api from '../../../api/user.js';
import wxpay from '../../../api/pay.js';
export default {
    data() {
        return {
            money: ''
        };
    },
    methods: {
        //立即充值
        submit(e) {
            let money = this.money;
            if (!money) {
                return this.$msg.error('请输入充值金额');
            }
//             if (money < 1) {
//                 return this.$msg.error('充值金额最少 1 元');
//             }
            uni.showLoading({
                title: '正在加载'
            });
            wxpay.wxpay({
                ProductId: 0,
                ProductName: '用户充值',
                price: money,
                ProductType: 'CZ',
                redirectUrl: '/pages/money/money'
            });
        }
    }
};
</script>

<style lang="scss">
.edit-box {
    padding:50upx 30upx;
    box-sizing: border-box;
	background: #fff;
	margin-bottom: 50upx;
}


.input-box {
    border-bottom: 1px solid #eee;
    position: relative;
    margin-bottom: 20upx;
	text {
	    position: absolute;
	    bottom: 10upx;
	    left: 0;
	    font-size: 24px;
	}
	
}

input {
    height: 80upx;
    padding-left: 55upx;
    font-size: 30px;
}

.hasMoney {
    font-size: 14px;
    color: #888;
}

</style>
