/* Serin部分站点查询 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual">
								<Button @click.stop="poptipModal = !poptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" :rules="ruleValiadate">
										<!-- 站点 -->
										<FormItem :label="$t('stepName')" prop="stationType">
											<Select v-model="req.stationType" clearable filterable :placeholder="`${$t('pleaseEnter')} 站点`">
												<Option v-for="(item, i) in stationTypeList" :value="item" :key="i">{{ item }}</Option>
											</Select>
										</FormItem>
										<!-- Barcode -->
										<FormItem :label="$t('bigBoardCode')" prop="barCode">
											<Input
												type="text"
												v-model.trim="req.barCode"
												@keyup.enter.native="searchClick()"
												clearable
												:placeholder="$t('pleaseEnter') + $t('bigBoardCode') + $t('multiple,separated')"
											/>
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="12">
							<button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
				>
				</Table>
				<page-custom
					:elapsedMilliseconds="req.elapsedMilliseconds"
					:total="req.total"
					:totalPage="req.totalPage"
					:pageIndex="req.pageIndex"
					:page-size="req.pageSize"
					@on-change="pageChange"
					@on-page-size-change="pageSizeChange"
				/>
			</Card>
		</div>
	</div>
</template>

<script>
import {
	getOp15Req,
	getOp20Req,
	getOp25Req,
	getOp30Req,
	exportOp15Req,
	exportOp20Req,
	exportOp25Req,
	exportOp30Req,
} from "@/api/bill-manage/serinop-report";
import { renderDate, formatDate, getButtonBoolean, exportFile, commaSplitString } from "@/libs/tools";

export default {
	name: "serinop-report",
	data() {
		return {
			poptipModal: false,
			noRepeatRefresh: false, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			req: {
				barCode: "", // 大板码
				stationType: "OP20", // 站点
				...this.$config.pageConfig,
			}, //查询数据
			columns: [],
			OP15columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "BarCode", key: "barCode", align: "center", minWidth: 100 },
				{ title: "StartTime", key: "StartTime", align: "center", render: renderDate, minWidth: 150 },
				{ title: "StationType", key: "station_Type", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Areap", key: "area_p", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Area", key: "area", align: "center", minWidth: 100 },
				{ title: "HeightP", key: "height_P", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Height", key: "height", align: "center", tooltip: true, minWidth: 100 },
				{ title: "VolumeP", key: "volume_P", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Volume", key: "volume", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Xoffset", key: "xoffset", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Yoffset", key: "yoffset", align: "center", tooltip: true, minWidth: 100 },
				{ title: "PadSizeX", key: "padsizE_X", align: "center", tooltip: true, minWidth: 100 },
				{ title: "PadSizeY", key: "padsizE_Y", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Result", key: "result", align: "center", tooltip: true, minWidth: 100 },
				{ title: "PinNUM", key: "piN_NUM", align: "center", tooltip: true, minWidth: 100 },
				{ title: "DateYMD", key: "datE_YMD", align: "center", tooltip: true, minWidth: 100 },
				{ title: "TimeHMS", key: "timE_HMS", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Board", key: "board", align: "center", tooltip: true, minWidth: 100 },
				{ title: "HeightStandard", key: "heighT_STANDARD", align: "center", tooltip: true, minWidth: 120 },
				{ title: "AreaStandard", key: "areA_STANDARD", align: "center", tooltip: true, minWidth: 120 },
				{ title: "VolumeStandard", key: "volumE_STANDARD", align: "center", tooltip: true, minWidth: 120 },
				{ title: "ModelName", key: "modeL_NAME", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Lotno", key: "lotno", align: "center", tooltip: true, minWidth: 100 },
				{ title: "StationId", key: "stationid", align: "center", tooltip: true, minWidth: 100 },
				{ title: "Status", key: "status", align: "center", tooltip: true, minWidth: 100 },
			], // 表格数据
			OP20columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "barCode", key: "barCode", align: "center", minWidth: 100 },
				{ title: "areaStandard", key: "areA_STANDARD", align: "center", minWidth: 100 },
				{ title: "area", key: "area", align: "center", tooltip: true, minWidth: 100 },
				{ title: "compName", key: "comp_Name", align: "center", tooltip: true, minWidth: 100 },
				{ title: "faI9", key: "faI9", align: "center", tooltip: true, minWidth: 100 },
				{ title: "faI10", key: "faI10", align: "center", minWidth: 100 },
				{ title: "padGap", key: "paD_GAP", align: "center", tooltip: true, minWidth: 100 },
				{ title: "partType", key: "part_Type", align: "center", tooltip: true, minWidth: 100 },
				{ title: "pinNum", key: "pinNum", align: "center", tooltip: true, minWidth: 100 },
				{ title: "result", key: "result", align: "center", tooltip: true, minWidth: 100 },
				{ title: "xoffset", key: "xoffset", align: "center", width: 70, tooltip: true, minWidth: 100 },
				{ title: "yoffset", key: "yoffset", width: 125, align: "center", tooltip: true, minWidth: 100 },
				{ title: "offestX", key: "srO_TO_CUPAD_OFFSETX", align: "center", tooltip: true, minWidth: 100 },
				{ title: "offestY", key: "srO_TO_CUPAD_OFFSETY", align: "center", tooltip: true, minWidth: 100 },
				{ title: "startTime", key: "startTime", align: "center", render: renderDate, tooltip: true, minWidth: 200 },
				{ title: "stationType", key: "stationType", align: "center", tooltip: true, minWidth: 100 },
				{ title: "status", key: "status", align: "center", tooltip: true, minWidth: 100 },
				{ title: "volumeStandard", key: "volumE_STANDARD", align: "center", tooltip: true, minWidth: 100 },
				{ title: "volume", key: "volume", align: "center", tooltip: true, minWidth: 100 },
				{ title: "heightStandard", key: "heighT_STANDARD", align: "center", tooltip: true, minWidth: 150 },
				{ title: "height", key: "height", align: "center", minWidth: 100 },
				{ title: "top", key: "top", align: "center", tooltip: true, minWidth: 100 },
				{ title: "bottom", key: "bottom", align: "center", tooltip: true, minWidth: 100 },
				{ title: "left", key: "left", align: "center", tooltip: true, minWidth: 100 },
				{ title: "right", key: "right", align: "center", tooltip: true, minWidth: 100 },
			], // 表格数据
			OP25columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "barCode", key: "barCode", align: "center", minWidth: 100 },
				{ title: "boardNo", key: "boardNo", align: "center", minWidth: 100 },
				{ title: "compName", key: "compName", align: "center", tooltip: true, minWidth: 100 },
				{ title: "compType", key: "compType", align: "center", tooltip: true, minWidth: 100 },
				{ title: "errorCode", key: "errorCode", align: "center", tooltip: true, minWidth: 100 },
				{ title: "missingpartresult", key: "missingpartresult", align: "center", minWidth: 100 },
				{ title: "shiftresult", key: "shiftresult", align: "center", tooltip: true, minWidth: 100 },
				{ title: "solderjointresult", key: "solderjointresult", align: "center", tooltip: true, minWidth: 100 },
				{ title: "startTime", key: "startTime", align: "center", render: renderDate, tooltip: true, minWidth: 200 },
				{ title: "stationId", key: "stationId", align: "center", tooltip: true, minWidth: 100 },
				{ title: "stationType", key: "stationType", align: "center", tooltip: true, minWidth: 100 },
				{ title: "status", key: "status", align: "center", tooltip: true, minWidth: 100 },
				{ title: "windowType", key: "windowType", align: "center", tooltip: true, minWidth: 100 },
			], // 表格数据
			OP30columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "barCode", key: "barCode", align: "center", minWidth: 100 },
				{ title: "compName", key: "comp_Name", align: "center", minWidth: 100 },
				{ title: "errorCode", key: "errorCode", align: "center", tooltip: true, minWidth: 100 },
				{ title: "grayLevel", key: "graY_LEVEL", align: "center", tooltip: true, minWidth: 100 },
				{ title: "partType", key: "part_type", align: "center", tooltip: true, minWidth: 100 },
				{ title: "posx", key: "posx", align: "center", minWidth: 100 },
				{ title: "posy", key: "posy", align: "center", tooltip: true, minWidth: 100 },
				{ title: "shiftx", key: "shiftx", align: "center", tooltip: true, minWidth: 100 },
				{ title: "shifty", key: "shifty", align: "center", tooltip: true, minWidth: 100 },
				{ title: "startTime", key: "startTime", align: "center", render: renderDate, tooltip: true, minWidth: 200 },
				{ title: "stationType", key: "stationType", align: "center", tooltip: true, minWidth: 100 },
				{ title: "status", key: "status", align: "center", tooltip: true, minWidth: 100 },
				{ title: "theta", key: "theta", align: "center", tooltip: true, minWidth: 100 },
			], // 表格数据
			data: [], // 表格数据
			btnData: [],
			stationTypeList: ["OP15", "OP20", "OP25", "OP30"], // 线体数据
			ruleValiadate: {
				stationType: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("stepName")}`,
						trigger: "blur",
					},
				],
				barCode: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}${this.$t("bigBoardCode")}`,
						trigger: "blur",
					},
				],
			},
		};
	},
	mounted() {
		//默认OP20列
		this.columns = this.OP20columns;
		// this.pageLoad();
	},
	activated() {
		this.tableConfig.loading = false;
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.poptipModal = false;
		next();
	},
	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			const { barCode, stationType } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "BarCode", // 排序字段
						ascending: this.req.ascending, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						total: 0,
						data: {
							barCode: commaSplitString(barCode).join(),
							stationType,
						},
					};
					const getpagelistReq = this.getRequest("get" + stationType);
					this.columns =
						stationType === "OP20"
							? this.OP20columns
							: stationType === "OP25"
							? this.OP25columns
							: stationType === "OP30"
							? this.OP30columns
							: this.OP15columns;
					getpagelistReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								let { data, pageSize, pageIndex, total, totalPage } = res.result;
								this.data = data || [];
								this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
							}
						})
						.catch(() => (this.tableConfig.loading = false));
				} else {
					this.poptipModal = true;
				}
			});
		},

		// serin导出
		exportClick() {
			const { stationType, barCode } = this.req;
			const obj = {
				barCode: commaSplitString(barCode).join(),
				stationType,
			};
			const exportReq = this.getRequest("export" + stationType);
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${stationType}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		getRequest(key) {
			const obj = {
				getOP15: getOp15Req,
				getOP20: getOp20Req,
				getOP25: getOp25Req,
				getOP30: getOp30Req,
				exportOP15: exportOp15Req,
				exportOP20: exportOp20Req,
				exportOP25: exportOp25Req,
				exportOP30: exportOp30Req,
			};
			return obj[key];
		},
		// 点击搜索按钮触发
		searchClick() {
			this.poptipModal = false;
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 120 - 60;
		},
		// 选择第几页
		pageChange(index) {
			this.req.pageIndex = index;
			this.pageLoad();
		},
		// 选择一页有条数据
		pageSizeChange(index) {
			this.req.pageIndex = 1;
			this.req.pageSize = index;
			this.pageLoad();
		},
	},
};
</script>
