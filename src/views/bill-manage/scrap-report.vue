/* 报废报表 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6" style="display: flex">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="70" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 预览服务器 -->
										<FormItem :label="$t('previewServer')" prop="previewServerIP">
											<Select transfer v-model="req.previewServerIP" clearable :placeholder="$t('pleaseSelect') + $t('previewServer')">
												<Option v-for="(item, i) in AOIRreviewFileData" :value="item.detailCode" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
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
										<!-- 工单 -->
										<FormItem :label="$t('workOrder')" prop="workOrder">
											<v-selectpage
												v-if="searchPoptipModal"
												multiple
												class="select-page-style"
												key-field="workOrder"
												show-field="workOrder"
												:data="workerPageListUrl"
												v-model="req.workOrder"
												:placeholder="$t('pleaseSelect') + $t('workOrder')"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
											>
											</v-selectpage>
										</FormItem>
										<!-- 大条码 -->
										<FormItem :label="$t('panelNo')" prop="panelNo">
											<Input v-model.trim="req.panelNo" :placeholder="$t('pleaseEnter') + 'PanelNo' + $t('multiple,separated')" />
										</FormItem>
										<!-- 小条码 -->
										<FormItem :label="$t('barCoding')" prop="unitId">
											<Input v-model.trim="req.unitId" :placeholder="$t('pleaseEnter') + $t('barCoding') + $t('multiple,separated')" />
										</FormItem>
										<!-- 线体名称 -->
										<FormItem :label="$t('lineName')" prop="lineName">
											<Select
												v-model="req.lineName"
												clearable
												transfer
												filterable
												label-in-value
												multiple
												:placeholder="`${$t('pleaseSelect')}${$t('line')}`"
												:max-tag-count="1"
											>
												<Option v-for="(item, i) in lineList" :value="item.name" :key="i">{{ item.name }}</Option>
											</Select>
										</FormItem>
										<!-- 机种 -->
										<FormItem :label="$t('model')" prop="modelName">
											<v-selectpage
												class="select-page-style"
												ref="modelName"
												v-if="searchPoptipModal"
												key-field="modelName"
												show-field="modelName"
												:data="modelPageListUrl"
												v-model="req.modelName"
												multiple
												:placeholder="$t('pleaseSelect') + $t('model')"
												:result-format="
													(res) => {
														return {
															totalRow: res.total,
															list: res.data || [],
														};
													}
												"
											>
											</v-selectpage>
										</FormItem>
										<!-- 下载是否有图片 -->
										<FormItem label="下载是否有图片" prop="isPicture" :label-width="100">
											<i-switch size="large" v-model="req.isPicture" :true-value="1" :false-value="0">
												<span slot="open">有</span>
												<span slot="close">无</span>
											</i-switch>
										</FormItem>
										<!-- 备注 -->
										<FormItem :label="$t('remark')" prop="remark">
											<Input v-model.trim="req.remark" :placeholder="$t('pleaseEnter') + $t('remark')" />
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
				<Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
				>
					<template slot-scope="{ row }" slot="image">
						<Button style="height: 16px" v-if="row.pictures" type="primary" size="small" @click="previewImage(row.pictures)">{{
							$t("preview")
						}}</Button>
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
		<Modal draggable v-model="visible" :closable="false">
			<!-- <img class="img-style" :src="imgUrl"/> -->
			<p name="result" id="result"></p>
		</Modal>
	</div>
</template>

<script>
import { getpagelistReq, exportReq, exportNoPictureReq } from "@/api/bill-manage/scrap-report";
import { workerPageListUrl } from "@/api/material-manager/order-info";
import { getAreaFloorLineListReq } from "@/api/basis-info/area-floor";
import { formatDate, getButtonBoolean, exportFile, commaSplitString } from "@/libs/tools";
import { getlistReq } from "@/api/system-manager/data-item";
import { Spin } from "view-design";
import { modelPageListUrl } from "@/api/basis-info/model-manager";
import axios from "axios";
export default {
	name: "scrap-report",
	data() {
		return {
			imgUrl: "",
			visible: false,
			workerPageListUrl: workerPageListUrl(),
			modelPageListUrl: modelPageListUrl(),
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			AOIRreviewFileData: [],
			req: {
				startTime: "",
				endTime: "",
				workOrder: "",
				unitId: "",
				panelNo: "",
				lineName: "",
				modelName: "",
				remark: "",
				previewServerIP: "",
				isPicture: 1,
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
				{ title: this.$t("workOrder"), key: "workorder", align: "center", width: 120, tooltip: true },
				{ title: this.$t("panelNo"), key: "panelno", align: "center", width: 120, tooltip: true },
				{ title: this.$t("unitId"), key: "unitid", align: "center", width: 150, tooltip: true },
				{ title: this.$t("lineName"), key: "linename", align: "center", width: 120, tooltip: true },
				{ title: this.$t("modelName"), key: "modelname", align: "center", width: 120, tooltip: true },
				{ title: this.$t("stage"), key: "stage", align: "center", width: 80, tooltip: true },
				{ title: this.$t("curProcessName"), key: "curprocessname", align: "center", width: 150, tooltip: true },
				{ title: "生产时间", key: "inprocesstime", align: "center", width: 100, tooltip: true },
				{ title: "报废时间", key: "scrapdate", align: "center", width: 100, tooltip: true },
				{ title: this.$t("description"), key: "description", align: "center", width: 150, tooltip: true },
				{ title: this.$t("scrapReason"), key: "scrapreason", align: "center", width: 150, tooltip: true },
				{ title: "签核状态", key: "state", align: "center", width: 60, tooltip: true },
				{ title: "下一级签核人员", key: "nextusername", align: "center", width: 60, tooltip: true },
				{ title: "分析单位", key: "unitcode", align: "center", width: 150, tooltip: true },
				{ title: "PCB厂商", key: "vendorname", align: "center", width: 150, tooltip: true },
				{ title: "PCB料号", key: "partname", align: "center", width: 150, tooltip: true },
				{ title: this.$t("name"), key: "name", align: "center", width: 100, tooltip: true },
				{ title: this.$t("createUserName"), key: "createusername", align: "center", width: 100, tooltip: true },
				{ title: this.$t("remark"), key: "remark", align: "center", width: 150, tooltip: true },

				// { title: this.$t("image"), slot: "image", align: "center", width: 80 },
			], // 表格数据
			lineList: [], //线体集合
		};
	},
	activated() {
		this.getDataItemData();
		this.autoSize();
		this.getLineList();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		//预览图片
		previewImage(fileFullName) {
			if (this.req.previewServerIP) {
				var files = fileFullName.split(",");
				let reviewUrl = this.req.previewServerIP + "/download?filefullname=";
				for (var i = 0; i < files.length; i++) {
					let imgUrl = reviewUrl + files[i];
					window.open(imgUrl, files[i]);
				}
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("previewServer") + "图片预览地址");
			}
		},
		downloadImage(fileFullName) {
			if (this.req.previewServerIP) {
				let imgurl = this.req.previewServerIP + "/download?filefullname=" + fileFullName; // 获取图片地址
				Spin.show();
				axios
					.get(imgurl, { responseType: "blob" })
					.then((res) => {
						let url = window.URL.createObjectURL(res.request.response);
						let a = document.createElement("a");
						a.href = url;
						a.download = fileFullName;
						a.click();
						Spin.hide();
					})
					.catch(() => {
						Spin.hide();
					});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("previewServer") + "图片预览地址");
			}
		},
		// 获取数据字典数据
		async getDataItemData() {
			this.AOIRreviewFileData = await this.getDataItemDetailList("AOIRreviewFile");
			this.req.previewServerIP = this.AOIRreviewFileData?.[0].detailCode;
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 获取线体数据
		async getLineList() {
			const obj = {
				category: 4,
				systemFlag: this.$store.state.systemFlag,
				enabled: 1,
			};
			await getAreaFloorLineListReq(obj).then(async (res) => {
				if (res.code === 200) {
					this.lineList = res.result || [];
				}
			});
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			let { startTime, endTime, workOrder, unitId, panelNo, lineName, modelName, remark, previewServerIP } = this.req;
			this.tableConfig.loading = true;
			let obj = {
				orderField: "INPROCESSTIME", // 排序字段
				ascending: false, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					workOrder,
					unitId: commaSplitString(unitId).join(),
					panelNo: commaSplitString(panelNo).join(),
					lineName: lineName.toString(),
					modelName: commaSplitString(modelName).join(),
					remark,
					previewServerIP,
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
				.catch(() => (this.tableConfig.loading = false));
		},
		// 导出
		exportClick() {
			let { startTime, endTime, workOrder, unitId, panelNo, lineName, modelName, remark, previewServerIP, isPicture } = this.req;
			const obj = {
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				workOrder,
				unitId: commaSplitString(unitId).join(),
				panelNo: commaSplitString(panelNo).join(),
				lineName: lineName.toString(),
				modelName: commaSplitString(modelName).join(),
				remark,
				previewServerIP,
			};
			let requestApi = exportReq;
			if (!isPicture) requestApi = exportNoPictureReq;
			requestApi(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("scrap-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
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
			this.tableConfig.height = document.body.clientHeight - 170 - 60;
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
		//有从工单WIP报表跳转到报废报表
		const workorder = this.$route.params.workorder;
		if (workorder) {
			this.req.workOrder = workorder;
		}
		this.pageLoad();
	},
};
</script>
