/* 模拟数据 */
<template>
	<div class="page-style">
		<!-- 页面输入下载条件 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style" id="analogData">
				<Row>
					<Form ref="submitReq" :model="req" :label-width="150" :label-colon="false" :rules="ruleValidate" style="width: 70rem">
						<FormItem label="线体" prop="lineName">
							<Select v-model="req.lineName" clearable size="default" @on-change="getEqpId">
								<Option v-for="item in selectList.lineList" :value="item.lineName" :key="item.lineName">{{ item.lineName }}</Option>
							</Select>
						</FormItem>
						<FormItem label="Dam设备" prop="damEqpId">
							<Select v-model="req.damEqpId" clearable size="default">
								<Option v-for="item in selectList.EqpIdDamList" :value="item.eqpId" :key="item.eqpId">{{ item.eqpId }}</Option>
							</Select>
						</FormItem>
						<FormItem label="Fill设备" prop="fillEqpId">
							<Select v-model="req.fillEqpId" clearable size="default">
								<Option v-for="item in selectList.EqpIdFillList" :value="item.eqpId" :key="item.eqpId">{{ item.eqpId }}</Option>
							</Select>
						</FormItem>
						<FormItem label="过站时间" prop="currentDateTime">
							<DatePicker
								transfer
								type="datetime"
								:placeholder="$t('pleaseSelect') + '过站时间'"
								format="yyyy-MM-dd HH:mm:ss"
								:options="$config.datetimeOptions"
								v-model="req.currentDateTime"
							></DatePicker>
						</FormItem>
						<FormItem label="大版码模板" prop="originalPanel">
							<Input type="text" v-model="req.originalPanel" clearable size="default"></Input>
						</FormItem>
						<FormItem label="大版码" prop="currentPanel">
							<Input type="text" v-model="req.currentPanel" clearable size="default"></Input>
						</FormItem>
						<FormItem>
							<Button type="primary" @click="reset()" size="default">{{ $t("reset") }}</Button> &nbsp;&nbsp;
							<Button type="primary" @click="submit('unitinfo')" size="default" :loading="loading.unitinfo">
								<span v-if="!loading.unitinfo">添加过站</span>
								<span v-else>正在提交，请等待...</span>
							</Button>
							&nbsp;&nbsp;
							<Button type="primary" @click="submit('serin')" size="default" :loading="loading.serin">
								<span v-if="!loading.serin">添加Serin</span>
								<span v-else>正在提交，请等待...</span>
							</Button>
							&nbsp;&nbsp;
							<Button type="primary" @click="submit('kns')" size="default" :loading="loading.kns">
								<span v-if="!loading.kns">添加KNS</span>
								<span v-else>正在提交，请等待...</span>
							</Button>
							&nbsp;&nbsp;
							<Button type="primary" @click="submit('tooling')" size="default" :loading="loading.tooling">
								<span v-if="!loading.tooling"> 添加Tooling</span>
								<span v-else>正在提交，请等待...</span>
							</Button>
							&nbsp;&nbsp;
						</FormItem>
					</Form>
				</Row>
				<!-- 提交记录 -->
				<div v-if="reqList.length" style="height: calc(100% - 28rem); overflow-y: scroll">
					<template v-for="item in reqList">
						<Alert type="success" show-icon>
							<span :class="item.type">{{ item.type }}</span> {{ formatDate(item.currentDateTime) }} : {{ item.lineName }} Dam设备：{{
								item.damEqpId
							}}
							Fill设备：{{ item.fillEqpId }} 替换Panel：{{ item.currentPanel }}
						</Alert>
					</template>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
import { addUnitinfoTravel, addSerinData, addKnsData, addToolingData, getEqpIdReq, getLineReq } from "@/api/bill-manage/analog-data";
import { formatDate } from "@/libs/tools";

export default {
	name: "analogData",
	data() {
		return {
			req: {
				originalSn: "",
				currentSn: "",
				currentPanel: "", //大板码
				originalPanel: "", //大板码模板
				lineName: "", //线体
				fillEqpId: "", //Fill设备
				damEqpId: "", //Dam设备
				currentDateTime: "", //过站时间
			}, //查询数据
			//加载中
			loading: {
				unitinfo: false,
				serin: false,
				kns: false,
				tooling: false,
			},
			// 验证实体
			ruleValidate: {
				currentPanel: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("currentPanel"),
						trigger: "blur",
					},
				],
				originalPanel: [
					{
						required: true,
						message: this.$t("pleaseEnter") + this.$t("originalPanel"),
					},
				],
				lineName: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "线体",
						trigger: "change",
					},
				],
				fillEqpId: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "Fill设备",
						trigger: "change",
					},
				],
				damEqpId: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "Dam设备",
						trigger: "change",
					},
				],
				currentDateTime: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "过站时间",
					},
				],
			},
			reqList: [], //提示提交内容
			//下拉框
			selectList: {
				lineList: [],
				EqpIdDamList: [], //站点Dam集合
				EqpIdFillList: [], //站点Fill集合
			},
			formatDate: formatDate,
		};
	},
	methods: {
		//提交
		submit(flag) {
			const requestApi = this.apiData(flag);
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					this.loading[flag] = true;
					const { originalSn, originalPanel, currentSn, currentPanel, lineName, damEqpId, fillEqpId, currentDateTime } = this.req;
					const obj = {
						originalSn,
						originalPanel,
						currentSn,
						currentPanel,
						lineName,
						damEqpId,
						fillEqpId,
						currentDateTime: formatDate(currentDateTime),
					};
					requestApi(obj)
						.then((res) => {
							this.loading[flag] = false;
							if (res.code === 200) {
								this.reqList.push({ ...this.req, type: flag });
								this.$Msg.success("提交成功！");
							} else {
								this.$Msg.error(res.message);
							}
						})
						.catch(() => {
							this.loading[flag] = false;
						});
				}
			});
		},
		// 获取该调用的API
		apiData(flag) {
			const temp = {
				unitinfo: addUnitinfoTravel,
				serin: addSerinData,
				kns: addKnsData,
				tooling: addToolingData,
			};
			return temp[flag];
		},
		//获取线体
		getLine() {
			const obj = {
				sation: "DamCure",
			};
			getLineReq(obj).then((res) => {
				if (res.code === 200) {
					this.selectList.lineList = res.result;
				}
			});
		},
		//获取设备
		getEqpId() {
			this.getDamEqpId();
			this.getFillEqpId();
		},
		//Dam
		getDamEqpId() {
			this.req.damEqpId = "";
			const obj = {
				sation: "DamCure",
				line: this.req.lineName,
			};
			getEqpIdReq(obj).then((res) => {
				if (res.code === 200) {
					this.selectList.EqpIdDamList = res.result;
				}
			});
		},
		//Fill
		getFillEqpId() {
			this.req.fillEqpId = "";
			const obj = {
				sation: "FillMainCure",
				line: this.req.lineName,
			};
			getEqpIdReq(obj).then((res) => {
				if (res.code === 200) {
					this.selectList.EqpIdFillList = res.result;
				}
			});
		},

		// 重置
		reset() {
			this.$refs.submitReq.resetFields();
		},
	},
	mounted() {
		this.getLine(); //获取线体
	},
};
</script>
<style lang="less" scoped>
#analogData {
	.ivu-row {
		margin-left: 15%;
		margin-top: 8%;
		// text-align: center;
	}
	/deep/.ivu-form .ivu-FormItem-label {
		font-size: 21px;
	}

	/deep/ textarea.ivu-input,
	.ivu-input,
	.ivu-btn {
		font-size: 16px;
	}
	/deep/.ivu-FormItem-content {
		font-size: 18px;
	}
	/deep/.ivu-FormItem {
		margin-bottom: 25px;
	}
	.unitinfo {
		display: inline-block;
		padding: 0.3rem;
		background: #5abcea;
		color: white;
		border-radius: 9px;
		min-width: 3.4rem;
		text-align: center;
	}
	.serin {
		display: inline-block;
		padding: 0.3rem;
		background: #3ce175;
		color: white;
		border-radius: 9px;
		min-width: 3.4rem;
		text-align: center;
	}
	.kns {
		display: inline-block;
		padding: 0.3rem;
		background: rgb(206, 219, 94);
		color: white;
		border-radius: 9px;
		min-width: 3.4rem;
		text-align: center;
	}
	.tooling {
		display: inline-block;
		padding: 0.3rem;
		background: rgb(242, 146, 146);
		color: white;
		border-radius: 9px;
		min-width: 3.4rem;
		text-align: center;
	}
}
</style>
