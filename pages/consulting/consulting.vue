<template>
	<view class="consulting-box"  v-if="info">
		<view class="info-box">
			<view>本咨询服务协议由以下三方于 <text>{{time1}}</text>通过网络签署：</view>
			<view><text>甲方（签约专家）：</text>{{info.RealName}}</view>
			<view><text>身份证号码：</text>{{idNumber}}xxxx</view>
			<view><text>乙方（求助者）：</text>{{getPhone}}</view>
			<view><text>身份证号码：</text></view>
			<view><text>丙方：</text>上海霁朝健康管理咨询有限公司</view>
			<view><text>地址：</text>上海市奉贤区金汇镇金闸公路1259号3幢1367号</view>
		</view>
		<view class="text-desc">
			遵照《中华人民共和国精神卫生法》、《中华人民共和国心理咨询师职业标准》为求助者提供心理咨询服务。乙方承诺整个咨询期间（包括咨询的间隔）不会采取包括自杀自残在内的任何有损自身健康的行为。若乙方违背承诺，责任及行为后果将由乙方及其监护人自行承担，甲方不承担任何责任。甲乙丙三方均认可，咨询行为实质为甲乙双方之间的沟通，因此咨询过程中出现的任何情形均无需丙方承担任何责任。甲方与乙方本着平等自愿协商一致原则，就甲方为乙方有偿提供心理咨询进行协商，达成如下协议：
		</view>
		<view class="text-desc">
			<text class="title">鉴于：</text>
			<view>
				1、丙方是一家根据中国法律合法成立并有效存续的有限责任公司，合法拥有居间服务心理咨询在线平台 （包括同名APP软件，以下称“丙方平台”）的经营权，提供信息咨询、技术服务等。
			</view>
			<view>
				2、甲方为持有中国国家心理咨询师的自然人，已与丙方签约为丙方平台签约专家，并承诺其提供给丙方的信息是完全真实的。
			</view>

			<view>3、乙方为丙方平台的注册用户，并承诺其提供给丙方的信息是完全真实的；</view>

			<view>4、现乙方有意就家庭关系问题向甲方寻求专业心理咨询，甲方亦愿意向乙方提供相关服务。</view>

			<view>5、甲、乙双方在本协议签署前已经仔细阅读并充分理解丙方放置在丙方平台上的本协议版本及免责声明，并已经确认同意相关交易规则。各方经友好协商一致，签订如下协议，以兹共同遵照履行。
			</view>
		</view>
		<view class="text-desc">
			<view class="title">第一条 服务内容</view>
			<view>
				<view>1.1、 甲方同意向乙方提供1小时（以下简称“服务时间”）的心理咨询服务，甲、乙双方明确并同意，在乙方完成本协 议项下服务费支付义务后，具体服务时间自乙方与甲方通过丙方平台预约的服务时间到达时开始计算。若甲、乙双方并未
					预约服务时间，则在乙方完成本协议项下服务费支付义务后，具体服务时间自乙方通过丙方平台接受甲方服务之时起开始 计算。</view>

				<view>1.2、 甲方在提供本协议项下心理咨询服务时，应严格遵守相关法律法规、行业规范及平台规则的要求，尽其所能为乙方 提供不低于行业同等水平的服务。</view>

				<view>1.3、 乙方明确并承诺，其已经明确心理咨询业务规则，理解且同意本协议项下的心理咨询服务可能并不会产生直接、强烈、明显的效果，在接受服务后亦可能产生的其他后果，乙方愿意承担该等后果。</view>

				<view>1.4、 乙方明确并承诺，其在接受心理咨询过程中应向甲方如实说明自身情况及遇到的问题，并遵从甲方给出的专业性建议及意见。</view>
			</view>
		</view>
		<view class="text-desc">
			<view class="title">第二条 服务费用</view>
			<view>2.1、 乙方应就本协议项下的心理咨询服务向甲方支付咨询服务费。咨询服务费的计算公式如下所示：

				咨询服务费 =咨询服务费单价人民币{{info.ConsultantInfo.SerivcePrice}} * 服务时间（小时）

				故乙方应向甲方支付咨询服务费总计人民币{{OrderTotal}}¥（大写：{{toUppers}}）。</view>
			<view>2.2、 甲、乙双方应向丙方支付信息技术服务费，甲方不可撤销的明确并同意，其原意代乙方支付全部信息技术服务费。信息技术服务费的计算方法，详见《专家注册协议》相关规定。</view>
			<view>2.3、
				为完成交易之目的，甲方不可撤销的授权丙方代收乙方支付的咨询服务费，并授权丙方直接从代收的每笔咨询服务费中立即收取甲方应向丙方支付的信息技术服务费。丙方应根据其与甲方之间的协议按期足额向甲方支付扣除信息技术服务费后的剩余代收款项。具体付款流程如下：

				<view>（1） 乙方将本协议第2.1条约定的咨询服务费支付至丙方后，方可向甲方发出心理咨询的意向通知；</view>

				<view>（2） 丙方确认收到乙方支付的咨询服务费后，应及时通过平台通知甲方该情况，同时亦应反馈至乙方其咨询服务费已经按平台规则支付，其有权在预约时间接受甲方提供的服务或是通过丙方平台向甲方提出服务申请；</view>

				<view>（3） 甲方在收到丙方的通知后应根据本协议及相关规则的规定及要求为乙方提供心理咨询服务；</view>

				<view>（4） 丙方应定期通过平台通知或短信方式向甲方确认其信息技术服务费的支付情况。</view>
			</view>
			<view>2.4、
				丙方应妥善保存其代收的咨询服务费，并与其自有资金分开保存。非根据本协议、其他协议及相关规则的约定，不得擅自挪用、移转或混同代收的咨询服务费。甲方明确并同意，丙方根据本协议代收代管咨询服务费期间，咨询服务费产生的利息归丙方所有。</view>
			<view>2.5、 甲方对于丙方代收咨询服务费及扣除信息技术服务费存在疑问的，应当及时向丙方反馈，双方配合查清。</view>
			<view>
				2.6、 乙方在成功支付咨询服务费后，有权要求甲方就咨询服务费向其提供发票。
			</view>
			<view>
				2.7、 甲方在每次收到丙方向其支付的代收咨询服务费后，有权要求丙方就信息技术服务费向其提供发票，除非乙方就甲方代其支付的信息技术服务费要求丙方向其提供发票。
			</view>
		</view>
		<view class="text-desc">
			<view class="title">第三条 保密责任</view>
			<view>3.1、 本协议及本协议履行过程中涉及的所有信息（包括但不限于乙方身份信息等）均为保密信息。各方应妥善保管相关信息，除本框架协议第3.2条约定的情形外，任何一方不得向第三方披露任何保密信息。</view>
			<view>3.2、 各方明确并同意，在下列情况下，任何一方可向第三方披露保密信息：

				<view>（1） 已经取得其他各方事先书面确认；</view>

				<view>（2） 根据行政机关、司法机关的合理要求；</view>

				<view>（3） 公众已可通过其他合法渠道获知；</view>

				<view>（4） 丙方为完成本协议之目的，向内部工作人员、委托的中介机构披露保密信息。但披露方应保证内部工作人员、委托的中介机构，无论劳动关系、委托关系是否存续，均承担与披露方相同的保密义务。</view>
			</view>
			<view>3.3、 任何一方擅自披露保密信息造成其他各方损失的，披露方应承担相应的赔偿责任。</view>
			<view>3.4、 本协议项下保密责任不会随本协议的失效、终止、撤销而失去效力。</view>
		</view>
		<view class="text-desc">
			<view class="title">第四条 协议终止</view>
			<view>4.1、
				甲方有权在甲、乙方双方预约的服务时间到达【48】小时前通过丙方平台通知乙方及丙方解除本协议，但甲方应退还或委托丙方退还收取的全部咨询服务费，并承担由此给乙方及丙方造成的一切损失。甲方进一步明确，若甲方行使本条款约定之解除权，丙方已经收取的信息技术服务费不予退还。</view>
			<view>4.2、
				丙方有权在甲方或乙方违反本协议约定时通过丙方平台通知甲方及乙方解除本协议。甲方应退还或委托丙方退还已经收取的、但尚未接受的心理咨询服务所对应的咨询服务费。若丙方因甲方违约而行使本条款约定之解除权，丙方已经收取的信息技术服务费不予退还，否则，丙方应于解除本协议后的【7】个工作日内，将收取的信息技术服务费退还给甲方。</view>
			<view>各方明确并同意，丙方行使本条款约定之解除权并不影响丙方追究违约方违约责任之权利。</view>
		</view>
		<view class="text-desc">
			<view class="title">第五条 违约责任</view>
			<view>5.1、 各方均应严格履行本协议，非经各方协商一致或依照本协议约定，任何一方不得解除本协议。</view>
			<view>5.2、 任何一方任何违反本协议约定的行为均构成违约，违约方应承担因违约而产生的赔偿责任并承担其余其他各方因违约而产生的其他费用和损失，包括但不限于调查费、诉讼费、律师费等。</view>
		</view>
		<view>
			<view class="title">第六条 法律适用和争议解决</view>
			<view>6.1、 本协议的效力、履行、终止、解释均适用中华人民共和国法律。</view>
			<view>6.2、 因本协议产生的任何争议，本协议任何一方均有权向丙方所在地有管辖权的法院提起诉讼解决。</view>
		</view>
		<view class="text-desc">
			<view class="title">第七条 其他</view>
			<view>7.1、 本协议由各方在线签署，采用电子文本形式制成，并保存在丙方为此设立的专用服务器上备查，各方均认可该形式的协议效力。</view>
			<view>7.2、 本协议的任何修改、补充均应以电子文本形式作出并于丙方平台公告。</view>
			<view>7.3、 本协议的任何条款被认定无效，其余条款并不受影响，依然有效。</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/consultation.js'
	import order from '../../api/order.js'
	import {
		numberToUpper
	} from '../../utils/numberToUpper.js'
	export default {
		data() {
			return {
				info: null,
				time: order.getTime(),
				phone: '',
				OrderTotal: '',
				toUppers:''
			};
		},
		onLoad(option) {
			let {
				id,
				CustomerInfo,
				time,
				OrderTotal,
				
			} = option;
			if (time) {
				this.time = time;
			}
			this.phone = CustomerInfo;
			api.gtConsultantInfo(id).then(res => {
				this.info = res;
				this.OrderTotal = OrderTotal ? OrderTotal : res.ConsultantInfo.SerivcePrice;
				this.toUppers=numberToUpper(this.OrderTotal)
			})
		},
		onShow() {

		},
		computed: {
			getPhone() {
				return this.phone ? this.phone : this.$store.state.userInfo.Username
			},
			time1() {
				return this.time.slice(0, 10)
			},
			idNumber() {
				return this.info.ConsultantInfo.IDNumber.slice(0, 14)
			}
		},
		filters: {
			numberToUppers(val) {
				console.log(numberToUpper(val))
				return numberToUpper(val)
			}
		}
	}
</script>

<style lang="scss">
	.consulting-box {
		padding: 30upx;
		background: #fff;

		.info-box {
			margin-bottom: 30upx;

			&>view {
				margin-bottom: 10upx;

				text {
					font-weight: bold;
				}
			}
		}

		.text-desc {
			margin-bottom: 30upx;

			view {
				margin-bottom: 10upx;
				color: #222;
				font-size: 12px;
			}

			.title {
				font-weight: bold;
				margin-bottom: 10upx;
				font-size: 14px;
			}
		}
	}
</style>
