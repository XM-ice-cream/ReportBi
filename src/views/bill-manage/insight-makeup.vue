/* Insight状态查询 */
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
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
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
										<FormItem :label="$t('endTime')" prop="endTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('endTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.endTime"
											></DatePicker>
										</FormItem>
										<!-- UnitId -->
										<FormItem label="UnitId" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + 'UnitId' + $t('multiple,separated')" />
										</FormItem>
										<!-- Station -->
										<FormItem label="站点" prop="station">
											<Input v-model.trim="req.station" :placeholder="$t('pleaseEnter') + '站点'" />
										</FormItem>
										<!-- TrackTooling -->
										<FormItem label="TrackTooling" prop="trackTooling">
											<Input v-model.trim="req.trackTooling" :placeholder="$t('pleaseEnter') + 'TrackTooling'" />
										</FormItem>
										<!-- Customer -->
										<FormItem label="辅耗材" prop="consumer">
											<Input v-model.trim="req.consumer" :placeholder="$t('pleaseEnter') + '辅耗材'" />
										</FormItem>
										<!-- 打件资料 -->
										<FormItem label="打件资料" prop="generate">
											<Input v-model.trim="req.generate" :placeholder="$t('pleaseEnter') + '打件资料'" />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="pageLoad()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<i-col span="18">
							<button-custom :btnData="btnData" @on-import-click="buttonCustomClick('ImportFormData', 'uploadAttachment')"></button-custom>
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
					<template slot="operator" slot-scope="{ row }">
						<div class="operator">
							<p @click="updateStatus(row)">更新状态</p>
						</div>
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
			<!-- 导入 -->
			<ImportFormData @fileUpload="fileUpload" ref="ImportFormData" />
		</div>
	</div>
</template>

<script>
import { getpagelistReq, updateStatusReq, uploadReq } from "@/api/bill-manage/insight-makeup";
import { formatDate, getButtonBoolean, commaSplitString, renderDate } from "@/libs/tools";
import ImportFormData from "@/components/import-formData";

export default {
	name: "insight-makeup",
	components: { ImportFormData },
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			modalFlag: false, //批量上传
			req: {
				startTime: "",
				endTime: "",
				unitId: "",
				station: "",
				trackTooling: "",
				consumer: "",
				generate: "",
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
				// { title: "Recordid", key: "recordid", width: 120 },
				{ title: "UnitId", key: "unitId", minWidth: 160, tooltip: true, align: "center" },
				{ title: "Station", key: "station", minWidth: 80, tooltip: true, align: "center" },
				{ title: "Line", key: "line", minWidth: 100, tooltip: true, align: "center" },
				{ title: "TrackTooling", key: "trackTooling", minWidth: 60, tooltip: true, align: "center" },
				{ title: "Generate", key: "generate", minWidth: 160, tooltip: true, align: "center" },
				{ title: "Consumer", key: "consumer", minWidth: 120, tooltip: true, align: "center" },
				{ title: "创建时间", key: "createdate", minWidth: 120, render: renderDate, tooltip: true, align: "center" },
				{ title: "操作", slot: "operator", width: 100, tooltip: true, align: "center" },
			], // 表格数据
		};
	},
	activated() {
		this.tableConfig.loading = false;
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
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
			this.selectObj = {};
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			let { startTime, endTime, unitId, station, trackTooling, consumer, generate } = this.req;
			this.tableConfig.loading = true;
			let obj = {
				orderField: "unitid", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					station,
					trackTooling,
					consumer,
					generate,
					unitId: commaSplitString(unitId).join(),
				},
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
				.finally(() => (this.searchPoptipModal = false))
				.catch(() => (this.tableConfig.loading = false));
		},
		//更新状态
		updateStatus(row) {
			this.$Modal.confirm({
				title: "确认要更新该笔数据状态吗?",
				onOk: () => {
					updateStatusReq({ id: row.id }).then((res) => {
						if (res.code == 200) {
							this.$Msg.success("更新状态成功！");
							this.pageLoad(); //刷新当前页面
							return;
						} else {
							this.$Msg.error(`${res.message}`);
						}
					});
				},
				//   onCancel: () => this.clearGraphData(),
			});
		},

		// 按钮公共方法
		buttonCustomClick(refName, title) {
			this.$refs[refName].drawerTitle = this.$t(title);
			this.$refs[refName].drawerFlag = true;
		},
		//上传附件
		fileUpload(file) {
			let formData = new FormData();
			formData.append("file", file);
			uploadReq(formData).then((res) => {
				if (res.code === 200) {
					this.$Msg.success(this.$t("uploadSuccess"));
					this.pageLoad();
					this.$refs.ImportFormData.drawerFlag = false;
				} else {
					let content = `${errorType(this, res)}<br> ${res.message}`;
					this.$Modal.error({
						title: this.$t("uploadAttachment") + this.$t("fail"),
						content: content,
					});
				}
			});
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchPoptipModal = false;
			this.$nextTick(() => {
				this.searchPoptipModal = true;
			});
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
<style scoped lang="less">
.update-btn {
	color: #27ce88 !important;
	background-color: #fff !important;
	border-color: #27ce88 !important;
}
</style>
