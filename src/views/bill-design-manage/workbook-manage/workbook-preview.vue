<template>
	<div class="page-style workbook-preview-content">
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row class="content-top">
						<!-- 查询条件 -->
						<i-col span="6">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<div class="submitForm">
										<Form ref="submitReq" :label-width="80" :label-colon="true">
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
						</i-col>
						<!-- 标题 -->
						<i-col span="12">
							<div class="report-title">{{ $route.query.reportName }}</div>
						</i-col>
					</Row>
				</div>
				<!-- 工作区 -->
				<componentsTemp
					ref="tempRef"
					:type="markData[0]?.chartType || 'bar'"
					:title="submitData.workBookName"
					:visib="true"
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
import { getChartsInfoReq } from "@/api/bill-design-manage/workbook-manage.js";
import { getEchoReq } from "@/api/bill-design-manage/workbook-design";
import { getlistReq } from "@/api/system-manager/data-item";
import { formatDate } from "@/libs/tools";

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
			columnTypeList: [],
		};
	},
	activated() {},
	methods: {
		//加载信息
		pageLoad() {
			getEchoReq({ id: this.submitData.id }).then((res) => {
				if (res.code == 200) {
					const { calcItems, filterItems, markStyle, datasetId, workBookName, workBookCode, maxNumber } = res.result;
					this.submitData = { ...this.submitData, datasetId, workBookName, workBookCode, maxNumber };

					this.filterData = filterItems.map((item) => {
						let filterValue = item.filterValue;
						//时间类型
						if (this.getFieldsType("DATE", item.columnType)) filterValue = item.filterValue.split(",");

						return { ...item, filterValue };
					}); //过滤器
					this.rowData = calcItems.filter((item) => item.axis == "x"); //行
					this.columnData = calcItems.filter((item) => item.axis == "y"); //列
					this.markData = markStyle && markStyle !== "{}" ? JSON.parse(markStyle) : [{ name: "全部", chartType: "bar", data: [] }]; //标记
					this.$nextTick(() => {
						this.searchClick();
					});
				}
			});
		},
		//查询
		searchClick() {
			const { flag, filterItems } = this.searchCondition(); //查询条件处理
			if (!flag) {
				this.$Msg.error("操作失败，至少要有一个查询条件！");
				return;
			}
			//数据集
			const { datasetId, maxNumber } = this.submitData;
			const obj = {
				datasetId,
				filterItems,
				maxNumber,
				calcItems: this.rowData.concat(this.columnData),
				markItems: this.markData.map((item) => item.data).flat(),
			};
			getChartsInfoReq(obj)
				.then((res) => {
					//存在有数据返回 但code=-1(数据超过最大范围)
					if (res.code == 200 || res.result?.length > 0) {
						if (res.code == -1) this.$Msg.warning(`${res.message}`);

						this.chartsData = res?.result || [];
						this.$nextTick(() => {
							this.$refs.tempRef.pageLoad();
						});
					} else {
						this.$Msg.error(`${res.message}`);
					}
				})
				.finally(() => {
					this.searchPoptipModal = false;
				});
		},
		//获取字段类型
		getFieldsType(type, columnType) {
			const obj = {
				STRING: this.columnTypeList[0].detailCode.indexOf(columnType) > -1,
				NUMBER: this.columnTypeList[1].detailCode.indexOf(columnType) > -1,
				DATE: this.columnTypeList[2].detailCode.indexOf(columnType) > -1,
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
				}
				if (filterValue && filterValue !== ",") flag = true;
				filterItems.push({ ...item, filterValue });
			});
			return { flag, filterItems };
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
	},
	mounted() {
		this.submitData.id = this.$route.query.id;
		this.getDataItemData(); //获取数据字典类型
		this.$nextTick(() => {
			this.pageLoad();
		});
	},
};
</script>
<style></style>
<style scoped lang="less"></style>
