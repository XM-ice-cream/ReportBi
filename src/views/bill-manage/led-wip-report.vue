/* LedWip看板报表 */
<template>
	<div class="page-style led-wip-report">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form :label-width="70" @submit.native.prevent ref="searchReq" :model="req" @keyup.native.enter="searchClick">
										<!-- workOrderInfo -->
										<FormItem :label="$t('workOrderInfo')" prop="workOrderInfo">
											<!-- <Input :placeholder="
                              请上传固定格式的excel档
                            " type="file" @on-change="changeFile" /> -->
											<Input clearable v-model.trim="uploadImgUrl" size="small" @on-change="changeInput">
												<template slot="append">
													<!-- <i class="iconfont iconfolder-o"></i> -->
													<Icon type="md-image" class="icon-image" />
													<input type="file" class="file" ref="files" @change="getImages" />
												</template>
											</Input>
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="12">
							<button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<div class="title">
					<span class="title-name"> LPA Production WIP Status By Line </span>
					<span class="title-time"> Cut time:{{ searchTime }} </span>
				</div>
				<Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					:span-method="handleSpan"
				>
					<!-- 工单 -->
					<template slot-scope="{ row }" slot="moNumber">
						<div style="white-space: pre">{{ row.moNumber }}</div>
					</template>
					<!-- 工单数量 -->
					<template slot-scope="{ row }" slot="moQty">
						<div style="white-space: pre">{{ row.moQty }}</div>
					</template>
					<!-- category -->
					<template slot-scope="{ row }" slot="category">
						<div v-if="row.category === 'wip'">{{ row.category.toUpperCase() }}</div>
						<div v-else>{{ row.category }}</div>
					</template>
					<!-- OP40 -->
					<template slot-scope="{ row }" slot="step3">
						<span v-if="row.category === 'wip'" class="green">{{ row.step3 }}</span>
						<span v-else> {{ row.step3 }}</span>
					</template>
					<!-- Prebake -->
					<template slot-scope="{ row }" slot="step5">
						<span v-if="row.category === 'wip'" class="green">{{ row.step5 }}</span>
						<span v-else> {{ row.step5 }}</span>
					</template>
					<!-- AttachIPPF -->
					<template slot-scope="{ row }" slot="step8">
						<span v-if="row.category === 'wip'" class="green">{{ row.step8 }}</span>
						<span v-else> {{ row.step8 }}</span>
					</template>
					<!-- Packing2 -->
					<template slot-scope="{ row }" slot="step14">
						<span v-if="row.category === 'wip'" class="red">{{ row.step14 }}</span>
						<span v-else> {{ row.step14 }}</span>
					</template>
				</Table>
			</Card>
			<!-- <TabKanban /> -->
		</div>
	</div>
</template>

<script>
import { getlistReq, exportReq } from "@/api/bill-manage/led-wip-report";
import { formatDate, getButtonBoolean } from "@/libs/tools";
import { exportFile } from "@/libs/tools";

export default {
	components: {},
	name: "led-wip-report",
	data() {
		return {
			uploadImgUrl: "",
			data: [], // 表格数据
			btnData: [],
			searchPoptipModal: false,
			req: {
				workOrderInfo: "", //workOrderInfo
				// ...this.$config.pageConfig,
			}, //查询数据
			searchObj: {},
			columns: [
				{
					title: "Line",
					key: "line",
					fixed: "left",
					minWidth: 80,
					ellipsis: true,
					tooltip: true,
					align: "center",
				},
				{
					title: "Model",
					minWidth: 80,
					align: "center",
					key: "mode",
				},
				{
					title: "MoType",
					minWidth: 80,
					align: "center",
					key: "moType",
				},
				{
					title: "MoNumber",
					minWidth: 100,
					align: "center",
					slot: "moNumber",
				},
				{
					title: "MoQty",
					minWidth: 80,
					align: "center",
					slot: "moQty",
				},
				{
					title: "Category",
					minWidth: 80,
					align: "center",
					slot: "category",
				},
				{
					title: "AutoTape",
					minWidth: 80,
					align: "center",
					key: "step1",
				},
				{
					title: "HBDispense",
					minWidth: 80,
					align: "center",
					key: "step2",
				},
				{
					title: "OP40",
					minWidth: 80,
					align: "center",
					slot: "step3",
				},
				{
					title: "PreBake",
					minWidth: 80,
					align: "center",
					slot: "step5",
				},
				{
					title: "DamDispense",
					minWidth: 85,
					align: "center",
					key: "step6",
				},
				{
					title: "FillDispense",
					minWidth: 80,
					align: "center",
					key: "step7",
				},
				{
					title: "AttachIPPF",
					minWidth: 80,
					align: "center",
					slot: "step8",
				},
				{
					title: "TapePeeling",
					minWidth: 80,
					align: "center",
					key: "step9",
				},
				{
					title: "I16",
					minWidth: 80,
					align: "center",
					key: "step10",
				},
				{
					title: "FVI",
					minWidth: 80,
					align: "center",
					key: "step11",
				},
				{
					title: "OQC",
					minWidth: 80,
					align: "center",
					key: "step12",
				},
				{
					title: "Packing1",
					minWidth: 80,
					align: "center",
					key: "step13",
				},
				{
					title: "Packing2",
					minWidth: 80,
					align: "center",
					slot: "step14",
				},
			],
			tableConfig: { ...this.$config.tableConfig }, // table配置
			searchTime: formatDate(new Date()),
		};
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	deactivated() {
		this.searchPoptipModal = false;
	},
	methods: {
		getImages(el) {
			let file = el.target.files[0];
			let type = file.name.split(".")[1];
			if (type.toLowerCase() === "xlsx") {
				this.uploadImgUrl = file.name;
				this.pageLoad(file);
			} else {
				this.$Msg.warn("只能上传xlsx格式");
			}
		},
		changeInput(e) {
			if (e) {
				this.uploadImgUrl = e;
			} else {
				this.$refs.files.value = "";
				this.uploadImgUrl = "";
			}
			this.$emit("input", this.uploadImgUrl);
			this.$emit("change", this.uploadImgUrl);
		},
		// 获取分页列表数据
		pageLoad(file) {
			this.tableConfig.loading = false;
			let formData = new FormData();
			formData.append("data", file);

			getlistReq(formData)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						this.data = res.result || [];
						this.searchTime = formatDate(new Date());
						this.searchPoptipModal = false;
					} else {
						this.$Msg.warning(res.message);
					}
				})
				.catch(() => (this.tableConfig.loading = false));
		},
		// 导出
		exportClick() {
			exportReq({}).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("led-wip-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		//合并单元格
		handleSpan({ row, column, rowIndex, columnIndex }) {
			if (rowIndex % 2 === 0 && (columnIndex === 0 || columnIndex === 1)) {
				return {
					rowspan: 2,
					colspan: 1,
				};
			}
			if (rowIndex % 2 != 0 && (columnIndex === 0 || columnIndex === 1)) {
				return {
					rowspan: 0,
					colspan: 0,
				};
			}
		},
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 180;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.files.value = "";
			this.uploadImgUrl = "";
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
	},
	mounted() {
		this.pageLoad();
	},
};
</script>
<style lang="less" scoped>
.led-wip-report {
	.title {
		width: 100%;
		height: 3rem;
		text-align: center;
		line-height: 3rem;
		font-size: 1.32rem;
		font-weight: bold;
		color: #fdf61f;
		background: #030d16;
		position: relative;
		.title-name {
			display: inline-block;
			text-align: center;
			width: 100%;
		}
		.title-time {
			font-size: 1.02rem;
			text-align: center;
			display: inline-block;
			/* padding-left: 1rem; */
			width: 15%;
			position: absolute;
			top: 0px;
			right: 8rem;
			color: #ffffff;
			background: #27ce88;
		}
	}
}
.file {
	position: absolute;
	width: 100%;
	right: 0;
	top: 0;
	opacity: 0;
}
.green {
	color: #00ff66;
	background-color: #4b997240;
	padding: 7px 18px;
	margin: 3px 0px;
	border-radius: 3px;
	cursor: default;
	font-weight: bold;
	display: inline-block;
	min-width: 4rem;
}
.red {
	color: #ff0404;
	background-color: #cf676747;
	padding: 7px 18px;
	margin: 3px 0px;
	border-radius: 3px;
	cursor: default;
	font-weight: bold;
	display: inline-block;
	min-width: 4rem;
}
/deep/.ivu-table .ivu-table-header th,
/deep/.ivu-table .ivu-table-body th,
/deep/.ivu-table .ivu-table-fixed-header th,
/deep/.ivu-table .ivu-table-fixed-body th,
/deep/.ivu-table .ivu-table-header td,
/deep/.ivu-table .ivu-table-body td,
/deep/.ivu-table .ivu-table-fixed-header td,
/deep/.ivu-table .ivu-table-fixed-body td {
	height: 40px !important;
	padding: 0;
	background: #020c16d4;
	color: #fff;
}
/deep/.ivu-table {
	background-color: #050f16;
}
</style>
