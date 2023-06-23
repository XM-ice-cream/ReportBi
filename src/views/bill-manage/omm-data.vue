/* OMM数据 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
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
										<!-- 站点 -->
										<FormItem label="站点" prop="stationType">
											<Select v-model="req.stationType" clearable transfer :placeholder="$t('pleaseEnter') + '站点'">
												<Option v-for="(item, i) in stationList" :value="item.detailCode" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
										<!-- 类别 -->
										<FormItem :label="$t('category')" prop="category">
											<Input v-model.trim="req.category" :placeholder="$t('pleaseEnter') + $t('category')" />
										</FormItem>
										<!-- 条形码 -->
										<FormItem :label="$t('barCode')" prop="barCode">
											<Input v-model.trim="req.barCode" placeholder="请输入条形码,多个以英文逗号或空格分隔" />
										</FormItem>
										<!-- 参数2 -->
										<FormItem label="参数2" prop="opt2">
											<Input v-model.trim="req.opt2" :placeholder="$t('pleaseEnter') + '参数2'" />
										</FormItem>
										<!-- 参数3 -->
										<FormItem label="参数3" prop="opt3">
											<Input v-model.trim="req.opt3" :placeholder="$t('pleaseEnter') + '参数3'" />
										</FormItem>
										<!-- 参数4 -->
										<FormItem label="参数4" prop="opt4">
											<Input v-model.trim="req.opt4" :placeholder="$t('pleaseEnter') + '参数4'" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/omm-data";
import { getButtonBoolean, formatDate, exportFile, renderDate, commaSplitString } from "@/libs/tools";
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
export default {
	name: "omm-data",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				stationType: "",
				category: "",
				barCode: "", //条形码
				opt2: "",
				opt3: "",
				opt4: "",
				...this.$config.pageConfig,
			}, //查询数据
			stationList: [],
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
				{ title: "站点", key: "station", align: "center", tooltip: true },
				{ title: "类别", key: "category", align: "center", tooltip: true },
				{ title: "参数2", key: "opT2", align: "center", tooltip: true },
				{ title: "参数3", key: "opT3", align: "center", tooltip: true },
				{ title: "参数4", key: "opT4", align: "center", tooltip: true },
				{ title: "设备ID", key: "eqpid", align: "center", tooltip: true },
				{ title: "Barcode", key: "barcode", align: "center", width: 150, tooltip: true },
				{ title: "编号", key: "faicode", align: "center", tooltip: true },
				{ title: "测量值", key: "measuredvalue", align: "center", tooltip: true },
				{ title: "标准值", key: "standardvalue", align: "center", tooltip: true },
				{ title: "上公差", key: "tolerancE_UPPER", align: "center", tooltip: true },
				{ title: "下公差", key: "tolerancE_LOWER", align: "center", tooltip: true },
				{ title: "超标值", key: "exceedstandardvalue", align: "center", tooltip: true },
				{ title: "超出公差值", key: "exceedtolerancevalue", align: "center", tooltip: true },
				{ title: "解析时间", key: "filecretetime", align: "center", width: 125, render: renderDate, tooltip: true },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.getDataItemData();
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
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, stationType, category, opt2, opt3, opt4, barCode } = this.req;
			if (stationType) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "FILECRETETIME", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								barCode: commaSplitString(barCode).join(),
								stationType,
								category,
								opt2,
								opt3,
								opt4,
							},
						};
						getpagelistReq(obj)
							.then((res) => {
								this.tableConfig.loading = false;
								if (res.code === 200) {
									let { data, pageSize, pageIndex, total, totalPage } = res.result;
									this.data = data || [];
									this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
									this.searchPoptipModal = false;
								}
							})
							.catch(() => (this.tableConfig.loading = false));
					}
				});
			} else {
				this.$Msg.warning(this.$t("pleaseEnter") + "站点");
			}
		},
		// 导出
		exportClick() {
			let { startTime, endTime, stationType, category, opt2, opt3, opt4, barCode } = this.req;
			if (stationType) {
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					barCode: commaSplitString(barCode).join(),
					stationType,
					category,
					opt2,
					opt3,
					opt4,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `OMM数据${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseEnter") + "站点");
			}
		},
		// 点击编码规则中的加号按钮触发
		async getDataItemData() {
			this.stationList = await this.getDataItemDetailList("OMMStation");
		},
		async getDataItemDetailList(itemCode) {
			const obj = { itemCode, enabled: 1, oderType: 0 };
			let arr = [];
			await getdataitemlistReq(obj).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
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
};
</script>
