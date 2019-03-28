<template>
	<view class="expert-box">
		<view class="top-search-box">
			<view class="search-warpper">
				<search-model @searching="searching"></search-model>
				<view class="select-wrapper">
					<view :class="{active:GoodFieldid}" @tap="showSelect('isFilter')"
						>主题 <image src="../../static/images/double-arrow.png" mode="widthFix"></image
					></view>
					<view @tap="close"  :class="{active:ProvinceId}" 
						>
						  <picker @change="PickerChange" :value="index" :range="array"  range-key="areaname">
							<view class="picker">
							  {{addressDesc}}
							  <image src="../../static/images/double-arrow.png" mode="widthFix"></image>
							</view>
						  </picker>
					</view>
					<view @tap="showSelect('isOrder')"
						>排序 <image src="../../static/images/double-arrow.png" mode="widthFix"></image
					></view>
					<view :class="{active:Gender}" @tap="showSelect('isSex')"
						>筛选 <image src="../../static/images/double-arrow.png" mode="widthFix"></image
					></view>
				</view>
			</view>
			 <!-- @tap="close" -->
			<view class="select-box" v-show="isShowSelect">
				<!-- 擅长领域筛选 -->
				<view class="filter-box" v-if="isFilter">
					<view class="list-box">
						<view
							v-for="(item, index) in GoodFiel"
							:key="index"
							@tap="setGoodFieldid(item.GoodField)"
							:class="{ active: item.GoodField == GoodFieldid }"
						>
							{{ item.GoodField }}
						</view>
					</view>
					<view class="submit-btn" @tap="init">确定</view>
				</view>
				<!-- 性别筛选 -->
				<view class="filter-box" v-if="isSex">
					<view class="list-box">
						<view
							v-for="(item, index) in sexOption"
							:key="index"
							@tap="setSex(item.val)"
							:class="{ active: item.val == Gender }"
						>
							{{ item.name }}
						</view>
					</view>
					<view class="submit-btn" @tap="init">确定</view>
				</view>
				<!-- 排序筛选 --> 
				<view class="order-box" v-if="isOrder">
					<view @tap="select({}, '')">不限</view>
					<view @tap="select({ WorkingYear: false }, '从业年限')">从业年限从低到高</view>
					<view @tap="select({ WorkingYear: true }, '从业年限')">从业年限从高到低</view>
					<view @tap="select({ ConsultingHours: false }, '服务人数')"
						>服务人数从低到高</view
					>
					<view @tap="select({ ConsultingHours: true }, '服务人数')"
						>服务人数从高到低</view
					>
				</view>
			</view>
		</view>
        <expert-list :list="list"></expert-list>
		<uni-load-more v-if="list.length" :loadingType="loadingType"></uni-load-more>
	</view>
</template>

<script>
import searchModel from '../../components/searchModel.vue';
import expertList from '../../components/expertList.vue';
import api from '../../api/consultation.js';
import user from '../../api/user.js';
export default {
	components: {
		searchModel,
		expertList
	},
	data() {
		return {
			loadingType: 0,
			isFilter: false,
			isSex: false,
			isOrder: false,
			isShowSelect: false,
			activeOrderName: '',
			GoodFiel: [],
			sexOption:[
				{name:'不限',val:''},
				{name:'男专家',val:'M'},
				{name:'女专家',val:'F'},
			],
			GoodFieldid: '', // 擅长领域
			RealName: '', //搜索值
			Gender:'', //性別
			list: [],
			Page: 1,
			PageSize: 10,
			total: 0,
			Price: '',
			sex: '',
			ProvinceId:0,
			activeSelect: {},
			desc: true, //升序降序
			array: [],
			index:0,
			
		};
	},
	onLoad() {
		this.init();
		user.getGoodFile().then(res => {
			this.GoodFiel = [{ GoodField: '不限' }, ...res];
		});
		 //获取省市区
		user.getPAC().then(res => {
			let p = res.filter(val => val.parentid == '0');
			this.array = [{areaname:'所有',childid:0},...p];

		});
	},

	methods: {
		//地区搜索
		PickerChange(e) {
			let index=e.detail.value
			this.index=index;
			this.ProvinceId=this.array[index].childid;
			this.init();
		},
		init(){
			this.close();
			this.list = [];
			this.Page = 1;
			this.loadingType = 0;
			this.getList();
		},
		//显示总筛选框
		showSelect(type) {
			if (this[type]) {
				this.close();
				return false;
			}
			this.close();
			this.isShowSelect = true;
			this[type] = true;
		},
		//关闭所有
		close() {
			this.isShowSelect = false;
			this.isFilter = false;
			this.isSex = false;
			this.isOrder = false;
		},
		//擅长领域筛选
		setGoodFieldid(item){
			this.GoodFieldid=this.GoodFieldid==item?'':item;
		},
		//性别筛选
		setSex(val){
			this.Gender=this.Gender==val?'':val;
		},
		//点击排序
		select(obj, name) {
			this.activeOrderName = name;
			if (name) {
				this.activeSelect = obj;
				this.desc = Object.values(obj)[0];
			}
			this.init();
		},
		//搜索
		searching(val) {
			this.RealName = val ? val : '';
			this.Page = 1;
			this.list = [];
			this.loadingType = 0;
			this.getList();
		},
		getList() {
			let option = {
				pageIndex: this.Page,
				pageSize: this.PageSize,
				RealName: this.RealName,
				GoodFieldid: this.GoodFieldid == '不限' ? '' : this.GoodFieldid,
				startPrice: this.Price ? this.Price.split('-')[0] : 0,
				endPrice: this.Price ? this.Price.split('-')[1] : 0,
				ProvinceId: this.ProvinceId,
				...this.activeSelect
			};
			if(this.Gender){
				option.Gender=this.Gender;
			}
			api.getList(option).then(res => {
				uni.stopPullDownRefresh();
				uni.hideLoading();
				let { Total, customers } = res;
				this.list = this.list.concat(customers);
				this.total = Total;
				this.loadingType = this.Page * this.PageSize >= Total ? 2 : 0;
			});
		},
		
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {
		this.init();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		if (this.loadingType !== 0) {
			return;
		}
		this.loadingType = 1;
		this.Page++;
		this.getList();
	},
	computed:{
		addressDesc(){
			let name=this.array[this.index].areaname;
			if(name.length>3){
				name=name.slice(0,3)+'...';
			}
			if(!this.ProvinceId){
				name="地区";
			}
			return name;
		}
		
	},
			//转发话术
	onShareAppMessage(res) {
		
	},
};
</script>

<style lang="scss">
.expert-box {
	padding-top: 210upx;
}
.top-search-box {
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 10;
	padding-bottom: 20upx;
	.search-warpper{
		background: #f2f2f2;
	}
	.select-wrapper {
		display: flex;
		flex-direction: row;
		height: 90upx;
		& > view {
			flex: 1;
			border-right: 1px solid #cccccc;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			color: #353535;
			&.active{
				color: #095389;
			}
			image {
				width: 16upx;
				height:28upx;
				margin-left: 20upx;
			}
			picker{
				width:100%;
				height:100%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				font-size: 16px;
				.picker{
					width:100%;
					flex: 1;
					height:100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: 16px;
				}
			}
		}
	}
}
.select-box {
	background: rgba(0,0,0,0.6);
	min-height: calc(100vh - 100upx);
	.order-box {
		padding: 40upx 40upx;
		background: #fff;
		box-sizing: border-box;
		view {
			line-height: 90upx;
			border-bottom: 1px solid #eeeeee;
			color: #666;
			&:last-child{
				border-bottom: none;
			}
		}
	}
	.filter-box {
		padding: 40upx 40upx;
		background: #fff;
		box-sizing: border-box;
		.list-box {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			& > view {
				width: 30%;
				height: 60upx;
				line-height: 60upx;
				margin-right: 3%;
				font-size: 26upx;
				background: #f2f2f2;
				text-align: center;
				margin-bottom: 30upx;
				font-family: PingFangSC-Regular;
				color: rgba(102, 102, 102, 1);
				border: 1px solid #f2f2f2;
				border-radius: 6upx;
				box-sizing: border-box;
				&:nth-child(3n) {
					margin-right: 0;
				}
				&.active {
					color: #095389;
					border: 1px solid #095389;
					background: #fff;
				}
			}
		}
	    .submit-btn{
	    	width:100%;
	    	height:80upx;
	    	line-height: 80upx;
	    }
	}
}


</style>
