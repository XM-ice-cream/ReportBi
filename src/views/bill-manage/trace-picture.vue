/* TracePicture */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- UnitId -->
										<FormItem label="UnitId" prop="unitid">
											<Input v-model.trim="req.unitid" placeholder="请输入unitid" />
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
					<template slot="operation" slot-scope="{ row }">
						<Button type="primary" @click="downLoadPicture(row)">下载图片</Button>
					</template>
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
import { getpagelistReq, exportReq, downloadpictureReq } from "@/api/bill-manage/trace-picture";
import { getButtonBoolean, renderDate, formatDate, exportFile } from "@/libs/tools";

export default {
	components: {},
	name: "trace-picture",
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			lineList: [], //线体
			modelList: [], //机种
			req: {
				unitid: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "WorkOrder", key: "workorder", align: "center", minWidth: 100, tooltip: true },
				{ title: "UnitId", key: "unitid", align: "center", minWidth: 150, tooltip: true },
				{ title: "PanelNo", key: "panelno", align: "center", minWidth: 100, tooltip: true },
				{ title: "LineName", key: "linename", align: "center", minWidth: 100, tooltip: true },
				{ title: "EqpCode", key: "eqpcode", align: "center", minWidth: 100, tooltip: true },
				{ title: "ProcessName", key: "processname", align: "center", minWidth: 100, tooltip: true },
				{ title: "FileName", key: "filename", align: "center", minWidth: 100, tooltip: true },
				{ title: "FileDate", key: "filedate", align: "center", minWidth: 100, tooltip: true, render: renderDate },
				{ title: "创建时间", key: "createdate", align: "center", minWidth: 100, tooltip: true, render: renderDate },
				{ title: "操作", slot: "operation", align: "center", minWidth: 100, tooltip: true },
			], // 表格数据
		};
	},

	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					const { unitid, ascending, pageSize, pageIndex } = this.req;
					const obj = {
						orderField: "unitid", // 排序字段
						ascending, // 是否升序
						pageSize, // 分页大小
						pageIndex, // 当前页码
						data: { unitid },
					};

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
					this.searchPoptipModal = false;
				}
			});
		},
		// 导出文件
		exportClick() {
			const { unitid } = this.req;
			const obj = {
				unitid,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("trace-picture")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		//图片下载
		downLoadPicture(row) {
			const { filefullname } = row;
			downloadpictureReq({ filefullname }).then((res) => {
				let url = window.URL.createObjectURL(res);
				let a = document.createElement("a");
				a.href = url;
				a.download = filefullname;
				a.click();
			});
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
	mounted() {
		this.searchClick();
		this.autoSize();
		this.tableConfig.loading = false;
		window.addEventListener("resize", () => this.autoSize);
		getButtonBoolean(this, this.btnData);
	},
};
</script>
<style scoped>
.replydetail {
	color: #0078dd;
	background-color: #4127ce00;
	border-color: #0189fd;
}
</style>
