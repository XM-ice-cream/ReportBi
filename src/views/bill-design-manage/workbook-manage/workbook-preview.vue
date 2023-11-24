<template>
	<div class="main page-style workbook-preview-content">
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row class="content-top">
						<!-- 查询条件 -->
						<i-col span="11">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<div class="submitForm">
										<Form ref="submitReq" :label-width="80">
											<!-- 数据集筛选器 -->
											<template v-for="item in andData" v-if="!item.hide">
												<FormItem :label="item.columnRename">
													<!-- 数组 -->
													<Input
														v-if="item.columnType.toUpperCase() === 'STRING'"
														type="textarea"
														:autosize="{ minRows: 5, maxRows: 10 }"
														v-model.trim="item.value"
														clearable
													/>
													<!-- 数字 -->
													<InputNumber v-else-if="item.columnType.toUpperCase() === 'NUMBER'" v-model.trim.number="item.value" clearable />
													<!-- 时间 -->
													<DatePicker
														v-else-if="item.columnType.toUpperCase() === 'DATETIME'"
														v-model="item.value"
														transfer
														type="datetime"
														format="yyyy-MM-dd HH:mm:ss"
														clearable
													></DatePicker>
												</FormItem>
											</template>
											<div style="width: 100%; height: 20px"></div>
											<!-- 工作簿筛选器 -->
											<template v-for="item in filterData">
												<FormItem :label="item.columnRename">
													<!-- 数组 -->
													<Input
														v-if="getFieldsType('STRING', item.columnType)"
														type="textarea"
														:autosize="{ minRows: 5, maxRows: 10 }"
														v-model.trim="item.filterValue"
														clearable
													/>
													<!-- 数字 -->
													<InputNumber v-if="getFieldsType('NUMBER', item.columnType)" v-model.trim="item.filterValue" clearable />
													<!-- 时间 -->
													<DatePicker
														v-else-if="getFieldsType('DATE', item.columnType)"
														v-model="item.filterValue"
														transfer
														type="datetimerange"
														format="yyyy-MM-dd HH:mm:ss"
														clearable
													></DatePicker>
												</FormItem>
											</template>
										</Form>
									</div>

									<div class="poptip-style-button">
										<Button @click="resetClick">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
							<Form inline :labelWidth="100" style="display: inline-block; line-height: 2">
								<FormItem label="Refresh">
									<i-switch size="default" v-model="refreshObj.isRefresh">
										<template #open>
											<span>开</span>
										</template>
										<template #close>
											<span>关</span>
										</template>
									</i-switch>
								</FormItem>
								<FormItem label="刷新频率/分钟" v-if="refreshObj.isRefresh">
									<InputNumber v-model="refreshObj.refeshRate" controls-outside :min="1" :step="1" />
								</FormItem>
							</Form>
						</i-col>

						<!-- 标题 -->
						<i-col span="12">
							<div class="report-title">{{ $route.query.reportName }}</div>
						</i-col>
						<i-col span="1" style="text-align: right">
							<Button type="primary" @click="closeClick" class="close-btn"><Icon type="md-close" /></Button>
						</i-col>
					</Row>
				</div>
				<!-- 工作区 -->
				<componentsTemp
					ref="tempRef"
					:id="submitData.id"
					:isPreview="true"
					:type="markData[0]?.chartType || 'bar'"
					:title="submitData.workBookName"
					:visib="visib"
					:value="chartsData"
					:row="rowData"
					:column="columnData"
					:mark="markData"
				/>
			</Card>
		</div>
	</div>
</template>
<script>
import componentsTemp from "./components/temp.vue";
import { getChartsInfoReq, getConditions } from "@/api/bill-design-manage/workbook-manage.js";
import { getEchoReq, deleteImageReq } from "@/api/bill-design-manage/workbook-design";
import { getlistReq } from "@/api/system-manager/data-item";
import { formatDate, commaSplitReturnString } from "@/libs/tools";

export default {
	name: "workbook-preview",
	components: { componentsTemp },
	props: {},
	watch: {},
	computed: {},

	data() {
		return {
			searchPoptipModal: false,
			submitData: {},
			filterData: [],
			rowData: [],
			columnData: [],
			markData: [],
			chartsData: [],
			andData: [],
			columnTypeList: [],
			refreshObj: { isRefresh: false, refeshRate: 1 },
			interval: null,
			visib: false,
		};
	},
	watch: {
		"refreshObj.isRefresh": {
			handler() {
				const { isRefresh, refeshRate } = this.refreshObj;
				this.settingTime(isRefresh, refeshRate);
			},
			deep: true,
			immediate: true,
		},
	},
	activated() {},
	methods: {
		//加载信息
		pageLoad() {
			getEchoReq({ id: this.submitData.id }).then(async (res) => {
				if (res.code == 200) {
					const { calcItems, filterItems, markStyle, datasetId, workBookName, workBookCode, maxNumber } = res.result;
					//修改浏览器titile
					document.title = workBookName;

					this.submitData = { ...this.submitData, datasetId, workBookName, workBookCode, maxNumber };

					this.filterData = filterItems.map((item) => {
						let filterValue = item.filterValue;
						//时间类型
						if (this.getFieldsType("DATE", item.columnType)) filterValue = item.filterValue?.split(",") || "";
						return { ...item, filterValue };
					}); //过滤器

					this.rowData = calcItems.filter((item) => item.axis == "x"); //行
					this.columnData = calcItems.filter((item) => item.axis == "y"); //列
					this.markData = markStyle && markStyle !== "{}" ? JSON.parse(markStyle) : [{ name: "全部", chartType: "bar", data: [] }]; //标记
					await this.getDataSetFilter();

					this.$nextTick(() => {
						this.searchClick();
					});
				}
			});
		},
		//查询
		searchClick() {
			const { flag, filterItems, andItems } = this.searchCondition(); //查询条件处理
			if (!flag) {
				this.$Msg.error("操作失败，至少要有一个查询条件！");
				return;
			}
			//数据集
			// const { datasetId, maxNumber } = this.submitData;
			this.visib = false;
			const obj = {
				...this.submitData,
				filterItems,
				calcItems: this.rowData.concat(this.columnData),
				markItems: this.markData.map((item) => item.data).flat(),
				andItems,
			};
			getChartsInfoReq(obj)
				.then((res) => {
					//存在有数据返回 但code=-1(数据超过最大范围)
					if (res.code == 200 || res.result?.length > 0) {
						if (res.code == -1) this.$Msg.warning(`${res.message}`);
						this.chartsData = res?.result || [];
						this.visib = true;
						this.$nextTick(() => {
							this.$refs.tempRef.pageLoad();
						});
					} else {
						this.$Msg.error(`${res.message}`);
					}
				})
				.finally(() => {
					this.searchPoptipModal = false;
					this.visib = true;
				});
		},
		//获取数据集对应表的筛选信息
		async getDataSetFilter() {
			const { datasetId } = this.submitData;
			const obj = {
				dataSetCode: datasetId,
			};
			await getConditions(obj).then((res) => {
				this.andData = res.result;
			});
		},
		//获取字段类型
		getFieldsType(type, columnType) {
			const obj = {
				STRING: this.columnTypeList[0]?.detailCode.indexOf(columnType) > -1,
				NUMBER: this.columnTypeList[1]?.detailCode.indexOf(columnType) > -1,
				DATE: this.columnTypeList[2]?.detailCode.indexOf(columnType) > -1,
			};
			return obj[type];
		},

		// 至少有一个查询条件
		searchCondition() {
			let flag = false;
			let filterItems = [];
			this.filterData.forEach((item) => {
				let { filterValue, columnType } = item;
				//时间类型
				if (this.getFieldsType("DATE", columnType)) {
					//数组
					filterValue = Array.isArray(filterValue) ? [formatDate(filterValue[0]), formatDate(filterValue[1])].toString() : filterValue.toString();
				} else {
					filterValue = filterValue ? commaSplitReturnString(filterValue).join() : "";
				}
				if (filterValue && filterValue !== ",") flag = true;
				filterItems.push({ ...item, filterValue });
			});

			//数据集筛选判断
			let flagDataSet = false;
			let andItems = [];
			this.andData.forEach((item) => {
				let { columnType, value } = item;
				if (columnType === "DateTime") value = formatDate(value);
				else value = value ? commaSplitReturnString(value).join() : "";
				andItems.push({ ...item, value });
			});
			return { flag, filterItems, andItems };
		},
		// 设置定时器
		settingTime(isRefresh, refeshRate) {
			if (this.interval) {
				clearInterval(this.interval);
			}
			if (isRefresh) {
				//定时执行锁定操作
				this.interval = setInterval(() => {
					this.searchClick();
				}, 1000 * 60 * refeshRate);
			}
		},
		//页面重置
		resetClick() {
			this.filterData = this.filterData.map((item) => {
				return { ...item, filterValue: "" };
			});
		},
		// 获取数据字典数据
		async getDataItemData() {
			this.columnTypeList = await this.getDataItemDetailList("columnType");
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		async closeClick() {
			await deleteImageReq({ id: this.submitData.id });
			this.deleteLocalStorage(); //删除缓存
			window.close();
		},
		//删除缓存
		deleteLocalStorage() {
			let data = window.localStorage.getItem("workBook");
			data = data.split(",");
			const dataIndex = data.findIndex((item) => item === this.submitData.id);
			if (dataIndex > -1) data.splice(dataIndex, 1);
			if (data.length > 0) window.localStorage.setItem("workBook", data.toString());
			else window.localStorage.removeItem("workBook");
		},
		// // 页面关闭之前，触发提示框
		beforeunloadHandler(e) {
			this.deleteLocalStorage();
			// e.preventDefault(); // 兼容Firefox或其他浏览器
			// e.returnValue = ""; // 兼容Chrome
			// return ""; // 兼容IE
		},
	},
	beforeDestroy() {},
	destroyed() {
		window.removeEventListener("beforeunload", (e) => this.beforeunloadHandler(e));
	},
	created() {
		this.getDataItemData(); //获取数据字典类型
	},
	mounted() {
		this.submitData.id = this.$route.query.id;
		window.addEventListener("beforeunload", (e) => this.beforeunloadHandler(e));

		this.$nextTick(() => {
			this.pageLoad();
		});
	},
};
</script>
<style>
.workbook-preview-content .comment .ivu-card-head {
	padding: 15px 13px 0px 13px !important;
}
</style>
<style scoped lang="less">
.close-btn {
	border-radius: 4px;
}
</style>
