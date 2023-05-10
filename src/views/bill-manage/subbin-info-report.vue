/* PCB分bin系统查询报表 */
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
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<FormItem :label="$t('type')" prop="isHistory">
											<RadioGroup v-model="req.isHistory">
												<Radio :label="false">在线信息</Radio>
												<Radio :label="true">历史信息</Radio>
											</RadioGroup>
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
										<!-- 大板序号 -->
										<FormItem :label="$t('panelNo')" prop="panelno">
											<Input v-model.trim="req.panelno" :placeholder="$t('pleaseEnter') + $t('panelNo') + $t('multiple,separated')"></Input>
										</FormItem>
										<!-- 储位ID -->
										<FormItem label="储位ID" prop="storageID">
											<Input v-model.trim="req.storageID" :placeholder="$t('pleaseEnter') + '储位ID'" />
										</FormItem>
										<!-- 状态 -->
										<FormItem :label="$t('status')" prop="status">
											<Select v-model="req.status" clearable :placeholder="$t('pleaseSelect') + $t('status')" transfer>
												<Option v-for="(item, i) in statusList" :value="item.detailName" :key="i">{{ item.detailName }} </Option>
											</Select>
										</FormItem>
										<!-- 料号 -->
										<FormItem :label="$t('pn')" prop="partname">
											<Input v-model.trim="req.partname" :placeholder="$t('pleaseEnter') + $t('pn')" />
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
import { getpagelistReq, exportReq } from "@/api/bill-manage/subbin-info-report";
import { getButtonBoolean, formatDate, exportFile, commaSplitString, renderDate } from "@/libs/tools";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";
export default {
	name: "subbin-info-report",
	data() {
		return {
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			statusList: [], // 类别下拉框
			btnData: [],
			req: {
				startTime: "",
				endTime: "",
				panelno: "",
				storageID: "",
				status: "",
				partname: "",
				isHistory: false,
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
				{ title: "大板码", key: "panelno", align: "center", width: 120, tooltip: true },
				{ title: "料号名称", key: "partname", align: "center", width: 140, tooltip: true },
				{ title: "状态", key: "status", align: "center", width: 80, tooltip: true },
				{ title: "储位ID", key: "storageID", align: "center", width: 100, tooltip: true },
				{ title: "XRule", key: "xRule", align: "center", width: 50, tooltip: true },
				{ title: "YRule", key: "yRule", align: "center", width: 50, tooltip: true },
				{ title: "等级", key: "grade", align: "center", width: 50, tooltip: true },
				{ title: "分BIN后Reelid", key: "reelid", align: "center", width: 180, tooltip: true },
				{ title: "分BIN前Reelid", key: "oReelid", align: "center", width: 180, tooltip: true },
				{ title: "BinCode", key: "binCode", align: "center", width: 80, tooltip: true },
				{ title: "创建时间", key: "createDate", align: "center", width: 140, tooltip: true, render: renderDate },
				{ title: "X1", key: "x1", align: "center", width: 100, tooltip: true },
				{ title: "X2", key: "x2", align: "center", width: 100, tooltip: true },
				{ title: "Y1", key: "y1", align: "center", width: 100, tooltip: true },
				{ title: "Y2", key: "y2", align: "center", width: 100, tooltip: true },
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
		imgClick(url) {
			window.open(url, "_blank");
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			this.tableConfig.loading = false;
			let { startTime, endTime, panelno, storageID, status, partname, isHistory } = this.req;
			if ((startTime && endTime) || panelno || storageID || status || partname) {
				this.$refs.searchReq.validate((validate) => {
					if (validate) {
						this.tableConfig.loading = true;
						let obj = {
							orderField: "PANELNO", // 排序字段
							ascending: true, // 是否升序
							pageSize: this.req.pageSize, // 分页大小
							pageIndex: this.req.pageIndex, // 当前页码
							data: {
								startTime: formatDate(startTime),
								endTime: formatDate(endTime),
								panelno: commaSplitString(panelno).join(),
								storageID,
								status,
								partname,
								isHistory,
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
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 导出
		exportClick() {
			let { startTime, endTime, panelno, storageID, status, partname, isHistory } = this.req;
			if ((startTime && endTime) || panelno || storageID || status || partname) {
				let obj = {
					startTime: formatDate(startTime),
					endTime: formatDate(endTime),
					panelno: commaSplitString(panelno).join(),
					storageID,
					status,
					partname,
					isHistory,
				};
				exportReq(obj).then((res) => {
					let blob = new Blob([res], { type: "application/vnd.ms-excel" });
					const fileName = `${this.$t("subbin-info-report")}${formatDate(new Date())}.xlsx`; // 自定义文件名
					exportFile(blob, fileName);
				});
			} else {
				this.$Msg.warning(this.$t("pleaseSelect") + this.$t("timeHorizon"));
			}
		},
		// 获取数据字典数据
		getDataItemData() {
			const obj = { itemCode: "PCBSubBinStatus", enabled: 1 };
			getDataItemReq(obj).then((res) => {
				if (res.code === 200) {
					this.statusList = res.result || [];
				}
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
};
</script>
<style lang="less" scoped>
.img_item {
	width: 30px;
	height: 30px;
	margin-left: 3px;
	cursor: pointer;
}
</style>
