/* 新版 MaverickFaca */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- ID -->
										<FormItem label="ID" prop="id">
											<Input v-model.trim="req.id" clearabled />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="18">
							<button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<!-- <Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-selection-change="currentClick"
				>
				</Table> -->
				<vxe-table
					ref="xTable1"
					size="mini"
					resizable
					:border="tableConfig.border"
					align="center"
					:loading="tableConfig.loading"
					:data="data"
					:height="tableConfig.height"
					@checkbox-change="currentClick"
				>
					<vxe-column type="seq" width="60"></vxe-column>
					<vxe-column type="checkbox" width="60" show-overflow></vxe-column>
					<vxe-column field="pid" title="ID" width="60" show-overflow></vxe-column>
					<vxe-column field="serial_Number" title="序列号" min-width="140" show-overflow> </vxe-column>
					<vxe-column field="product" title="机种" min-width="80" show-overflow></vxe-column>
					<vxe-column field="resultdate" title="ResultDate" min-width="140" show-overflow></vxe-column>
					<vxe-column field="stage" title="Stage" min-width="80" show-overflow></vxe-column>
					<vxe-column field="station" title="工站" min-width="100" show-overflow></vxe-column>
					<vxe-column field="line" title="线体" min-width="120" show-overflow></vxe-column>
					<vxe-column field="teststationcode" min-width="100" title="TestStation" show-overflow></vxe-column>
					<vxe-column field="failuresymptom" min-width="140" title="FailSymptom" show-overflow></vxe-column>
					<vxe-column field="category" title="Category" min-width="120" show-overflow></vxe-column>
					<vxe-column field="location" title="Location" min-width="80" show-overflow></vxe-column>
					<vxe-column field="rootcause" title="RootCause" min-width="80" show-overflow></vxe-column>
					<vxe-column field="nextDRI" title="NextDRI" min-width="80" show-overflow></vxe-column>
					<vxe-column field="status" title="Status" min-width="100" show-overflow></vxe-column>
				</vxe-table>
				<div style="background: #fff">
					<div class="reply-maverick">
						<div class="title">回复列表信息:</div>
						<reply-maverick :selectArr="selectArr" ref="replymaverick" @pageLoad="pageLoad" />
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
import { getlistReq } from "@/api/bill-manage/maverick-faca";
import { getButtonBoolean, renderDate } from "@/libs/tools";
import ReplyMaverick from "./maverick-faca/reply-maverick-new.vue";
import { utils, writeFile } from "xlsx"; // 注意处理方法引入方式

export default {
	components: { ReplyMaverick },
	name: "maverick-faca-new",
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			req: {
				id: "",
				sn: "",
				guid: "",
				userId: "",
			}, //查询数据
			columns: [
				{ type: "index", fixed: "left", width: 50, align: "center" },
				{ type: "selection", width: 60, align: "center" },
				{ title: "ID", key: "pid", align: "center", minWidth: 50, tooltip: true },
				{ title: "序列号", key: "serial_Number", align: "center", minWidth: 150, tooltip: true },
				{ title: "机种", key: "product", align: "center", minWidth: 100, tooltip: true },
				{ title: "ResultDate", key: "resultdate", align: "center", width: 150, tooltip: true, render: renderDate },
				{ title: "Stage", key: "stage", align: "center", width: 100, tooltip: true },
				{ title: "工站", key: "station", align: "center", width: 100, tooltip: true },
				{ title: "线体", key: "line", align: "center", minWidth: 100, tooltip: true },
				{ title: "TestStation", key: "teststationcode", align: "center", minWidth: 90, tooltip: true },
				{ title: "FailSymptom", key: "failuresymptom", align: "center", minWidth: 120, tooltip: true },
				{ title: "Category", key: "category", align: "center", minWidth: 100, tooltip: true },
				{ title: "Location", key: "location", align: "center", minWidth: 80, tooltip: true },
				{ title: "RootCause", key: "rootcause", align: "center", minWidth: 80, tooltip: true },
				{ title: "NextDRI", key: "nextDRI", align: "center", minWidth: 80, tooltip: true },
				{ title: "Status", key: "status", align: "center", minWidth: 50, tooltip: true },
			], // 表格数据
			selectArr: [], //表格选中数据
		};
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	watch: {},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						id: this.req.id,
					};
					getlistReq(obj)
						.then((res) => {
							this.tableConfig.loading = false;
							if (res.code === 200) {
								this.data = res?.result || [];
								console.log("res", res.code, this.tableConfig.loading, JSON.stringify(this.data));
							}
						})
						.finally(() => (this.tableConfig.loading = false));
					this.searchPoptipModal = false;
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
		},
		// 某一行高亮时触发
		currentClick() {
			const selection = this.$refs.xTable1.getCheckboxRecords();
			const status = selection[0]?.status || "";
			const isRight = selection.every((item) => item.status === status && status !== "Closed");
			if (isRight) {
				this.selectArr = selection;
			} else {
				this.$Message.error("选择状态必须一致,并且状态不可为Closed,请核对~");
			}
		},
		exportClick() {
			let obj = {
				id: this.req.id,
			};
			getlistReq(obj).then((res) => {
				this.tableConfig.loading = false;
				if (res.code === 200) {
					let data = res.result || [];
					let titleList = [
						"序号",
						"ID",
						"序列号",
						"机种",
						"ResultDate",
						"Stage",
						"工站",
						"线体",
						"TestStation",
						"FailSymptom",
						"Category",
						"Location",
						"RootCause",
						"NextDRI",
						"Status",
					]; // 表格表头
					let tableData = [titleList];
					tableData[0][0] = "序号";
					data.map((item, index) => {
						let rowData = [];
						//导出内容的字段
						rowData = [
							index + 1,
							item.id,
							item.serial_Number,
							item.product,
							item.resultdate,
							item.stage,
							item.station,
							item.line,
							item.teststationcode,
							item.failuresymptom,
							item.category,
							item.location,
							item.rootcause,
							item.nextDRI,
							item.status,
						];
						tableData.push(rowData);
					});
					let ws = utils.aoa_to_sheet(tableData);
					let wb = utils.book_new();
					utils.book_append_sheet(wb, ws, "MaverickFACA"); // 工作簿名称
					writeFile(wb, "MaverickFACA.xlsx"); // 保存的文件名
				}
			});
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 120 - 60 - 430;
			if (this.tableConfig.height < 200) this.tableConfig.height = 200;
			console.log(this.tableConfig.height);
		},
		//获取url参数
		getUrlParams() {
			let url = window.location.href;
			if (url.indexOf("?") != -1) {
				let obj = {};
				let arr = url.slice(url.indexOf("?") + 1).split("&");
				arr.forEach((item) => {
					let param = item.split("=");
					obj[param[0]] = param[1];
				});
				return obj;
			} else {
				return null;
			}
		},
	},
	mounted() {
		const params = this.getUrlParams();
		this.req.id = params?.id || "";
		this.searchClick();
		this.autoSize();
		this.tableConfig.loading = false;
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
};
</script>
<style scoped lang="less">
.replydetail {
	color: #0078dd;
	background-color: #4127ce00;
	border-color: #0189fd;
}
.reply-maverick {
	height: 440px;
	padding: 0 10px;
	background: #00000008;
	margin: 5px 0;
	border: 1px dashed #ccc;
	.title {
		padding: 7px 10px;
		color: #000;
		font-weight: bold;
		margin-left: -5px;
		margin-top: 5px;
		&:before {
			content: "";
			height: 20px;
			width: 4px;
			display: inline-block;
			background-color: #27ce88;
			margin-right: 10px;
			margin-bottom: -5px;
		}
	}
}
.main .content-wrapper-div {
	height: auto !important;
}
</style>
