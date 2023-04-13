<template>
	<!-- 右侧抽屉 Form表单 -->
	<Drawer v-model="drawerFlag" :title="drawerTitle" width="900" :mask-closable="false" @on-close="cancelClick">
		<Form ref="submitData" :model="submitData" :label-width="90" :label-colon="true" @submit.native.prevent>
			<!-- 当前流程 -->
			<FormItem label="当前流程" prop="routeID">
				<v-selectpage
					class="select-page-style"
					key-field="id"
					ref="routeID"
					:title="toRouteTitle"
					show-field="name"
					:data="wfPageListUrl"
					v-model="submitData.routeID"
					@values="getProcess"
					:placeholder="$t('pleaseSelect') + '当前流程'"
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
			<FormItem>
				<transfer-table
					:shuttleDate="processList"
					:selectData.sync="keyRelations_"
					:lTableHeaderList="lTableHeaderList"
					:rTableHeaderList="rTableHeaderList"
					:isSort="isAdd"
					lWidth="45%"
					rWidth="45%"
				/>
			</FormItem>
		</Form>
		<div style="text-align: center">
			<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
		</div>
	</Drawer>
</template>

<script>
import { addReq, modifyReq } from "@/api/bill-manage/processname-setting";
import { wfPageListUrl, getprocessbyrouteidReq } from "@/api/basis-info/wf-route";
import TransferTable from "./transfer-table.vue";
export default {
	name: "processname-setting-add-modify",
	components: { TransferTable },
	props: {
		drawerFlag: {
			type: Boolean,
			default: false,
		},
		isAdd: {
			type: Boolean,
			default: false,
		},
		selectObj: {
			type: Object,
			default: () => null,
		},
		drawerTitle: {
			type: String,
			default: "新增",
		},
	},
	watch: {
		drawerFlag(newVal) {
			//弹窗开启 及编辑时 赋值
			if (newVal && !this.isAdd) {
				this.submitData = { ...this.selectObj };
				this.keyRelations_ = this.selectObj.processes.map((item) => {
					return { ...item, name: item.processName, isRequested: item.isrequested };
				});
			}
		},
	},
	data() {
		return {
			wfPageListUrl: wfPageListUrl(),
			toRouteTitle: "",
			processList: [],
			keyRelations_: [], //选中的穿梭框值
			lTableHeaderList: [
				// 穿梭框左侧表头信息
				{
					type: "selection",
					width: 60,
					align: "center",
				},
				{
					title: "制程",
					key: "name",
					align: "center",
				},
			],
			rTableHeaderList: [
				// 穿梭框右侧表头信息
				{
					type: "selection",
					width: 60,
					align: "center",
				},
				{
					title: "制程",
					key: "name",
					align: "center",
				},
				{
					title: "是否为必过站",
					slot: "isRequired",
					align: "center",
				},
				{
					title: "序号",
					key: "seq",
					align: "center",
				},
			],
			submitData: {
				toRouteId: "",
			},
		};
	},
	activated() {},
	methods: {
		//提交
		submitClick(isClose = false) {
			this.$refs.submitData.validate((validate) => {
				if (validate) {
					const arr = this.keyRelations_.map((item, index) => {
						return { seq: (index + 1) * 10, processName: item.name, isrequested: item?.isRequested || false };
					});
					const obj = {
						routeID: this.submitData.routeID,
						processes: arr,
					};
					// const requestApi = this.isAdd ? addReq : modifyReq;
					// 都走更新接口 【新增接口 不会删除原有数据】
					modifyReq(obj).then((res) => {
						if (res.code === 200) {
							this.$Msg.success(`${this.drawerTitle}${this.$t("success")}`);
							this.$emit("pageLoad");
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${res.message}`);
					});
				}
			});
		},
		getProcess() {
			this.processList = [];
			let obj = { routeId: this.submitData.routeID };
			getprocessbyrouteidReq(obj).then((res) => {
				if (res.code === 200) {
					let result = res.result || [];
					this.processList = result.filter((o) => o.id !== "start" && o.id !== "end");
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.$emit("update:drawerFlag", false);
			this.$refs.submitData.resetFields();
			this.$refs.routeID.remove();
			//清空所有data值
			Object.assign(this.$data, this.$options.data());
		},
	},
};
</script>
