/* Maverick 图表*/
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="24">
							<Form
								ref="searchReq"
								:model="req"
								:label-width="80"
								:label-colon="true"
								inline
								:rules="ruleValidate"
								@submit.native.prevent
								@keyup.native.enter="searchClick"
							>
								<!-- 是否刷新 -->
								<FormItem label="自动刷新" prop="isRefresh">
									<i-switch v-model="req.isRefresh" style="width: 50px">
										<template #open>
											<span>On</span>
										</template>
										<template #close>
											<span>Off</span>
										</template>
									</i-switch>
								</FormItem>
								<!-- 刷新频率 -->
								<FormItem label="刷新频率(/mins)" prop="refeshRate" v-if="req.isRefresh" :label-width="120">
									<InputNumber v-model="req.refeshRate" controls-outside />
								</FormItem>
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
								<!-- 线体 -->
								<FormItem label="线体" prop="line">
									<Select
										v-model.tirm="req.line"
										transfer
										style="width: 200px"
										:placeholder="$t('pleaseSelect') + '线体'"
										clearable
										@on-change="getStation"
									>
										<Option v-for="(item, index) in lineList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<!-- 站点 -->
								<FormItem label="站点" prop="station">
									<Select
										v-model.tirm="req.station"
										transfer
										style="width: 200px"
										:placeholder="$t('pleaseSelect') + '站点'"
										clearable
										@on-change="getModel"
									>
										<Option v-for="(item, index) in stationList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<!-- 机种 -->
								<FormItem label="机种" prop="model">
									<Select v-model.tirm="req.model" transfer style="width: 200px" :placeholder="$t('pleaseSelect') + '机种'" clearable>
										<Option v-for="(item, index) in modelList" :key="index" :value="item">{{ item }}</Option>
									</Select>
								</FormItem>
								<FormItem :label-width="0">
									<Button @click="resetClick()">{{ $t("reset") }}</Button
									>&nbsp;
									<Button type="primary" @click="pageLoad()">{{ $t("query") }}</Button>
								</FormItem>
							</Form>
						</i-col>
					</Row>
				</div>
				<LineMaverick style="height: 100%; width: 100%" :data="lineData" ref="lineMaverick" index="1" />
			</Card>
		</div>
	</div>
</template>

<script>
import { getpagelistReq, getLineReq, getStationReq, getModelReq, getTypeReq } from "@/api/bill-manage/maverick-report.js";
import { formatDate } from "@/libs/tools";
import LineMaverick from "@/components/echarts/line-maverick.vue";
export default {
	name: "maverick-report",
	components: { LineMaverick },
	data() {
		return {
			timer: null,
			stationList: [], //站点
			modelList: [], //机种
			lineList: [], //线体
			lineData: { station: "", xData: [], legendData: ["YR", "YR Goal", "SYL Target"], series: [] }, //线体值
			req: {
				isRefresh: false, //自动刷新
				refeshRate: 20, //刷新频率
				startTime: "",
				endTime: "",
				line: "",
				model: "",
				station: "",
			}, //查询数据
			// 验证实体
			ruleValidate: {
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
		this.getLine();
		this.$nextTick(() => {
			this.$refs.lineMaverick.initChart();
		});
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					let { startTime, endTime, line, model, station, isRefresh } = this.req;
					let obj = {
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
							this.lineData.series = [
								{
									type: "line",
									name: "YR",
									data: res.result.map((item1) => {
										return { value: item1.yield, createtime: item1.datecode, station: item1.station, yielD_TARGET: item1.yielD_TARGET };
									}),
								},
								{
									type: "line",
									name: "YR Goal",
									data: res.result.map((item1) => item1.yielD_TARGET),
								},
								{
									type: "line",
									name: "SYL Target",
									data: res.result.map((item1) => item1.yielD_TARGET),
								},
							];
							this.$nextTick(() => {
								this.$refs.lineMaverick.initChart();
							});
						}
					});
				}
			});
		},
		//获取线体
		async getLine() {
			await getLineReq().then((res) => {
				if (res.code === 200) {
					this.lineList = res.result || [];
				}
			});
		},
		//

		//获取站点
		getStation() {
			getStationReq({ line: this.req.line }).then((res) => {
				if (res.code === 200) {
					this.stationList = res.result || [];
				}
			});
		},
		//获取机种
		getModel() {
			getModelReq({ line: this.req.line }).then((res) => {
				if (res.code === 200) {
					this.modelList = res.result || [];
				}
			});
		},
		//获取类别
		getType() {
			getTypeReq().then((res) => {
				if (res.code == 200) {
					console.log(res);
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
<style lang="less" scoped>
:deep(.ivu-switch-small.ivu-switch-checked:after) {
	left: 34px;
}
</style>
