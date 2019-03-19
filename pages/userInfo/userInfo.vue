<template>
	<view class='info-box'>
		<view class='avatar-box flex-row'>
			<view class='img-box'>
				<image :src="info.AvatarUrl"></image>
			</view>
		</view>

		<view class='edit-box'>
			<label>
				<text>昵称</text>
				<input type="text" placeholder="请输入昵称" v-model.trim="info.NickName">
			</label>
			<label>
				<text>真实姓名</text>
				<input type="text" placeholder="请输入真实姓名" v-model.trim="info.RealName">
			</label>
			<label>
				<text>性别</text>
				 <radio-group class="radio-group" @change="radioChange">
					<label class="radio" v-for="item in items" :key="item">
						<radio color="#095389" :value="item.value" :checked="item.checked" />{{item.name}}
					</label>
				</radio-group>
			</label>
			<label>
				<text>生日</text>
				<picker mode="date" :value="info.Birthday" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{info.Birthday?info.Birthday:"请选择生日"}}</view>
				</picker>
			</label>
			<label>
				<text>所在城市</text>
				<address-model  @setAddress="setAddress"></address-model>
			</label>
			<label>
				<text>Email</text>
				<view>
					<input type='Email' v-model="info.Email" placeholder='邮箱'></input>
				</view>
			</label>
			<label>
				<text>QQ</text>
				<view>
					<input type='number' v-model="info.QQ" placeholder='QQ'></input>
				</view>
			</label>
			<view @tap='submit' class="block-btn"> 保存</view>
		</view>
	</view>
</template>

<script>
import api from '../../api/user.js';
import { mapState } from 'vuex';
import addressModel from '../../components/address-model.vue'

export default {
	components:{
      addressModel
	},
    data() {
        return {
			items: [
				{
					name: '男',
					value: 'M'
				},
				{
					name: '女',
					value: 'F'
				}
			],
            info: {}, //存放用户信息
            // Skilled: '',
            goods: [], //存放所有擅长领域
			address:{}
        };
    },
    computed: mapState(['userInfo']),
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let app = this.$store.state.userInfo;
		this.info=app;
		//初始化性别
		this.items.forEach(val => {
			if (val.value == app.Gender) {
				val.checked = true;
			}
		});
       },
    methods: {
		setAddress(val){
			this.address=val;
		},
		bindPickerChange(e) {
			this.index = e.target.value;
			this.culture = this.array[e.target.value];
		},
		bindDateChange(e) {
			this.info.Birthday = e.target.value;
		},
		radioChange(e) {
			this.info.Gender = e.detail.value;
		},
        //保存用户信息
        submit(e) {
			console.log(this.info)
			let {NickName,RealName,Birthday,Gender,Email,QQ,ProvinceId,CityId,AreaId,Address2}=this.info;
            let option = {
                Pid: ProvinceId,Cid:CityId, Aid: AreaId,Address2,
                NickName,RealName,Birthday,Gender,Email,QQ,
				...this.address
            };
            api.saveUserInfo(option).then(res => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    });
                }, 1000);
            });
        },
  
    },
	computed: {
		startDate() {
			return new Date('1930-01-01');
		},
		endDate() {
			return new Date();
		}
	}
};
</script>

<style lang="scss" scoped="">
.info-box {
    box-sizing: border-box;
}

.avatar-box {
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-bottom: 30upx;
}

.avatar-box .img-box {
    width: 150upx;
    height: 150upx;
    background: #000;
    border-radius: 50%;
    overflow: hidden;
}

label {
	padding:0 30upx;
    font-size: 34upx;
    min-height: 88upx;
    align-items: center;
    margin-bottom: 20upx;
	background: #fff;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	input{
		flex: 1;
		text-align: right;
	}
}

label text,
.item text {
    font-size: 34upx;
}

label > view,
.item > view {
    flex: 1;
    color: #666;
}

textarea {
    width: 100%;
}

input {
    color: #000;
    height: 70upx;
}

checkbox-group,radio-group {
	flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
	label {
	    margin-right: 20upx;
	    font-size: 34upx;
	}
}

radio-group{
	text-align: right;
	justify-content: flex-end;
	label{
		padding:0;
		margin-right: 0;
		margin-left: 60upx;
	}
}


.item {
    display: flex;
    margin-bottom: 30upx;
	label {
	    min-height: 40upx;
	}
}


picker {
    color: #000;
    height: 70upx;
	text-align: right;
	view{
		padding-right: 0;
	}
	.picker {
	    line-height: 70upx;
	    padding-left: 10upx;
	}
}

.block-btn{
	position: fixed;
	left:0;
	bottom:0;
	width:100%;
	border-radius: 0;
}

</style>
