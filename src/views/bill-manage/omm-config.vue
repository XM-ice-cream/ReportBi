/* omm配置 */
<template>
	<div class="page-style">
		<!-- 右侧抽屉 Form表单 -->
		<Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
			<Form ref="submitReq" :model="submitData" :rules="ruleValidate" :label-width="90" @submit.native.prevent>
				<!-- 站点 -->
				<FormItem label="站点" prop="station">
					<Select v-model="submitData.station" clearable transfer :placeholder="$t('pleaseEnter') + '站点'">
						<Option v-for="(item, i) in stationList" :value="item.detailCode" :key="i">
							{{ item.detailName }}
						</Option>
					</Select>
				</FormItem>
				<!-- 编号名称 -->
				<FormItem label="编号名称" prop="name">
					<Input v-model="submitData.name" :placeholder="$t('pleaseEnter') + '编号名称'" />
				</FormItem>
				<!-- 线体 -->
				<FormItem label="线体" prop="channelType">
					<Input v-model="submitData.channelType" :placeholder="$t('pleaseEnter') + '线体'" />
				</FormItem>
				<!-- 上抛SPC -->
				<FormItem label="上抛SPC" prop="channelParamter">
					<Select v-model="submitData.channelParamter" transfer :placeholder="$t('pleaseSelect') + '上抛SPC'">
						<Option value="0">否</Option>
						<Option value="1">是</Option>
					</Select>
				</FormItem>
				<!-- 下公差 -->
				<FormItem label="下公差" prop="specLimitLower">
					<Input v-model="submitData.specLimitLower" :placeholder="$t('pleaseEnter') + '下公差'" />
				</FormItem>
				<!-- 标准值 -->
				<FormItem label="标准值" prop="specLimitTarget">
					<Input v-model="submitData.specLimitTarget" :placeholder="$t('pleaseEnter') + '标准值'" />
				</FormItem>
				<!-- 上公差 -->
				<FormItem label="上公差" prop="specLimitUpper">
					<Input v-model="submitData.specLimitUpper" :placeholder="$t('pleaseEnter') + '上公差'" />
				</FormItem>
				<!-- 参数1 -->
				<FormItem label="参数1" prop="opt1">
					<Input v-model="submitData.opt1" :placeholder="$t('pleaseEnter') + '参数1'" />
				</FormItem>
				<!-- 参数2 -->
				<FormItem label="参数2" prop="opt2">
					<Input v-model="submitData.opt2" :placeholder="$t('pleaseEnter') + '参数2'" />
				</FormItem>
				<!-- 参数3 -->
				<FormItem label="参数3" prop="opt3">
					<Input v-model="submitData.opt3" :placeholder="$t('pleaseEnter') + '参数3'" />
				</FormItem>
				<!-- 参数4 -->
				<FormItem label="参数4" prop="opt4">
					<Input v-model="submitData.opt4" :placeholder="$t('pleaseEnter') + '参数4'" />
				</FormItem>
				<!-- 参数5 -->
				<FormItem label="参数5" prop="opt5">
					<Input v-model="submitData.opt5" :placeholder="$t('pleaseEnter') + '参数5'" />
				</FormItem>
				<!-- 备注 -->
				<FormItem label="备注" prop="remark">
					<Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + '备注'" />
				</FormItem>
				<!-- 是否有效 -->
				<FormItem :label="$t('enabled')" prop="enabled">
					<i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
						<span slot="open">{{ $t("open") }}</span>
						<span slot="close">{{ $t("close") }}</span>
					</i-switch>
				</FormItem>
				<!-- 按钮 -->
				<FormItem>
					<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
				</FormItem>
			</Form>
		</Drawer>
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<!-- 查询条件与按钮 -->
				<div slot="title">
					<Row>
						<!-- 查询条件 -->
						<i-col span="12">
							<Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="400" transfer>
								<Button @click.stop="poptipModal = !poptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="60" @submit.native.prevent>
										<!-- 站点 -->
										<FormItem label="站点" prop="station">
											<Select v-model="req.station" clearable transfer :placeholder="$t('pleaseEnter') + '站点'">
												<Option v-for="(item, i) in stationList" :value="item.detailCode" :key="i">
													{{ item.detailName }}
												</Option>
											</Select>
										</FormItem>
										<!-- 编号名称 -->
										<FormItem label="编号名称" prop="name">
											<Input v-model.trim="req.name" :placeholder="$t('pleaseEnter') + '编号名称'" @keyup.native.enter="searchClick" />
										</FormItem>
										<!-- 线体 -->
										<FormItem label="线体" prop="channelType">
											<Input v-model="req.channelType" :placeholder="$t('pleaseEnter') + '线体'" />
										</FormItem>
										<!-- 上抛SPC -->
										<FormItem label="上抛SPC" prop="channelParamter">
											<Select v-model="req.channelParamter" transfer clearable :placeholder="$t('pleaseSelect') + '上抛SPC'">
												<Option value="0">否</Option>
												<Option value="1">是</Option>
											</Select>
										</FormItem>
										<!-- 参数1 -->
										<FormItem label="参数1" prop="opt1">
											<Input v-model.trim="req.opt1" :placeholder="$t('pleaseEnter') + '参数1'" />
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
										<!-- 参数5 -->
										<FormItem label="参数5" prop="opt5">
											<Input v-model.trim="req.opt5" :placeholder="$t('pleaseEnter') + '参数5'" />
										</FormItem>
										<div class="poptip-style-button">
											<Button @click="resetClick">{{ $t("reset") }}</Button>
											<Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
										</div>
									</Form>
								</div>
							</Poptip>
						</i-col>
						<!-- 按钮 -->
						<i-col span="12">
							<button-custom :btnData="btnData" @on-add-click="addClick" @on-edit-click="editClick"></button-custom>
						</i-col>
					</Row>
				</div>
				<!-- 显示列表 -->
				<Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
					@on-current-change="currentClick"
					@on-sort-change="sortChange"
				></Table>
				<page-custom
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
import { getpagelistReq, addReq, modifyReq } from "@/api/bill-manage/omm-config";
import { getButtonBoolean, errorType, renderIsEnabled, renderDate, renderYesNo } from "@/libs/tools";
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
export default {
	name: "omm-config",
	data() {
		return {
			poptipModal: false,
			isAdd: true,
			drawerFlag: false,
			drawerTitle: this.$t("add"),
			tableConfig: { ...this.$config.tableConfig }, // table配置
			// 表格表头
			stationList: [],
			columns: [
				{
					type: "index",
					width: 50,
					align: "center",
					fixed: "left",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "站点", key: "station", align: "center", width: 140, tooltip: true },
				{ title: "编号名称", key: "name", align: "center", width: 120, tooltip: true },
				{ title: "线体", key: "channelType", align: "center", width: 350, tooltip: true },
				{ title: "上抛SPC", key: "channelParamter", align: "center", width: 300, tooltip: true, render: renderYesNo },
				{ title: "下公差", key: "specLimitLower", align: "center", width: 100, tooltip: true },
				{ title: "标准值", key: "specLimitTarget", align: "center", width: 100, tooltip: true },
				{ title: "上公差", key: "specLimitUpper", align: "center", width: 100, tooltip: true },
				{ title: "参数1", key: "opt1", align: "center", width: 100, tooltip: true },
				{ title: "参数2", key: "opt2", align: "center", width: 100, tooltip: true },
				{ title: "参数3", key: "opt3", align: "center", width: 100, tooltip: true },
				{ title: "参数4", key: "opt4", align: "center", width: 100, tooltip: true },
				{ title: "参数5", key: "opt5", align: "center", width: 100, tooltip: true },
				{ title: this.$t("remark"), key: "remark", align: "center", width: 150, tooltip: true },
				{ title: this.$t("enabled"), key: "enabled", align: "center", width: 70, render: renderIsEnabled },
				{ title: this.$t("createUser"), key: "createUserName", align: "center", width: 80 },
				{ title: this.$t("createDate"), key: "createDate", align: "center", width: 125, render: renderDate },
				{ title: this.$t("modifyUser"), key: "modifyUserName", align: "center", width: 80 },
				{ title: this.$t("modifyDate"), key: "modifyDate", align: "center", width: 125, render: renderDate },
			], // 表格数据
			data: [], // 表格数据
			selectObj: null, // 表格选中数据
			req: {
				station: "",
				name: "",
				channelType: "",
				channelParamter: "",
				opt1: "",
				opt2: "",
				opt3: "",
				opt4: "",
				opt5: "",
				...this.$config.pageConfig,
			},
			submitData: {
				id: "",
				station: "", //站点（必填）
				name: "", //编号名称（必填）
				channelType: "", //通道名称（必填）
				channelParamter: "0", //通道参数（必填）
				specLimitLower: "", //下公差（必填）
				specLimitTarget: "", //目标值（必填）
				specLimitUpper: "", //上公差（必填）
				opt1: "",
				opt2: "",
				opt3: "",
				opt4: "",
				opt5: "",
				remark: "", //备注（非必填）
				enabled: 1, //是否有效
			},
			// 验证实体
			ruleValidate: {
				station: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}站点`,
						trigger: "change",
					},
				],
				name: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}编号名称`,
						trigger: "change",
					},
				],
				channelType: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}线体`,
						trigger: "change",
					},
				],
				channelParamter: [
					{
						required: true,
						message: `${this.$t("pleaseSelect")}上抛SPC`,
						trigger: "change",
					},
				],
				specLimitLower: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}下公差`,
						trigger: "change",
					},
				],
				specLimitTarget: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}标准值`,
						trigger: "change",
					},
				],
				specLimitUpper: [
					{
						required: true,
						message: `${this.$t("pleaseEnter")}上公差`,
						trigger: "change",
					},
				],
			},
			btnData: [],
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
		this.getDataItemData();
	},

	methods: {
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = true;
			let { pageIndex, pageSize, ascending, orderField, station, name, channelType, channelParamter, opt1, opt2, opt3, opt4, opt5 } = this.req;
			const obj = {
				orderField, // 排序字段
				ascending, // 是否升序
				pageSize, // 分页大小
				pageIndex, // 当前页码
				data: { station, name, channelType, channelParamter, opt1, opt2, opt3, opt4, opt5, enabled: -1 },
				isFuzzyKey: [],
			};
			getpagelistReq(obj)
				.then((res) => {
					this.tableConfig.loading = false;
					if (res.code === 200) {
						let data = res.result;
						this.data = data.data || [];
						this.req.pageSize = data.pageSize;
						this.req.pageIndex = data.pageIndex;
						this.req.total = data.total;
						this.req.totalPage = data.totalPage;
					}
				})
				.catch(() => (this.tableConfig.loading = false));
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
		// 点击搜索按钮触发
		searchClick() {
			this.selectObj = null;
			this.poptipModal = false;
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 点击新增按钮触发
		addClick() {
			this.drawerFlag = true;
			this.isAdd = true;
			this.drawerTitle = this.$t("add");
		},
		// 点击编辑按钮触发
		editClick() {
			if (this.selectObj) {
				this.submitData = { ...this.selectObj };
				this.drawerFlag = true;
				this.isAdd = false;
				this.drawerTitle = this.$t("edit");
			} else this.$Msg.warning(`${this.$t("oneData")}`);
		},
		//提交
		submitClick(isClose = false) {
			this.$refs.submitReq.validate((validate) => {
				if (validate) {
					let obj = { ...this.submitData };
					let request = this.isAdd ? addReq(obj) : modifyReq(obj);
					request.then((res) => {
						if (res.code === 200) {
							this.selectObj = null;
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							this.pageLoad();
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
					});
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
			this.$refs.submitReq.resetFields(); //清除表单红色提示
			this.submitData.id = "";
		},
		// 自动改变表格高度
		autoSize() {
			let height = document.body.clientHeight - 120;
			this.tableConfig.height = height - 60;
		},
		// 某一行高亮时触发
		currentClick(currentRow) {
			this.selectObj = currentRow;
		},
		// 排序时有效，当点击排序时触发
		sortChange(data) {
			this.req.orderField = data.key.toUpperCase();
			this.req.ascending = data.order === "asc";
			this.pageLoad();
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
