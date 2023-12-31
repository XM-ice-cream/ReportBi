/* Maverick SYL 图表*/
<template>
	<div class="page-style maverick-report">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="22">
							<Form
								ref="searchReq"
								:model="req"
								inline
								:label-width="80"
								:rules="ruleValidate"
								@submit.native.prevent
								@keyup.native.enter="searchClick"
							>
								<!-- 是否刷新 -->
								<!-- <FormItem label="自动刷新" prop="isRefresh">
									<i-switch v-model="req.isRefresh" style="width: 50px">
										<template #open>
											<span>On</span>
										</template>
										<template #close>
											<span>Off</span>
										</template>
									</i-switch>
								</FormItem> -->
								<!-- 刷新频率 -->
								<!-- <FormItem label="刷新频率(/mins)" prop="refeshRate" v-if="req.isRefresh" :label-width="120">
									<InputNumber v-model="req.refeshRate" controls-outside />
								</FormItem> -->
								<!-- 起始时间 -->
								<FormItem :label="$t('startTime')" prop="startTime" v-if="!req.isRefresh">
									<DatePicker
										transfer
										type="datetime"
										:placeholder="$t('pleaseSelect') + $t('startTime')"
										format="yyyy-MM-dd HH:mm:ss"
										:options="$config.datetimeOptions"
										v-model="req.startTime"
									></DatePicker>
								</FormItem>
								<!-- 结束时间 -->
								<FormItem :label="$t('endTime')" prop="endTime" v-if="!req.isRefresh">
									<DatePicker
										transfer
										type="datetime"
										:placeholder="$t('pleaseSelect') + $t('endTime')"
										format="yyyy-MM-dd HH:mm:ss"
										:options="$config.datetimeOptions"
										v-model="req.endTime"
									></DatePicker>
								</FormItem>
								<!-- 类型 -->
								<FormItem label="类型" prop="type">
									<Select
										v-model.tirm="req.type"
										transfer
										:placeholder="$t('pleaseSelect') + '类型'"
										clearable
										@on-change="getLine"
										style="width: 200px"
									>
										<Option v-for="(item, index) in typeList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<!-- 线体 -->
								<FormItem label="线体" prop="line">
									<Select
										v-model.tirm="req.line"
										transfer
										:placeholder="$t('pleaseSelect') + '线体'"
										clearable
										@on-change="getStation"
										style="width: 200px"
									>
										<Option v-for="(item, index) in lineList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<!-- 站点 -->
								<FormItem label="站点" prop="station">
									<Select
										v-model.tirm="req.station"
										transfer
										:placeholder="$t('pleaseSelect') + '站点'"
										clearable
										@on-change="getModel"
										style="width: 200px"
									>
										<Option v-for="(item, index) in stationList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<!-- 机种 -->
								<FormItem label="机种" prop="model">
									<Select v-model.tirm="req.model" transfer :placeholder="$t('pleaseSelect') + '机种'" clearable style="width: 200px">
										<Option v-for="(item, index) in modelList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<FormItem>
									<Button @click="resetClick()">{{ $t("reset") }}</Button>
									<Button type="primary" @click="pageLoad()">{{ $t("query") }}</Button>
								</FormItem>
							</Form>
						</i-col>
						<i-col span="2">
							<button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<LineMaverick style="height: 100%; width: 100%" :data="lineData" ref="lineMaverick" index="1" />
			</Card>
		</div>
	</div>
</template>

<script>
import { getpagelistReq, getLineReq, getStationReq, getModelReq, getTypeReq, exportReq } from "@/api/bill-manage/maverick-report.js";
import { formatDate, getButtonBoolean, exportFile } from "@/libs/tools";
import LineMaverick from "@/components/echarts/line-maverick.vue";
export default {
	name: "maverick-report",
	components: { LineMaverick },
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			timer: null,
			yield_type: "SYL", //当前图表类型
			typeList: [], //类别
			stationList: [], //站点
			modelList: [], //机种
			lineList: [], //线体
			lineData: { station: "", type: "", xData: [], legendData: ["YR", "YR Goal", "SYL Limit"], series: [] }, //线体值
			req: {
				isRefresh: false, //自动刷新
				refeshRate: 20, //刷新频率
				startTime: "",
				endTime: "",
				line: "",
				model: "",
				station: "",
				type: "",
			}, //查询数据
			// 验证实体
			ruleValidate: {
				type: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "类型",
						trigger: "change",
					},
				],
				line: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "线体",
						trigger: "change",
					},
				],
				model: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "机种",
						trigger: "change",
					},
				],
				station: [
					{
						required: true,
						message: this.$t("pleaseEnter") + "站点",
						trigger: "change",
					},
				],
			},
		};
	},
	watch: {
		"req.isRefresh"(val) {
			if (val) {
				this.timer = setInterval(() => {
					this.pageLoad();
				}, this.req.refeshRate * 60 * 1000);
			} else {
				clearInterval(this.timer);
			}
		},
	},
	mounted() {
		this.getType();
		getButtonBoolean(this, this.btnData);
		this.$nextTick(() => {
			this.$refs.lineMaverick.initChart();
		});
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.searchPoptipModal = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					let { startTime, endTime, line, model, station, isRefresh, type } = this.req;
					let obj = {
						yieldtype: this.yield_type,
						type,
						startTime: isRefresh ? "" : formatDate(startTime),
						endTime: isRefresh ? "" : formatDate(endTime),
						line,
						model,
						station,
					};
					getpagelistReq(obj).then((res) => {
						if (res.code === 200) {
							this.lineData.xData = res.result.map((item, index) => index);
							this.lineData.station = station;
							this.lineData.type = this.yield_type;
							this.lineData.series = [
								{
									type: "line",
									name: "YR",
									data: res.result.map((item1) => {
										return { value: item1.yield, createtime: item1.datecode, station: item1.station, yielD_TARGET: item1.yielD_TARGET };
									}),
									symbolSize: 5,
									lineStyle: {
										width: 2,
									},
								},
								{
									type: "line",
									name: "YR Goal",
									markLine: {
										data: [
											{
												name: "YR Goal",
												yAxis: res.result && res.result[0]?.yielD_GOAL,
											},
										],
										lineStyle: {
											type: "solid",
											width: 2,
										},
										label: {
											fontSize: 14,
										},
									},
								},
								{
									type: "line",
									name: "SYL Limit",
									data: res.result.map((item1) => item1.yielD_TARGET),
									symbolSize: 0,
									lineStyle: {
										width: 2,
									},
									label: {
										show: true,
										color: "#e51f0e",
										fontSize: 14,
										formatter: function (params) {
											const { dataIndex, data } = params;
											if (dataIndex == 0) return data;
											if (res.result[dataIndex - 1].yielD_TARGET !== data) return data;
											else return "";
										},
									},
								},
							];
							this.$nextTick(() => {
								this.$refs.lineMaverick.initChart();
							});
						}
					});
				} else {
					this.searchPoptipModal = true;
				}
			});
		},
		// 导出
		exportClick() {
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					let { startTime, endTime, line, model, station, type } = this.req;
					let obj = {
						yieldtype: this.yield_type,
						type,
						startTime: formatDate(startTime),
						endTime: formatDate(endTime),
						line,
						model,
						station,
					};
					exportReq(obj).then((res) => {
						let blob = new Blob([res], { type: "application/vnd.ms-excel" });
						const fileName = `${this.$t("maverick-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
						exportFile(blob, fileName);
					});
				}
			});
		},
		//获取类别
		getType() {
			this.req.type = "";
			const obj = { yield_type: this.yield_type };
			getTypeReq(obj).then((res) => {
				if (res.code == 200) {
					this.typeList = res?.result || [];
				}
			});
		},
		//获取线体
		async getLine() {
			this.req.line = "";
			const obj = { yield_type: this.yield_type, type: this.req.type };
			await getLineReq(obj).then((res) => {
				if (res.code === 200) {
					this.lineList = res.result || [];
				}
			});
		},

		//获取站点
		getStation() {
			this.req.station = "";
			const { type, line } = this.req;
			const obj = { yield_type: this.yield_type, type, line };
			getStationReq(obj).then((res) => {
				if (res.code === 200) {
					this.stationList = res.result || [];
				}
			});
		},
		//获取机种
		getModel() {
			this.req.model = "";
			const { line } = this.req;
			const obj = { yield_type: this.yield_type, line };
			getModelReq(obj).then((res) => {
				if (res.code === 200) {
					this.modelList = res.result || [];
				}
			});
		},

		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
	},
};
</script>
<style>
.maverick-report .card-style .ivu-card-body {
	height: calc(100% - 100px) !important;
}
</style>
<style lang="less" scoped>
:deep(.ivu-switch-small.ivu-switch-checked:after) {
	left: 34px;
}
</style>
