<template>
	<view class="address-select-box">
		<picker mode="multiSelector" @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange"
		 :value="multiIndex" :range="multiArray" range-key="areaname">
			<view class="picker">
				{{address.Address2}}
			</view>
		</picker>
	</view>
	
</template>

<script>
	import api from '../api/user.js';
	export default {
		data() {
			return {
				PAC: [], //存放省市区
				multiArray: [],
				multiIndex: [2, 1, 1],
				address:{}
			};
		},
		onShow() {
			let { ProvinceId, CityId, AreaId, Address2 } = this.$store.state.userInfo;
			this.address = {
			    Pid: ProvinceId ? ProvinceId + '' : '',
			    Cid: CityId ? CityId + '' : '',
			    Aid: AreaId ? AreaId + '' : '',
			    Address2: Address2?Address2:'请选择'
			};
			//获取省市区
			api.getPAC().then(res => {
				let {Pid,Cid,Aid}=this.address;
				let p = res.filter(val => val.parentid == '0');
				let c = res.filter(val => val.parentid == Pid);
				let a = res.filter(val => val.parentid == Cid);
				let indexs = [];
				p.forEach((val, index) => {
					if (val.childid == Pid) {
						indexs[0] = index;
					}
				});
				c.forEach((val, index) => {
					if (val.childid == Cid) {
						indexs[1] = index;
					}
				});
				a.forEach((val, index) => {
					if (val.childid == Aid) {
						indexs[2] = index;
					}
				});
				let arr = [p, c, a];
				this.PAC = res;
				this.multiArray = arr;
				this.multiIndex = indexs;
			});
		},
		methods: {
		    //地址筛选确认
		    bindMultiPickerChange(e) {
		        let indexs = e.detail.value;
		        let { multiArray } = this;
		        let p = multiArray[0][indexs[0]];
		        let c = multiArray[1][indexs[1]];
		        let a = multiArray[2][indexs[2]];
		
		        let str = `${p.areaname}-${c.areaname}-${a.areaname}`;
		        this.address = {
					Pid: p.childid,
					Cid: c.childid,
					Aid: a.childid,
					Address2: str
		        };
				this.$emit('setAddress',this.address)
		    }, 
		    //单行筛选事件
		    bindMultiPickerColumnChange(e) {
		        let { column, value } = e.detail;
		        let { PAC, multiArray, multiIndex } = this;
		        multiIndex[column] = value;
		        if (column == 0) {
		            //省份切换
		            let ProvinceId = multiArray[column][value].childid;
		            let a = PAC.filter(val => val.parentid == ProvinceId);
		            multiArray[column + 1] = a;
		
		            multiIndex[column + 1] = 0;
		            multiIndex[column + 2] = 0;
		            let CityId = multiArray[column + 1][0].childid;
		            let c = PAC.filter(val => val.parentid == CityId);
		            multiArray[column + 2] = c;
		        }
		        if (column == 1) {
		            //市切换
		            let CityId = multiArray[column][value].childid;
		            let c = PAC.filter(val => val.parentid == CityId);
		            multiArray[column + 1] = c;
		        }
				console.log(multiIndex)
		        this.multiIndex = multiIndex;
				//先清空  微信小程序不及时跟新最新数据
				this.multiArray=[]; 
		        this.multiArray = multiArray;
		    }
		},
	}
</script>

<style lang="scss" scoped="">
	.address-select-box{
		width:100%;
		min-height: 70upx;
	}
picker{
	width:100%;
	height:100%;
	min-height: 70upx;
	.picker{
		width:100%;
		min-height: 70upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
}
</style>
