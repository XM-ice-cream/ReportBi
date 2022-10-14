<template>
	<!-- 右侧抽屉 Form表单 -->
	<Drawer v-model="drawerFlag" :title="drawerTitle" width="900" :mask-closable="false" @on-close="cancelClick">
		<Form ref="submitData" :model="submitData" :label-width="90" :label-colon="true" @submit.native.prevent>
			<!-- 当前流程 -->
			<FormItem label="当前流程" prop="toRouteId">
				<v-selectpage
					class="select-page-style"
					key-field="id"
					ref="toRouteId"
					:title="toRouteTitle"
					show-field="name"
					:data="wfPageListUrl"
					v-model="submitData.toRouteId"
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
				<transfer-table :shuttleDate="processList" :selectData.sync="keyRelations_" :lTableHeaderList="lTableHeaderList" :rTableHeaderList="rTableHeaderList" :isSort="isAdd" lWidth="45%" rWidth="45%" />
			</FormItem>
		</Form>
		<div style="text-align: center">
			<drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
		</div>
	</Drawer>
</template>

<script>
import { addReq, modifyReq } from "@/api/bill-manage/insight-tracktooling";
import { wfPageListUrl, getprocessbyrouteidReq } from "@/api/basis-info/wf-route";
import TransferTable from "./transfer-table.vue";
export default {
	name: "processname-setting-add-modify",
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
					const { modelName, customerModelName, stepName, customerStepName, uploadStepName, sortNumber, id } = this.submitData;
					const obj = {
						modelName,
						customerModelName,
						stepName,
						customerStepName,
						uploadStepName,
						sortNumber,
						id,
					};
					const requestApi = this.isAdd ? addReq : modifyReq;
					requestApi(obj).then((res) => {
						if (res.code === 200) {
							this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
							this.$emit("pageLoad");
							if (isClose) this.cancelClick();
						} else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${res.message}`);
					});
				}
			});
		},
		getProcess() {
			this.processList = [];
			let obj = { routeId: this.submitData.toRouteId };
			getprocessbyrouteidReq(obj).then((res) => {
				if (res.code === 200) {
					let result = res.result || [];
					this.processList = result.filter((o) => o.id !== "start" && o.id !== "end");
					//清空右侧选中值
					this.keyRelations_ = [];
				}
			});
		},
		// 左侧抽屉取消
		cancelClick() {
			this.$emit("update:drawerFlag", false);
			this.$refs.submitData.resetFields();
			//清空所有data值
			Object.assign(this.$data, this.$options.data());
		},
	},
	components: { TransferTable },
};
</script>
