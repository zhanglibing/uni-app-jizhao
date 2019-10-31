<template>
	<view class='info-box'>
		<uni-step :step="2"></uni-step>
		<view class='edit-box'>
			<label>
				<text>资质名称</text>
				<picker @change="bindPickerChange" :value="index" :range="array">
					<view class="picker">
					 {{array[index]}}
					</view>
				</picker>
			</label>
			<label  class="photoId">
				<text>资质证明</text>
				<img-upload @getImgId="getImgId" :imgUrl="ProfessionalLicensesUrl" :type="3"></img-upload>
			</label>
			<label>
				<text>资质编号</text>
				<view>
					<input type='number' v-model="edit.ProfessionalLicenseNumber" placeholder='资质编号'></input>
				</view>
			</label>
			<label class="flex-column">
				<text>受训背景</text>
				<view>
					<textarea  v-model="edit.CareerBackground" placeholder='受训背景'></textarea>
				</view>
			</label>
			<label class="flex-column">
				<text>执业风格</text>
				<view>
					<textarea  v-model="edit.PracticeStyle" placeholder='执业风格'></textarea>
				</view>
			</label>
			
			<label class="flex-column">
				<text>个人介绍</text>
				<view>
					<textarea  v-model="edit.PersonalIntroduction" placeholder='个人介绍'></textarea>
				</view>
			</label>
			<label>
				<text>从业年限(年)</text>
				<view>
					<input type='number' v-model="edit.WorkingYears" placeholder='从业年限'></input>
				</view>
			</label>
			<label class="flex-column">
				<text>擅长领域</text>
				<checkbox-group @change="checkboxChange">
				  <label class="checkbox" v-for="(item,index) in GoodFiel" :key="index">
					<checkbox color="#03528A" :value="item.GoodField" :checked="item.checked" />
					{{item.GoodField}}
				  </label>
				</checkbox-group>
			</label>
			<label>
				<text>咨询费用(元/小时)</text>
				<view>
					<input type='number' v-model="edit.SerivcePrice" placeholder='咨询费用(元)'></input>
				</view>
			</label>

			<label>
				<text>推荐人</text>
				<view>
					<input type='text' v-model="edit.Recommender" placeholder='推荐人'></input>
				</view>
			</label>
			<view class="label">
				<radio color="#095389" @click="radioChange" :checked="isChecked" />
				<text @tap="goConsulting">同意专家入住协议</text>
				
			</view>
			<view class="btn-box">
				<view class="submit-btn btn" @tap="pre">上一步</view>
				<view @tap='submit' class="submit-btn">提交</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import api from '../../../api/user.js';
import {BeConsultant_confirm} from '../../../api/consultation.js'
import imgUpload from '../../../components/img-upload.vue'
import uniStep from '../../../components/uni-step.vue'
export default {
	components:{
	  imgUpload,
	  uniStep
	},
    data() {
        return {
			isChecked:false,
			GoodFiel:[],
			index:0,
			array:['请选择资质名称','心理咨询师二级','心理咨询师三级','婚姻家庭咨询师一级',
			'婚姻家庭咨询师二级','心理治疗师','健康管理师','社会工作师','其他证书'],
			ProfessionalLicensesUrl: '',  //资质证明
			edit:{
			    ProfessionalLicensesTitle: '',
				ProfessionalLicenses: '',
				ProfessionalLicenseNumber: '',
				WorkingYears: '',
				ConsultingHours: '',
				SerivcePrice: '',
				CareerBackground: '',
				PersonalIntroduction: '',
				PracticeStyle: '',
				Recommender: '',
			}
        };
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let app = this.$store.state.userInfo;
		let {
			 ProfessionalLicensesTitle,
			 ProfessionalLicenses,
			 ProfessionalLicenseNumber,
			 WorkingYears,
			 ConsultingHours,
			 SerivcePrice,
			 CareerBackground,
			 PersonalIntroduction,
			 PracticeStyle,
			 Recommender,
			 StatusForConsultant,
			 ProfessionalLicensesUrl,
			 Skilled
		} = app;
		if(app){
			if(ProfessionalLicensesTitle){
				this.index=this.array.indexOf(ProfessionalLicensesTitle)
			}
			this.ProfessionalLicensesUrl = ProfessionalLicensesUrl+'?'+Math.random();
			this.StatusForConsultant = StatusForConsultant;
			this.activeIndex = StatusForConsultant?StatusForConsultant:0;
			this.edit =Object.assign({},this.edit, {  //第一步数据初始化
				  ProfessionalLicensesTitle,
				  ProfessionalLicenses,
				  ProfessionalLicenseNumber,
				  WorkingYears,
				  ConsultingHours,
				  SerivcePrice,
				  CareerBackground:CareerBackground?CareerBackground.replace(/_@/g,'  '):'',
				  PersonalIntroduction:PersonalIntroduction?PersonalIntroduction.replace(/_@/g,'  '):'',
				  PracticeStyle,
				  Recommender,
				  Skilled
			})
		}
        //获取擅长领域
		api.getGoodFile().then(res => {
			if(Skilled){
				let arr=Skilled.split(',');
				res.forEach(val=>{
					if(arr.indexOf(val.GoodField)!=-1){
						val.checked=true;
					}
				})
			}
        	this.GoodFiel = res;
        });
    },
    methods: {
		goConsulting(){
			uni.navigateTo({
				url: '/pages/expertAgreement/expertAgreement',
			});
		},
		radioChange(e){
			
			this.isChecked=!this.isChecked;
		},
		pre(){
			uni.navigateTo({
				url:'../basic/basic'
			})
		},
		//擅长领域
		checkboxChange(e) {
			this.edit.Skilled=e.detail.value.join(',');
		},
		//资质名称
		bindPickerChange(e) {
			this.index = e.target.value;
			console.log(this.index)
			this.edit.ProfessionalLicensesTitle = this.array[e.target.value];
			console.log(this.edit.ProfessionalLicensesTitle)
		},
		//获取子组件数据
		getImgId(val){
			let {type, id, path} = val;
			if (type == 3) {
			  this.edit.ProfessionalLicenses = id;
			  this.ProfessionalLicensesUrl = path;
			}
       },
        //保存用户信息
        submit() {
			if(!this.checkSecond(this.edit)){return false;}
			let that=this;
			if(!this.isChecked){
				uni.showModal({
					title:'提示',
					content:'请勾选协议',
					confirmText:'确认勾选',
					success(res) {
						if(res.confirm){
							that.radioChange()
						}
					}
				})
				return false;
			}
            BeConsultant_confirm(this.edit).then(res => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
				setTimeout(()=>{
					uni.navigateTo({
						url:'../audit/audit'
					})
				},1000)
                
            });
        },
		//核对信息 
		checkSecond(option){
			if (!option.ProfessionalLicensesTitle) {
			  this.$msg.error("请选择资质名称");
			  return false;
			}
			if (!option.ProfessionalLicenses) {
			  this.$msg.error("请上传资质证明照片");
			  return false;
			}
			if (!option.ProfessionalLicenseNumber) {
			  this.$msg.error("请填写证件编号");
			  return false;
			}
			if (!option.WorkingYears) {
			  this.$msg.error("请填写从业年限");
			  return false;
			}
// 			if (!option.ConsultingHours) {
// 			  this.$msg.error("累计个案不能为空");
// 			  return false;
// 			}
			if (!option.CareerBackground) {
			  this.$msg.error("受训背景不能为空");
			  return false;
			}
			if (!option.PersonalIntroduction) {
			  this.$msg.error("个人介绍不能为空");
			  return false;
			}
			if (!option.Skilled) {
			  this.$msg.error("擅长领域不能为空");
			  return false;
			}
			if (!option.PracticeStyle) {
			  this.$msg.error("职业风格不能为空");
			  return false;
			}
			if (!option.Recommender) {
			  this.$msg.error("推荐人不能为空");
			  return false;
			}
			if (!option.SerivcePrice) {
			  this.$msg.error("咨询费用不能为空");
			  return false;
			}
			return true;
		  },
    },
};
</script>

<style lang="scss" scoped="">

.info-box {
    box-sizing: border-box;
	padding-bottom: 50upx;
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
.edit-box .label {
	padding:0 30upx;
	display: flex;
	flex-direction: row;
	align-items: center;
	text{
		text-decoration: underline;
	}
}
.edit-box>label{
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


textarea {
    width: 100%;
	border:1px solid #C3C3C3;
	border-radius: 10upx;
	padding:15upx;
	box-sizing: border-box;
	line-height: 46upx;
}


checkbox-group{
	flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
	margin-bottom: 20upx;
	label {
		padding:0;
		width:33%;
	    font-size: 28upx;
		margin-bottom: 20upx;
	}
}



picker {
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

.btn-box{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding:30upx 50upx;
	view{
		width:250upx;
		height:80upx;
		
	}
}

</style>
