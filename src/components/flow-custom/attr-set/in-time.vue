<template>
	<div>
		<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="90" :label-colon="true">
			<!--站内-->
			<Row>
				<i-col span="12">
					<!-- 行为 -->
					<FormItem :label="$t('actionType')" prop="actionType">
						<Select v-model="submitData.actionType" :placeholder="$t('pleaseSelect') + $t('actionType')">
							<Option v-for="(item, i) in actionTypeData" :value="item.detailCode" :key="i">{{ item.detailName }}</Option>
						</Select>
					</FormItem>
				</i-col>
				<i-col span="12">
					<!-- 限制时间 -->
					<FormItem :label="$t('limitTime')" prop="limitTime">
						<InputNumber style="width: unset" v-model="submitData.limitTime" :min="1"></InputNumber>
						{{ $t("minute") }}
					</FormItem>
				</i-col>
				<i-col span="12">
					<!-- 等待时间 -->
					<FormItem :label="$t('waitTime')" prop="waitTime">
						<InputNumber style="width: unset" v-model="submitData.waitTime" :min="-1"></InputNumber>
						{{ $t("minute") }}
					</FormItem>
				</i-col>
				<i-col span="12">
					<!-- 预警时间 -->
					<FormItem :label="$t('alarmTime')" prop="alarmTime">
						<InputNumber style="width: unset" v-model="submitData.alarmTime" :min="0" :max="submitData.limitTime - 1"></InputNumber>
						{{ $t("minute") }}
					</FormItem>
				</i-col>
				<i-col span="12">
					<!-- 最大解锁次数 -->
					<FormItem label="最大解锁次数" prop="unholdTimes">
						<InputNumber style="width: unset" v-model="submitData.unholdTimes" :min="0"></InputNumber>
					</FormItem>
				</i-col>
				<i-col span="12">
					<FormItem :label="$t('enabled')" prop="enabled">
						<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
							<span slot="open">{{ $t("open") }}</span>
							<span slot="close">{{ $t("close") }}</span>
						</i-switch>
					</FormItem>
				</i-col>
				<i-col span="24">
					<FormItem :label="$t('remark')" prop="remark">
						<Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + $t('remark')" />
					</FormItem>
				</i-col>
			</Row>
		</Form>
		<div v-if="isShow" style="text-align: center">
			<Button type="primary" @click="submit">{{ $t("submit") }}</Button>
		</div>
	</div>
</template>

<script>
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
import { getlistReq, addReq } from "@/api/system-manager/qtime";
import { errorType } from "@/libs/tools";
export default {
	name: "in-time",
	props: {
		// 当前节点数据
		model: {
			type: Object,
			default() {
				return {};
			},
		},
		// 配置项
		optList: {
			type: Object,
			default() {
				return {};
			},
		},
		// 当前流程数据
		stationList: {
			type: Array,
			default() {
				return [];
			},
		},
		// 是否显示提交按钮
		isShow: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			req: {
				processId: "", // 制程id
				enabled: 1, // 1有效 0无效
			},
			submitData: {
				id: "", // 行为 : Hold / Noop
				actionType: "", // 行为 : Hold / Jump
				routeId: "N/A", // 流程Id
				fromRouteId: "", // 当前流程Id
				toRouteId: "", //结束流程id
				fromProcessId: "", // 从那个站点
				fromProcessRuleName: "", // 开始站点RuleName
				toProcessId: "", // 到那个站点
				toProcessRuleName: "", // 结束站点RuleName
				limitTime: 1, // 限制时间单位分钟
				waitTime: 0, // 等待时间单位分钟
				alarmTime: 1, // 预警时间,将来给看板用
				unholdTimes: 0, //最大解锁次数
				enabled: 1, // 1有效 0无效
				remark: "", // 描述
			},
			// 验证实体
			ruleValidate: {
				actionType: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("actionType")}`,
						trigger: "change",
					},
				],
				limitTime: [
					{
						required: true,
						type: "number",
						message: `${this.$t("pleaseEnter")}${this.$t("limitTime")}`,
						trigger: "change",
					},
				],
			},
			actionTypeData: [], // 行为数据
			ruleNameData: [], // 限制类型数据
			qTimeSelectObj: [], // 限制类型数据
			stationInObj: null, // 站内数据
			processList: [], //当前流程图制程数据
			addList: [],
		};
	},
	created() {
		this.req.processId = this.model.labelId;
		this.getQTimeData();
		this.getDataItemData();
	},
	watch: {},
	methods: {
		// 获取分页列表数据
		getQTimeData() {
			getlistReq({ fromProcessId: this.req.processId, fromRouteId: this.optList.id, enabled: -1 }).then((res) => {
				if (res.code === 200) {
					let inObj = {
						id: "", // 行为 : Hold / Noop
						actionType: "", // 行为 : Hold / Jump
						routeId: "N/A" || this.optList.id, // 流程Id
						fromRouteId: this.optList.id, // 当前流程Id
						toRouteId: this.optList.id, //结束流程id
						fromProcessId: this.req.processId, // 从那个站点
						fromProcessRuleName: "TrackIn", // 开始站点RuleName
						toProcessId: this.req.processId, // 到那个站点
						toProcessRuleName: "TrackOut", // 结束站点RuleName
						limitTime: 1, // 限制时间单位分钟
						waitTime: 0, // 等待时间单位分钟
						alarmTime: 1, // 预警时间,将来给看板用
						unholdTimes: 0,
						enabled: 1, // 1有效 0无效
						remark: "", // 描述
					};
					if (res.result && res.result.length) {
						this.addList = res.result;
						let inObj1 = res.result.find((o) => o.fromProcessId === o.toProcessId);
						if (inObj1) {
							inObj = {
								...inObj1,
								fromRouteId: inObj1.fromRouteId || this.optList.id, // 当前流程Id
								toRouteId: inObj1.toRouteId || this.optList.id, //结束流程id
							};
						} else {
							this.addList = [...this.addList, inObj];
						}
					} else {
						this.addList = [inObj];
					}

					this.submitData = { ...inObj };
				}
			});
		},
		// 点击编码规则中的加号按钮触发
		async getDataItemData() {
			this.actionTypeData = await this.getDataItemDetailList("actionType");
			this.ruleNameData = await this.getDataItemDetailList("RuleName");
		},
		async getDataItemDetailList(itemCode) {
			const obj = { itemCode, enabled: 1 };
			let arr = [];
			await getdataitemlistReq(obj).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 提交
		submit() {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					if (this.model.trackInMethods.length === 0 || this.model.trackOutMethods.length === 0) {
						this.$Msg.error("进站和出站不能为空");
					} else {
						this.addList.forEach((item) => {
							if (item.fromProcessId === this.submitData.fromProcessId && item.toProcessId === this.submitData.toProcessId) {
								Object.assign(item, this.submitData);
							}
						});
						let request = addReq(this.addList);
						request.then((res) => {
							if (res.code === 200) {
								this.$Msg.success(`${this.$t("success")}`);
								this.getQTimeData();
							} else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
						});
					}
				}
			});
		},
	},
};
</script>
