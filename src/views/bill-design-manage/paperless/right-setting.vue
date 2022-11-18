<template>
	<div style="height: 100%">
		<Modal v-model="modalAuthority" title="权限设定" @on-ok="submitClick" @on-cancel="cancelClick" width="700">
			<Form ref="authority" :label-width="60" style="padding: 0 1.3rem">
				<FormItem label="权限类型">
					<Select transfer v-model="authority.type" clearable :placeholder="$t('pleaseSelect') + '权限类型'">
						<Option v-for="(item, i) in types" :value="item.value" :key="i">
							{{ item.name }}
						</Option>
					</Select>
				</FormItem>
			</Form>
			<!-- 过滤表格 -->
			<ConditionSetting ref="conditionsetting" :drawerFlag.sync="modalAuthority" :rightForm="authority.data" @updateData="updateData" />
		</Modal>
		<Tabs>
			<TabPane label="单元格权限" name="name1">
				<Form ref="rightForm" :label-width="60" style="padding: 0 1.3rem">
					<!-- 添加条件 -->
					<FormItem label="添加条件">
						<Button long @click="addAuthority">
							<Icon type="md-add" />
						</Button>
					</FormItem>
				</Form>
				<Table border :columns="columns" :data="authorityData" width="280">
					<template #name="{ row }">
						<strong>{{ row.name }}</strong>
					</template>
					<template #action="{ row, index }">
						<Button type="primary" size="small" class="view-btn" style="margin-right: 5px" @click="showAuthority(row, index)">View</Button>
						<Button type="error" size="small" class="delete-btn" @click="removeAuthority(index)">Delete</Button>
					</template>
				</Table>
			</TabPane>
			<TabPane label="单元格类型" name="name2">
				<Form ref="cellType" :label-width="60" style="padding: 0 1.3rem">
					<FormItem label="类型">
						<Select v-model.trim="cellType.type" clearable transfer>
							<Option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value" />
						</Select>
					</FormItem>
					<FormItem label="默认值">
						<DatePicker v-if="cellType.type == 'datePicker'" v-model.trim="cellType.default" transfer type="datetime" clearable format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"></DatePicker>
						<Input v-else type="text" v-model.trim="cellType.default" clearable />
					</FormItem>
				</Form>
				<Button type="primary" v-if="tableData.length == 0" size="small" @click="addRow(-1)">添加 </Button>
				<Table :data="tableData" border :columns="typeColumns" :max-height="350" style="width: 100%">
					<template slot-scope="{ index }" slot="name">
						<DatePicker v-if="cellType.type == 'datePicker'" v-model.trim="tableData[index].name" transfer type="datetime" clearable format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"></DatePicker>
						<Input v-else v-model.trim="tableData[index].name" clearable />
					</template>
					<template slot-scope="{ index }" slot="value">
						<DatePicker v-if="cellType.type == 'datePicker'" v-model.trim="tableData[index].value" transfer type="datetime" clearable format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions"></DatePicker>
						<Input v-else v-model.trim="tableData[index].value" clearable />
					</template>
					<!-- 操作 -->
					<template slot-scope="{ row, index }" slot="operator">
						<Button type="text" size="small" @click.native.prevent="cutOutRow(index, tableData)">删除</Button>
						<Button type="text" size="small" @click="addRow(index, row)">追加</Button>
					</template>
				</Table>
				<Button type="primary" @click="submitType">提交</Button>
			</TabPane>
		</Tabs>
	</div>
</template>

<script>
import ConditionSetting from "@/components/condition-setting/condition-setting.vue";

export default {
	name: "right-setting",
	props: {},
	watch: {},
	components: { ConditionSetting },
	data() {
		return {
			modalAuthority: false,
			dataIndex: true,
			sheetData: [],
			rightForm: {},
			data: [],
			authority: {
				type: "",
				data: [],
			},
			authorityData: [], //权限
			types: [
				{ name: "点检周期", value: "checkTime" },
				{ name: "点检角色", value: "role" },
			],
			columns: [
				{
					title: "Name",
					slot: "name",
					align: "center",
				},
				{
					title: "Action",
					slot: "action",
					align: "center",
				},
			],
			//--------------数据类型
			cellType: {},
			typeList: [
				{ name: "输入框", value: "input" },
				{ name: "下拉框", value: "select" },
				{ name: "复选框", value: "checkbox" },
				{ name: "日期", value: "datePicker" },
				{ name: "数字输入框", value: "inputNumber" },
			],

			tableData: [], //数据类型
			typeColumns: [
				{
					title: "显示值",
					slot: "name",
				},
				{
					title: "实际值",
					slot: "value",
				},
				{
					title: "#",
					slot: "operator",
				},
			],
		};
	},
	methods: {
		pageLoad() {},

		//更新数据
		submitClick(flag) {
			this.authority.filterData = "";
			this.authority.data = [...this.data];
			this.data.forEach((item) => {
				this.authority.filterData += `${item.logic} `;
			});
			// 新增
			if (this.dataIndex) {
				const obj = { name: `${this.authority.type}${this.authorityData.length + 1}`, ...this.authority };
				this.authorityData.push(obj);
			} else {
				this.authorityData[this.dataIndex] = { ...this.authority };
			}

			if (flag) this.cancelClick();
			console.log("更新", this.authorityData);
			this.$emit("autoChangeFunc", "authority", this.authorityData);
		},
		// 左侧抽屉取消
		cancelClick() {
			this.modalAuthority = false;
		},
		//条件设定值 ConditionSetting组件下
		updateData(val) {
			this.data = val;
		},
		//添加权限设定
		addAuthority() {
			this.modalAuthority = true;
			this.dataIndex = true;
			this.authority = {};
		},
		//查看权限设定
		showAuthority(row, index) {
			this.dataIndex = index;
			this.modalAuthority = true;
			this.authority = { ...row };
		},
		//删除权限设定
		removeAuthority(row, index) {
			this.authorityData.splice(index, 1);
		},
		//----------------------单元格类型
		// 删除
		cutOutRow(index, rows) {
			rows.splice(index, 1);
		},
		// 追加
		addRow(index) {
			const obj = {
				name: "",
				value: "",
			};
			this.tableData.splice(index + 1, 0, obj);
		},
		// 提交
		submitType() {
			const cellTypeData = { ...this.cellType, data: this.tableData };

			this.$emit("autoChangeFunc", "cellType", cellTypeData);
		},
	},
	created() {},
};
</script>
<style></style>
<style lang="less" scoped>
.view-btn {
	height: 22px;
	background: #27ce88;
	margin: 4px;
}
.delete-btn {
	height: 22px;
	background: #f24242;
	margin: 4px;
}
</style>
