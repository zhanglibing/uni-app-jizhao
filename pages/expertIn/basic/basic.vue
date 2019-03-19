<template>
	<view class='info-box'>
		<uni-step :step="1"></uni-step>
		<view class='edit-box'>
			<label>
				<text>手机号</text>
				<input type="number" :disabled="true"  v-model="info.Username">
			</label>
			<label>
				<text>真实姓名</text>
				<input type="text" placeholder="请输入真实姓名" v-model.trim="edit.RealName">
			</label>
			<label class="photoId">
				<view class="img-upload">
					<view class="item-img">
						<text>身份证正面</text>
						<img-upload @getImgId="getImgId" :imgUrl="IdPictureUrl" :type="1"></img-upload>
					</view>
					<view class="item-img">
						<text>身份证反面</text>
						<img-upload  @getImgId="getImgId" :imgUrl="IdPicture1Url" :type="2"></img-upload>
					</view>
				</view>
				
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
				<picker mode="date" :value="edit.Birthday" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{edit.Birthday?edit.Birthday:"请选择生日"}}</view>
				</picker>
			</label>
			<label>
				<text>所在城市</text>
				<view class="address">
					<address-model  @setAddress="setAddress"></address-model>
				</view>
				
			</label>
			<label>
				<text>证件类型</text>
				<view>
					<input type="text" :disabled="true" placeholder="请输入昵称" value="大陆身份证">
				</view>
			</label>
			<label>
				<text>证件号码</text>
				<view>
					<input type='idcard' v-model="edit.IDNumber" placeholder='邮箱'></input>
				</view>
			</label>
			<label>
				<text>学历</text>
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="picker">
					 {{array[index]}}
					</view>
				</picker>
			</label>
			<label>
				<text>面询地址</text>
				<view>
					<input type='text' v-model="edit.Address1" placeholder='例如:江苏-苏州'></input>
				</view>
			</label>
			<view @tap='submit' class="block-btn"> 下一步</view>
		</view>
	</view>
</template>

<script>
import api from '../../../api/user.js';
import {BeConsultant_one} from '../../../api/consultation.js'
import addressModel from '../../../components/address-model.vue'
import imgUpload from '../../../components/img-upload.vue'
import uniStep from '../../../components/uni-step.vue'
export default {
	components:{
      addressModel,
	  imgUpload,
	  uniStep
	},
    data() {
        return {
			info:{},
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
			index:0,
			array:['请选择学历','专科','本科','硕士','博士','博士后'],
			IdPictureUrl: '',  //正面
            IdPicture1Url: '', //反面
			edit:{
			   RealName: '',
			   Gender: '',
			   Pid: '',
			   Cid: '',
			   Aid: '',
			   IDPicture: '',
			   IDPicture1: '', //身份证反面
			   IDType: '',
			   IDNumber: '',
			   Education: '',
			   WeChat: '',
			   Birthday: '',
			   Address1: '',  //面询地址
			   Address2: '',
			}
        };
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let app = this.$store.state.userInfo;
		this.info=app;
		let {
		  Username, customerId, StatusForConsultant, AvatarUrl, IdPictureUrl,IdPicture1Url,WeChat,
		  AreaId, CityId, ProvinceId, RealName, Gender, IDType, IDNumber, Education, IDPicture,IDPicture1, Address1, Address2, Birthday,
		} = app;
		if(app){
			
			this.Username = Username;
			this.AvatarUrl = AvatarUrl;
			this.IdPictureUrl = IdPictureUrl+'?'+Math.random();
			this.IdPicture1Url = IdPicture1Url+'?'+Math.random();
			this.StatusForConsultant = StatusForConsultant;
			this.activeIndex = StatusForConsultant?StatusForConsultant:0;
			this.edit = {  //第一步数据初始化
			  Pid: ProvinceId?ProvinceId+'':'', Cid: CityId?CityId+'':'', Aid: AreaId?AreaId+'':'',
			  RealName, Gender, IDType, IDNumber,
			  Education, IDPicture,IDPicture1, WeChat, Address1, Address2, Birthday
			}
		}
		this.index=this.array.indexOf(Education);
		//初始化性别
		this.items.forEach(val => {
			if (val.value == Gender) {
				val.checked = true;
			}
		});
    },
    methods: {
		//接收子组件传值
		setAddress(val){
			this.edit={
				...this.edit,
				...val
			}
		},
		//文凭
		bindPickerChange(e) {
			this.index = e.target.value;
			this.edit.Education = this.array[e.target.value];
		},
		//生日改变
		bindDateChange(e) {
			this.edit.Birthday = e.target.value;
		},
		//性别
		radioChange(e) {
			this.edit.Gender = e.detail.value;
		},
		//获取子组件数据
		getImgId(val){
			let {type, id, path} = val;
			console.log(val)
			if (type == 1) {
			  this.edit.IDPicture = id;
			  this.IdPictureUrl = path;
			}
			if (type == 2) { //身份证反面
			  this.edit.IDPicture1 = id
			  this.IdPicture1Url = path;
			}
       },
        //保存用户信息
        submit(e) {
			if(!this.checkFirst(this.edit)){
				return false;
			}
            BeConsultant_one(this.edit).then(res => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
				setTimeout(()=>{
					uni.navigateTo({
						url:'../background/background'
					})
				},1000)
                
            });
        },
		//验证数据
		checkFirst(option){
			if (!option.RealName) {
			  this.$msg.error("真实姓名不能为空");
			  return false;
			}
			if (!option.IDPicture) {
			  this.$msg.error("请上传手持身份证照片");
			  return false;
			}
			if (!option.Aid) {
			  this.$msg.error("请选择所在城市");
			  return false;
			}
			if (!option.IDNumber) {
			  this.$msg.error("证件号码不能为空");
			  return false;
			}
			if (!option.Education) {
			  this.$msg.error("请选择学历");
			  return false;
			}

			if (!option.Address1) {
			  this.$msg.error("面询地址不能为空");
			  return false;
			}
			return true;
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
	padding-bottom: 150upx;
	background: #fff;
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
	background: #fff;
	display: flex;
	flex-direction: column;
	margin-bottom:40upx;
	text{
		margin-bottom: 10upx;
		font-size: 26upx;
	}
	input{
		border:1px solid #C3C3C3;
		box-sizing: border-box;
		height:88upx;
		border-radius: 10upx;
		padding-left: 15upx;
	}
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
	width:100%;
	
	label{
		flex-direction: row;
		align-items: center;
		padding:0;
		margin-right: 60upx;
	}
}


picker,.address {
      color: #000;
	   border:1px solid #C3C3C3;
	   box-sizing: border-box;
	   height:88upx;
	   border-radius: 10upx;
	.picker {
	    line-height: 70upx;
	    padding-left: 10upx;
	}
}
.address{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 20upx;
}

.img-upload{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	.item-img{
		display: flex;
		flex-direction: column;
		text{
			margin-bottom: 10upx;
		}
		
	}
}

</style>
