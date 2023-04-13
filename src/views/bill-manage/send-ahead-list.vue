/* Sendahead List */
<template>
	<div class="page-style">
		<Drawer v-model="drawerFlag" :title="`Sendahead List${isAdd ? '新增' : '编辑'}`" width="650" :mask-closable="false" :before-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :label-width="80" :label-colon="true" @submit.native.prevent>
				<!-- 机种 -->
				<FormItem label="机种" prop="project">
					<Select v-model="submitData.project" clearable filterable :placeholder="$t('pleaseSelect') + '机种'" transfer>
						<Option v-for="(item, i) in projectList" :value="item.detailName" :key="i">
							{{ item.detailName }}
						</Option>
					</Select>
				</FormItem>
				<!-- 工厂 -->
				<FormItem label="工厂" prop="factory">
					<Select v-model="submitData.factory" clearable filterable :placeholder="$t('pleaseSelect') + '工厂'" transfer :disabled="!isAdd">
						<Option v-for="(item, i) in factoryList" :value="item.detailName" :key="i">
							{{ item.detailName }}
						</Option>
					</Select>
				</FormItem>
				<!-- 仓位 -->
				<FormItem label="仓位" prop="wareHouse">
					<Select v-model="submitData.wareHouse" clearable filterable :placeholder="$t('pleaseSelect') + '仓位'" transfer :disabled="!isAdd">
						<Option v-for="(item, i) in wareHouseList" :value="item.detailName" :key="i">
							{{ item.detailName }}
						</Option>
					</Select>
				</FormItem>
				<!-- 脚位 -->
				<FormItem label="脚位" prop="location">
					<Input v-model="submitData.location" :placeholder="$t('pleaseEnter') + '脚位'" />
				</FormItem>
				<!-- 料号 -->
				<FormItem label="料号" prop="ipn">
					<Input v-model="submitData.ipn" :placeholder="$t('pleaseEnter') + '料号'" :disabled="!isAdd" />
				</FormItem>
				<!-- APN -->
				<FormItem label="APN" prop="apn">
					<Input v-model="submitData.apn" :placeholder="$t('pleaseEnter') + 'APN'" />
				</FormItem>
				<!-- 最小包装数 -->
				<FormItem label="最小包装数" prop="mpq">
					<Input v-model="submitData.mpq" :placeholder="$t('pleaseEnter') + '最小包装数'" />
				</FormItem>
				<!-- 供应商 -->
				<FormItem label="供应商" prop="vendor">
					<Input v-model="submitData.vendor" :placeholder="$t('pleaseEnter') + '供应商'" />
				</FormItem>
				<!-- 预警值 -->
				<FormItem label="预警值" prop="dppmLimit">
					<Input v-model="submitData.dppmLimit" :placeholder="$t('pleaseEnter') + '预警值'" />
				</FormItem>
				<!-- 备注 -->
				<FormItem label="备注" prop="remark">
					<Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + '备注'" />
				</FormItem>
			</Form>
			<div style="margin: 0 auto; text-align: center; margin-top: 10px">
				<Button style="margin-right: 8px" @click="cancelClick">Cancel</Button> <Button type="primary" @click="submitClick">Submit</Button>
			</div>
		</Drawer>
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="12">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="350" trigger="manual">
								<Button type="primary" icon="ios-search" @click.stop="poptipModal = !poptipModal">
									{{ $t("selectQuery") }}
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
										<!-- 起始时间 -->
										<FormItem :label="$t('startTime')" prop="startTime">
											<DatePicker
												transfer
												type="datetime"
												:placeholder="$t('pleaseSelect') + $t('startTime')"
												format="yyyy-MM-dd HH:mm:ss"
												:options="$config.datetimeOptions"
												v-model="req.startTime"
											>
											</DatePicker>
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
											>
											</DatePicker>
										</FormItem>
										<!-- 机种 -->
										<FormItem label="机种" prop="project">
											<Select v-model="req.project" clearable filterable :placeholder="$t('pleaseSelect') + '机种'" transfer>
												<Option v-for="(item, i) in projectList" :value="item.detailName" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
										<!-- 工厂 -->
										<FormItem label="工厂" prop="factory">
											<Select v-model="req.factory" clearable filterable :placeholder="$t('pleaseSelect') + '工厂'" transfer>
												<Option v-for="(item, i) in factoryList" :value="item.detailName" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
										<!-- 仓位 -->
										<FormItem label="仓位" prop="wareHouse">
											<Select v-model="req.wareHouse" clearable filterable :placeholder="$t('pleaseSelect') + '仓位'" transfer>
												<Option v-for="(item, i) in wareHouseList" :value="item.detailName" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
										<!-- 脚位 -->
										<FormItem label="脚位" prop="location">
											<Input v-model="req.location" :placeholder="$t('pleaseEnter') + '脚位'" />
										</FormItem>
										<!-- 料号 -->
										<FormItem label="料号" prop="ipn">
											<Input v-model="req.ipn" :placeholder="$t('pleaseEnter') + '料号'" />
										</FormItem>
										<!-- APN -->
										<FormItem label="APN" prop="apn">
											<Input v-model="req.apn" :placeholder="$t('pleaseEnter') + 'APN'" />
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
							<button-custom
								:btnData="btnData"
								@on-add-click="addClick"
								@on-edit-click="editClick"
								@on-delete-click="deleteClick"
								@on-export-click="exportClick"
							></button-custom>
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
					@on-current-change="currentClick"
				>
					<!-- 操作 -->
					<template slot-scope="{ row }" slot="operator">
						<div class="tableBtn" @click="getStepList(row)">setup</div>
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
		<Modal v-model="modalFlag" title="SetupStation" width="800" :mask="false" :mask-closable="false" @on-cancel="modalFlag = false">
			<Table :columns="setupColumns" :data="setupData" height="500px">
				<template slot-scope="{ row, index }" slot="checkOut">
					<Checkbox v-model="setupData[index].checkOut" :true-value="1" :false-value="0" @on-change="changeCheckOut(index)"></Checkbox>
				</template>
				<template slot-scope="{ row, index }" slot="checkState">
					<Checkbox v-model="setupData[index].checkState" :true-value="1" :false-value="0"></Checkbox>
				</template>
			</Table>
			<template #footer>
				<Button @click="modalFlag = false">关闭</Button>
				<Button @click="modalSubmitClick">提交</Button>
			</template>
		</Modal>
	</div>
</template>

<script>
import { getpagelistReq, exportReq, addReq, modifyReq, deleteReq, getStepReq, setupStepReq } from "@/api/bill-manage/sendahead-list";
import { formatDate, getButtonBoolean, exportFile, renderDate } from "@/libs/tools";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";

export default {
	name: "sendahead-list",
	data() {
		return {
			poptipModal: false,
			noRepeatRefresh: false, //刷新数据的时候不重复刷新pageLoad
			drawerFlag: false,
			modalFlag: false,
			isAdd: false,
			projectList: [],
			factoryList: [],
			warehouseList: [],
			selectObj: {}, //选中值
			tableConfig: { ...this.$config.tableConfig }, // table配置
			submitData: {
				project: "",
				factory: "",
				wareHouse: "",
				location: "",
				mpq: 0,
				vendor: "",
				ipn: "",
				apn: "",
				dppmLimit: 0,
				remark: "",
			},
			req: {
				startTime: "",
				endTime: "",
				project: "",
				factory: "",
				wareHouse: "",
				location: "",
				ipn: "",
				apn: "",
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
				{ title: "机种", key: "project", align: "center", tooltip: true, minWidth: 100 },
				{ title: "工厂", key: "factory", align: "center", tooltip: true, minWidth: 100 },
				{ title: "仓位", key: "wareHouse", align: "center", tooltip: true, minWidth: 100 },
				{ title: "location", key: "脚位", align: "center", tooltip: true, minWidth: 100 },
				{ title: "最小包装数", key: "mpq", align: "center", tooltip: true, minWidth: 100 },
				{ title: "供应商", key: "vendor", align: "center", tooltip: true, minWidth: 100 },
				{ title: "料号", key: "ipn", align: "center", tooltip: true, minWidth: 100 },
				{ title: "APN", key: "apn", align: "center", tooltip: true, minWidth: 100 },
				{ title: "预警值", key: "dppmLimit", align: "center", tooltip: true, minWidth: 100 },
				{ title: "创建人", key: "createUserID", align: "center", tooltip: true, minWidth: 100 },
				{ title: "创建时间", key: "createDate", align: "center", tooltip: true, minWidth: 150, render: renderDate },
				{ title: "推送时间", key: "interDate", align: "center", tooltip: true, minWidth: 150, render: renderDate },
				{ title: this.$t("operator"), slot: "operator", minWidth: 125, align: "center", tooltip: true },
			], // 表格数据
			data: [], // 表格数据
			setupData: [{ checkOut: 0, checkState: 0 }],
			setupColumns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "ID", key: "formID", align: "center" },
				//{ title: "排序", key: "sortBy", align: "center" },
				{ title: "系统", key: "systemName", align: "center" },
				{ title: "系统站点", key: "sysStepName", align: "center", tooltip: true },
				{ title: "站点", key: "stepName", align: "center", tooltip: true },
				{ title: "检查状态", slot: "checkState", align: "center", tooltip: true },
				{ title: "最后一站检查", slot: "checkOut", align: "center", tooltip: true },
			], // 表格数据
			btnData: [],
			lineList: [], // 线体数据
		};
	},
	mounted() {
		this.pageLoad();
	},
	activated() {
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.getDataItemData();
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
			const { startTime, endTime, project, factory, wareHouse, location, ipn, apn } = this.req;
			this.$refs.searchReq.validate((validate) => {
				if (validate) {
					this.tableConfig.loading = true;
					let obj = {
						orderField: "project", // 排序字段
						ascending: this.req.ascending, // 是否升序
						pageSize: this.req.pageSize, // 分页大小
						pageIndex: this.req.pageIndex, // 当前页码
						data: {
							startTime: formatDate(startTime),
							endTime: formatDate(endTime),
							project,
							factory,
							wareHouse,
							location,
							ipn,
							apn,
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
				}
			});
		},
		// serin导出
		exportClick() {
			const { startTime, endTime, project, factory, wareHouse, location, ipn, apn } = this.req;
			const obj = {
				startTime: formatDate(startTime),
				endTime: formatDate(endTime),
				project,
				factory,
				wareHouse,
				location,
				ipn,
				apn,
			};
			exportReq(obj).then((res) => {
				let blob = new Blob([res], { type: "application/vnd.ms-excel" });
				const fileName = `${this.$t("sendahead-list")}${formatDate(new Date())}.xlsx`; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		// 点击搜索按钮触发
		searchClick() {
			this.poptipModal = false;
			this.req.pageIndex = 1;
			this.selectObj = {};
			this.pageLoad();
		},
		// 新增按钮
		addClick() {
			this.drawerFlag = true;
			this.isAdd = true;
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.drawerFlag = true;
				this.isAdd = false;
				this.submitData = { ...this.selectObj };
			} else this.$Msg.warning(this.$t("oneData"));
		},
		//提交
		submitClick() {
			const obj = { ...this.submitData };
			const requestApi = this.isAdd ? addReq(obj) : modifyReq(obj);
			requestApi.then((res) => {
				if (res.code === 200) {
					this.$Msg.success("提交成功");
					this.pageLoad();
					this.cancelClick();
				} else {
					this.$Msg.error(`提交失败, ${res.message}`);
				}
			});
		},
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields();
		},
		//删除
		deleteClick() {
			if (this.selectObj) {
				this.$Modal.confirm({
					title: "确认要删除该数据吗?",
					onOk: () => {
						const obj = { ...this.selectObj };
						deleteReq(obj).then((res) => {
							if (res.code === 200) {
								this.$Msg.success("删除成功");
								this.pageLoad();
							}
						});
					},
					//   onCancel: () => this.clearGraphData(),
				});
			} else this.$Msg.warning(this.$t("oneData"));
		},
		getStepList(row) {
			this.modalFlag = true;
			const obj = { fromID: row.id };

			getStepReq(obj).then((res) => {
				if (res.code === 200) {
					this.setupData = res?.result || [];
				}
			});
		},
		modalSubmitClick() {
			setupStepReq(this.setupData).then((res) => {
				if (res.code == 200) {
					this.$Msg.success("提交成功");
					this.modalFlag = false;
				}
			});
		},
		//checkbox 只能选一个
		changeCheckOut(index) {
			if (this.setupData[index].checkOut === 1) {
				this.setupData = this.setupData.map((item, iIndex) => {
					if (iIndex !== index) item.checkOut = 0;
					else item.checkOut = 1;
					return { ...item };
				});
			}
		},
		// 获取业务数据
		async getDataItemData() {
			this.projectList = await this.getDataItemDetailList("SendAheadProject");
			this.factoryList = await this.getDataItemDetailList("SendAheadFactory");
			this.warehouseList = await this.getDataItemDetailList("SendAheadWarehouse");
		},
		// 获取数据字典数据
		async getDataItemDetailList(itemCode) {
			let arr = [];
			await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) {
					arr = res.result || [];
				}
			});
			return arr;
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
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
<style scoped lang="less">
.tableBtn {
	display: inline-block;
	padding: 0.2rem;
	color: #1890ff;
	background: #f5f5f5;

	border-radius: 0.2rem;
	box-shadow: 0px 2px 3px #ccc;
	cursor: pointer;
	&:active {
		background: #40e49f;
		color: #fff;
		box-shadow: none;
	}
}
</style>
