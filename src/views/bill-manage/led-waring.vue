/* LED 来料预警看板 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="400" transfer>
								<Button @click.stop="poptipModal = !poptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- ReelId -->
										<FormItem label="ReelId" prop="id">
											<Input v-model.trim="req.id" :placeholder="$t('pleaseEnter') + 'ReelId'" />
										</FormItem>
										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="pn">
											<Input v-model.trim="req.pn" :placeholder="$t('pleaseEnter') + $t('pn')" />
										</FormItem>
										<!-- 出厂日期 -->
										<FormItem :label="$t('productionDate')" prop="dateCode">
											<Input v-model.trim="req.dateCode" :placeholder="$t('pleaseEnter') + $t('productionDate')" />
										</FormItem>
										<!-- 厂商批次号 -->
										<FormItem :label="$t('lotCode')" prop="lotCode">
											<Input v-model.trim="req.lotCode" :placeholder="$t('pleaseEnter') + $t('lotCode')" />
										</FormItem>
										<!-- 剩余天数 -->
										<FormItem :label="$t('diffTime')" prop="diffTime">
											<Select transfer v-model="req.diffTime" clearable :placeholder="$t('pleaseSelect') + $t('diffTime')">
												<Option v-for="(item, i) in diffTimeData" :value="item.detailName" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
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
					:row-class-name="tableRowClassName"
				></Table>
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/led-waring";
import { getlistReq } from "@/api/system-manager/data-item";
import { formatDate, getButtonBoolean, exportFile } from "@/libs/tools";
import _ from "lodash";
export default {
	name: "led-waring",
	data() {
		return {
			poptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			diffTimeData: [],
			req: {
				id: "", //ReelId
				pn: "", //料号
				dateCode: "", //出厂日期
				lotCode: "", //厂商批次号
				diffTime: null, //剩余天数
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
				{ title: "ReelId", key: "id", align: "center" },
				{ title: this.$t("pn"), key: "pn", align: "center" },
				{ title: this.$t("productionDate"), key: "dateCode", align: "center" },
				{ title: this.$t("lotCode"), key: "lotCode", align: "center" },
				{ title: this.$t("diffTime"), key: "diffTime", align: "center" },
			], // 表格数据
		};
	},
	async activated() {
		await this.getDataItemData();
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},

	methods: {
		// 获取数据字典数据
		async getDataItemData() {
			let diffTimeData = await this.getDataItemDetailList("LEDExpWaring");
			diffTimeData.map((item) => {
				item.detailName = Number(item.detailName);
			});
			this.diffTimeData = _.sortBy(diffTimeData, (item) => {
				return -item.detailName;
			});
			this.req.diffTime = this.diffTimeData[this.diffTimeData.length - 1].detailName;
		},
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) arr = res.result || [];
			});
			return arr;
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.poptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			let { id, pn, dateCode, lotCode, diffTime } = this.req;

			this.tableConfig.loading = true;
			let obj = {
				orderField: "diffTime", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: { id, pn, dateCode, lotCode, diffTime },
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
			let { id, pn, dateCode, lotCode, diffTime } = this.req;
			exportReq({ id, pn, dateCode, lotCode, diffTime }).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("led-waring")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
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
		tableRowClassName() {
			return "";
		},
	},
};
</script>
