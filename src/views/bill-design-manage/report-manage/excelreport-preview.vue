<template>
	<div class="page-style excel-preview">
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
											<template v-for="item in tableData2">
												<span class="title">{{ item.title }} </span>
												<template v-for="(subitem, subindex) in item.children">
													<FormItem
														:label="subitem.paramDesc"
														:prop="item.name + subitem.name"
														:rules="subitem.required == 1 ? [{ required: true, message: '必填项' }] : [{ required: false }]"
													>
														<!-- 字符串 -->
														<Input v-if="subitem.type === 'String'" type="text" v-model.trim="subitem.value" clearable />
														<!-- 布尔 true/false/0/1-->
														<RadioGroup
															v-else-if="subitem.type === 'Boolean' && ['true', 'false', '0', '1'].includes(subitem.value)"
															v-model="subitem.value"
														>
															<template v-if="['true', 'false'].includes(subitem.value)">
																<Radio label="true">true</Radio>
																<Radio label="false">false</Radio>
															</template>
															<template v-if="['0', '1'].includes(subitem.value)">
																<Radio label="0">0</Radio>
																<Radio label="1">1</Radio>
															</template>
														</RadioGroup>
														<!-- 数组 -->
														<Input
															v-else-if="subitem.type === 'Array'"
															type="textarea"
															:autosize="{ minRows: 2, maxRows: 5 }"
															v-model.trim="subitem.value"
															clearable
														/>
														<!-- 时间 -->
														<DatePicker
															v-else-if="subitem.type === 'DateTime'"
															v-model="subitem.value"
															transfer
															type="datetime"
															format="yyyy-MM-dd HH:mm:ss"
															:options="$config.datetimeOptions"
															clearable
														></DatePicker>
														<!-- 下拉框 -->
														<v-selectpage
															v-else-if="subitem.type === 'Select'"
															class="select-page-style"
															v-model="subitem.value"
															transfer
															:params="{ setCode: subitem.paramAstrict }"
															key-field="value"
															show-field="value"
															:data="getValueBySetcodePageListUrl"
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
														<!-- 其余类型 -->
														<Input v-else v-model.trim="subitem.value" type="text" clearable />
													</FormItem>
												</template>
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
						<!-- 下载 -->

						<i-col span="6" style="text-align: right">
							<Dropdown transfer trigger="click" id="excel-preview-dropdown" @on-click="download" class="dropdown">
								<Icon type="md-cloud-download" />
								<template #list>
									<DropdownMenu>
										<DropdownItem :name="1"
											><Tooltip max-width="180" content="导出sql执行的直接结果,标题为sql查询字段【查询数量无上限】" placement="left-start" transfer>
												<Icon type="ios-help-circle-outline" style="margin-right: 5px; font-size: 14px" /> </Tooltip
											>数据源导出
										</DropdownItem>
										<DropdownItem :name="2"
											><Tooltip
												max-width="180"
												content="按照模板拖动字段,动态单元格,静态单元格位置导出【限制数量一百万】"
												placement="left-start"
												transfer
											>
												<Icon type="ios-help-circle-outline" style="margin-right: 5px; font-size: 14px" /> </Tooltip
											>快速导出</DropdownItem
										>
										<DropdownItem :name="3"
											><Tooltip
												max-width="180"
												content="按照设计完整导出，适用于汇总，计算，筛选等复杂逻辑条件【限制数量一千】"
												placement="left-start"
												transfer
											>
												<Icon type="ios-help-circle-outline" style="margin-right: 5px; font-size: 14px" /> </Tooltip
											>模板设定导出</DropdownItem
										>
										<DropdownItem :name="4"
											><Tooltip max-width="180" content="导出当超过1百万数量时,自动分多个sheet输出【越南推荐】" placement="left-start" transfer>
												<Icon type="ios-help-circle-outline" style="margin-right: 5px; font-size: 14px" /> </Tooltip
											>分sheet导出</DropdownItem
										>
										<DropdownItem :name="5"
											><Tooltip max-width="180" content="导出当前页面显示内容" placement="left-start" transfer>
												<Icon type="ios-help-circle-outline" style="margin-right: 5px; font-size: 14px" /> </Tooltip
											>表格导出</DropdownItem
										>
									</DropdownMenu>
								</template>
							</Dropdown>
						</i-col>
					</Row>
				</div>
				<!-- 表格 -->
				<div class="data-table" style="height: 100%">
					<table class="table tableScroll" id="exceltable" :class="tableHtml.length > 1 ? '' : 'blankBg'">
						<tr v-for="(itemTr, indexTr) in tableHtml" :key="indexTr" style="height: 18px">
							<template v-for="(item, index) in itemTr">
								<td v-if="item && item.rowspan" :style="item.style" :colspan="item.colspan || 1" :rowspan="item.rowspan || 1" :key="index">
									<div :title="item.value" :style="item.divStyle">
										<template v-if="item.valueType === 'image'">
											<img :src="item.value" />
										</template>
										<template v-else>
											{{ item.value }}
										</template>
									</div>
								</td>
								<td v-if="!item" :key="index" style="width: 75px; height: 18px"></td>
							</template>
						</tr>
					</table>
					<page-custom
						class="excel-page"
						:total="req.total"
						:totalPage="req.totalPage"
						:pageIndex="req.requestCount"
						:page-size="req.pageSize"
						:elapsedMilliseconds="req.elapsedMilliseconds"
						@on-change="pageChange"
						@on-page-size-change="pageSizeChange"
					>
						<template #right>
							<Button class="total-btn" v-if="isLoading" :loading="loading" @click="getTotalPage">
								<span v-if="!loading">加载右侧信息</span>
								<span v-else>Loading...</span>
							</Button>
						</template>
					</page-custom>
				</div>
			</Card>
		</div>
		<Progress :percent="percent" :stroke-width="14" status="active" text-inside v-if="percent !== 0" />
	</div>
</template>

<script>
import { getExcelPreviewReq, getParamsReq, getTotalPageReq } from "@/api/bill-design-manage/report-manage";
import draggable from "vuedraggable";
import { exportFile, formatDate } from "@/libs/tools";
import { getValueBySetcodePageListUrl } from "@/api/bill-design-manage/data-set.js";
import axios from "axios";
export default {
	name: "excelreport-preview",
	components: { draggable },
	data() {
		return {
			sheetData: [{ row: 30, column: 26 }], //初始化默认显示30行 26列
			tableData2: [],
			searchPoptipModal: false,
			loading: false, //加载总页数 总条数信息
			isLoading: false, //是否加载过，加载过就不执行[默认不显示 查询过后再显示]
			getValueBySetcodePageListUrl: getValueBySetcodePageListUrl(),
			req: {
				reportCode: "",
				setParam: "",
				pageSize: 30, // 每页显示数
				requestCount: 1, // 当前页
				orderField: "CREATEDATE", // 排序字段
				ascending: false, // 排序类型true升序 false降序
				total: 0, //  总条数
				totalPage: 0, //  总页数,
				sheetIndex: "", //sheet 当前激活索引
				elapsedMilliseconds: 0,
				// ...this.$config.pageConfig,
			},
			jsonStr: [], // json数据
			jsonIndex: 0, // json索引
			// 验证实体
			ruleValidate: {},
			tableHtml: [],
			percent: 0, //下载进度条
		};
	},
	methods: {
		// 获取查询参数
		async getParams() {
			const obj = {
				reportCode: this.req.reportCode,
				sheetIndex: "",
			};
			await getParamsReq(obj).then((res) => {
				if (res.code === 200) {
					const setParam = JSON.parse(res.result.setParam);
					const setCodes = res.result.setCodes.split("|");
					const setNames = res.result.setNames.split("|");
					// 渲染查询表单
					this.tableData2 = this.getParamsList(setParam, setCodes, setNames);
					//清空数据
					this.resetClick();
				}
			});
		},

		async searchClick() {
			this.isLoading = true;
			this.req.requestCount = 1; // 点击查询按钮
			this.pageLoad();
		},
		async pageLoad() {
			// 校验查询参数
			const { message } = this.tableDataFormate();
			if (message) {
				this.$Message.error(message);
				return;
			}
			//左侧查询参数 --必要参数接收[所有查询条件的值为空时，返回false,不可查询]
			const arr = this.toObject(this.tableData2);
			this.req.setParam = JSON.stringify(arr);
			this.$Spin.show();

			await getExcelPreviewReq(this.req)
				.then((res) => {
					if (res.code === 200) {
						this.jsonStr = JSON.parse(res.result.jsonStr);
						if (this.isLoading) {
							this.req = {
								...this.req,
								total: this.jsonStr[this.jsonIndex].total === -1 ? 0 : this.jsonStr[this.jsonIndex].total,
								totalPage: this.jsonStr[this.jsonIndex].pageCount === -1 ? 0 : this.jsonStr[this.jsonIndex].pageCount,
								elapsedMilliseconds: res.elapsedMilliseconds,
							};
							if (this.jsonStr[this.jsonIndex].total !== -1) this.isLoading = false;
						} else {
							this.req = {
								...this.req,
								elapsedMilliseconds: res.elapsedMilliseconds,
							};
						}
						// 渲染表格
						this.getTable(this.jsonStr);
					} else {
						this.$Message.error({
							content: res.message,
							duration: 3,
						});
						this.sheetData = [{}];
					}
				})
				.finally(() => {
					this.searchPoptipModal = false;
					this.$Spin.hide();
				});
		},

		//初始化表格
		getTable(data) {
			if (!data[0].celldata.length) {
				this.$Message.warning("查询结果为空");
				return;
			}
			//   this.htm = "<table class='table tableScroll' id='exceltable'>";
			let { celldata, config, frozen } = data[0];
			this.tableHtml = [];
			// 处理表格单元格样式
			celldata.forEach((item, index) => {
				const { r, c } = item;
				if (!this.tableHtml[r]) this.tableHtml[r] = [];
				if (!this.tableHtml[r][c]) this.tableHtml[r][c] = {};

				const { v, bg, bl, fc, ht, vt, mc, fs, valueType, conditions } = item.v; //获取样式
				const { columnlen, rowlen, borderInfo } = config; //边框
				let style = "";
				//   宽高
				let width = columnlen && columnlen[c] ? columnlen[c] : 75;
				let height = rowlen && rowlen[r] ? rowlen[r] : 18;
				//边框
				let border = this.getBorderInfo(borderInfo, r, c);
				// td 样式
				if (bg) style += `background:${bg};`; //背景颜色
				if (bl) style += `font-weight:${bl == 1 ? "bold" : "normal"};`; //字体粗细
				if (fc) style += `color:${fc};`; //字体颜色
				if (fs) style += `font-size:${fs}px;`; //文字大小
				if (ht) style += `justify-content:${ht == 0 ? "center" : ht == 2 ? "right" : "left"};`; //水平居中 0:居中;1:居左;2:居右
				if (vt) style += `align-items:${vt == 0 ? "center" : vt == 2 ? "right" : "left"};`; //垂直居中
				if (border) style += `border:${border};`; //边框
				if (frozen?.type && r == 0) style += "position:sticky;top:0;"; //冻结首行
				style += this.getCondition(conditions, v, index); //条件属性设定
				//合并单元格
				const colspan = `${mc?.cs || 1}`;
				const rowspan = `${mc?.rs || 1}`;
				if (colspan > 1 && rowspan > 1) {
					for (let i = 0; i < colspan; i++) {
						for (let j = 0; j < rowspan; j++) {
							if (!this.tableHtml[r + j]) this.tableHtml[r + j] = [];
							if (!this.tableHtml[r + j][c + i]) this.tableHtml[r + j][c + i] = {};
							this.tableHtml[r + j][c + i] = { ...this.tableHtml[r][c + i], rowspan: 0 };
						}
					}
				} else {
					if (colspan > 1) {
						for (let i = 1; i < colspan; i++) {
							if (!this.tableHtml[r]) this.tableHtml[r] = [];
							if (!this.tableHtml[r][c + i]) this.tableHtml[r][c + i] = {};
							this.tableHtml[r][c + i] = { ...this.tableHtml[r][c + i], rowspan: 0 };
						}
					}
					if (rowspan > 1) {
						for (let i = 1; i < rowspan; i++) {
							if (!this.tableHtml[r + i]) this.tableHtml[r + i] = [];
							if (!this.tableHtml[r + i][c]) this.tableHtml[r + i][c] = {};
							this.tableHtml[r + i][c] = { ...this.tableHtml[r + i][c], rowspan: 0 };
						}
					}
				}

				//td 内部div样式
				let divStyle = `width:${width * colspan}px;height:${height * rowspan}px;line-height:${height * rowspan}px;`; //宽高
				divStyle += `white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: flex;`; //超出文字省略
				if (ht) divStyle += `justify-content:${ht == 0 ? "center" : ht == 2 ? "right" : "left"};`; //水平居中 0:居中;1:居左;2:居右
				if (vt) divStyle += `align-items:${vt == 0 ? "center" : vt == 2 ? "right" : "left"};`; //垂直居中

				this.tableHtml[r][c] = { style, colspan, rowspan, divStyle, valueType, value: this.jsonStr[0].celldata[index].v.v };
			});
		},
		// 获取边框
		getBorderInfo(borderInfo, r, c) {
			let border = "1px solid #eeeeee";
			borderInfo?.forEach((borderItem, borderIndex) => {
				const { borderType, color, range, rangeType } = borderItem;
				if (rangeType === "range" && range[0]) {
					//列号在范围内
					const columnRang = range[0].column[0] <= c && range[0].column[1] >= c;
					//行号在范围内
					const rowRang = range[0].row[0] <= r && range[0].row[1] >= r;
					if (borderType === "border-all" && columnRang && rowRang) {
						border = `1px solid ${color}`;
					}
					if (borderType === "border-none" && columnRang && rowRang) {
						border = `none`;
					}
				}
			});
			return border;
		},
		//条件属性设定
		getCondition(conditions, v, index) {
			let style = "";
			conditions?.forEach((item) => {
				const { filterData, types } = item;
				let filterDataTemp = filterData
					.replace(/currentValue/gi, `"${v}"`)
					.replace(/and/gi, "&&")
					.replace(/or/gi, "||");
				// eval 字符串 转Js
				if (eval(filterDataTemp)) {
					types.forEach((tItem) => {
						const { type, value } = tItem;
						switch (type) {
							case "color":
								style += `color:${value};`;
								break;
							case "bg":
								style += `background-color:${value};`;
								break;
							case "border":
								style += `border-color:${value};`;
								break;
							case "newValue":
								this.jsonStr[0].celldata[index].v.v = value;
								break;
						}
					});
				}
			});
			return style;
		},
		//获取查询参数 并获得参数类型及是否必填
		getParamsList(setParam, setCodes, setNames) {
			const extendObj = setParam;
			const extendArry = [];
			for (const i in extendObj) {
				const children = [];
				for (const y in extendObj[i]) {
					if (!y.endsWith("required") && !y.endsWith("type") && !y.endsWith("paramAstrict") && !y.endsWith("paramDesc")) {
						children.push({
							name: y,
							value: extendObj[i][y],
							type: extendObj[i][y + "type"],
							required: extendObj[i][y + "required"],
							paramAstrict: extendObj[i][y + "paramAstrict"],
							paramDesc: extendObj[i][y + "paramDesc"],
						});
						this.ruleValidate[i + y] = [{ required: true, message: "The name cannot be empty", trigger: "blur" }];
					}
				}
				//报表编码的索引,从而获取报表编码的名称
				const index = setCodes.findIndex((item) => {
					return item === i;
				});
				extendArry.push({ name: i, children: children, title: setNames[index] });
			}
			return extendArry;
		},
		// Excel导出
		async download(name) {
			// 校验查询参数
			const { message } = this.tableDataFormate();
			if (message) {
				this.$Message.error(message);
				return;
			}
			//左侧查询参数 --必要参数接收[所有查询条件的值为空时，返回false,不可查询]
			const arr = this.toObject(this.tableData2);
			this.req.setParam = JSON.stringify(arr);

			const obj = { ...this.req, exportType: name };
			let fileName = `${this.$route.query.reportName}` + "-" + `${formatDate(new Date())}.xlsx`; // 自定义文件名
			let type = { type: "application/vnd.ms-excel" }; //接收excel类型
			let exportInfo = "导出失败";
			// "application/zip"
			switch (name) {
				case 1:
					fileName = `${this.$route.query.reportName}` + "-" + `${formatDate(new Date())}.csv`;
					type = { type: "text/csv" };
					this.exportReqFun(obj, type, fileName, exportInfo);
					break;
				case 2:
					this.exportReqFun(obj, type, fileName, exportInfo);
					break;
				case 3:
					type = { type: "application/vnd.ms-excel" };
					exportInfo = "导出失败,仅支持一万笔以内的导出";
					this.exportReqFun(obj, type, fileName, exportInfo);
					break;
				case 4:
					this.exportReqFun(obj, type, fileName, exportInfo);
					break;
				case 5:
					fileName = `${this.$route.query.reportName}` + "-" + `${formatDate(new Date())}.xls`;
					// 前端自己导出表格
					$("#exceltable").table2excel({
						filename: fileName, //文件名称
					});
					break;
			}
		},
		//导出function
		exportReqFun(obj, type, fileName) {
			const httpPath = `${window.localStorage.getItem("reportDesignIp")}/api/autoreportcenter/anonymous/v1/reportexcel/export`;
			const that = this;
			this.$Spin.show();
			//后端导出excel
			axios
				.post(httpPath, obj, {
					responseType: "arraybuffer",
					headers: { "Content-Type": "application/json; application/octet-stream" },
					onDownloadProgress: function (progressEvent) {
						that.showProgess(progressEvent);
					},
				})
				.then((res) => {
					// 导出ZIP 文件
					if (res.headers["content-type"] === "application/zip") {
						let blob = new Blob([res.data], { type: "application/zip" }); //设置下载的内容以及格式
						const url = window.URL.createObjectURL(blob); //设置路径
						const link = window.document.createElement("a"); // 创建a标签
						link.href = url;
						link.download = `${this.$route.query.reportName}` + "-" + `${formatDate(new Date())}.zip`; //设置文件名
						link.style.display = "none";
						link.click();
						URL.revokeObjectURL(url); // 释放内存
					} else {
						let blob = new Blob([res.data], type);
						exportFile(blob, fileName);
					}
					this.percent = 0; //进度条 重置 0
				})
				.catch(() => {
					this.percent = 0;
				});
		},
		showProgess(progress) {
			this.$Spin.hide();
			this.percent = Math.round((progress.loaded / progress.total) * 100);
		},
		// 获取总页数 总条数
		getTotalPage() {
			this.loading = true;

			getTotalPageReq(this.req).then((res) => {
				if (res.code === 200) {
					this.loading = false;
					this.isLoading = false; //已经加载过总页数
					const { total, totalPage } = res.result;
					this.req = {
						...this.req,
						total,
						totalPage,
					};
				}
			});
		},
		//重置
		resetClick() {
			this.tableData2.map((item) => {
				item.children.map((cItem) => {
					if (cItem.type !== "Boolean") {
						cItem.value = "";
					}
				});
			});
		},
		//数据格式化
		tableDataFormate() {
			let flag = false;
			let message = "";
			try {
				this.tableData2.map((item) => {
					item.children.map((o, index) => {
						//至少有一个查询条件
						if (o.value) flag = true;
						//时间类型 格式化 + 校验是否在范围内
						if (o.type === "DateTime") {
							o.value = formatDate(o.value);
							if (item.children[index - 1]?.type === "DateTime") {
								const preTime = item.children[index - 1].value;
								const diff = new Date(o.value).getTime() - new Date(preTime).getTime();
								const day = Math.floor(diff / (24 * 3600 * 1000));
								if (day > item.children[index - 1].paramAstrict) {
									flag = true;
									message = "超出最大查询时间差,请重新选择";
									throw message;
								}
							}
						}
						// 数据类型 校验是否长度超出
						if (o.type === "Array" && o.value) {
							const value = o.value.replace(/\n/gi, ",");
							const length = value.split(",").length;
							if (length > parseInt(o.paramAstrict)) {
								flag = true;
								message = "超出最大数组长度,请重新输入";
								throw message;
							}
						}
					});
				});
			} catch (e) {}
			if (!flag && !message) {
				message = "操作失败，至少要有一个查询条件！";
			}
			return { flag, message };
		},
		// 表单封装json
		toObject(val) {
			const objfirst = {};
			const objSecond = {};
			val.forEach((el) => {
				el.name ? (objfirst[el.name] = el.children) : "";
			});
			for (const key in objfirst) {
				const newObj = {};
				objfirst[key].map((ev) => {
					Object.assign(newObj, { [ev.name]: ev.value, [ev.name + "required"]: ev.required, [ev.name + "type"]: ev.type });
				});
				objSecond[key] = newObj;
			}
			return objSecond;
		},
		// 选择第几页
		pageChange(index) {
			this.req.requestCount = index;
			this.pageLoad();
		},
		// 选择一页几条数据
		pageSizeChange(index) {
			this.req.requestCount = 1;
			this.req.pageSize = index;
			this.pageLoad();
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.req.reportCode = this.$route.query.reportCode;
			document.title = this.$route.query.reportName;
			this.tableData2 = [];
			this.getParams();
		});
	},
};
</script>
<style>
@import "../../../assets/table.less";
.excel-preview .card-style {
	padding: 1rem;
}
#excel-preview-dropdown .ivu-select-dropdown {
	top: 45px !important;
}
.excel-preview .ivu-progress {
	position: absolute;
	top: 0px;
}
</style>
<style lang="less" scoped>
.title {
	display: inline-block;
	padding: 4px;
	margin-bottom: 10px;
	font-weight: bold;
	color: #3a3c41;
	text-align: left;
	line-height: 1.3rem;
	border-bottom: 2px solid #27ce88;
	border-radius: 6px;
}
.content-top {
	.report-title {
		font-size: 1.14rem;
		margin: 0 auto;
		font-weight: 600;
		text-align: center;
		position: absolute;
		z-index: 100;
		left: 40%;
	}
	i {
		color: #6c6666;
		font-size: 1.62rem;
		margin-right: 0.3rem;
		float: right;
	}
}

/deep/.ivu-modal-fullscreen .ivu-modal-body {
	width: 100%;
	overflow: auto;
	position: absolute;
	top: 43px;
	bottom: 43px;
	right: 0;
	left: 0;
	padding: 0;
}
/deep/.layout,
.ivu-layout {
	height: 100%;
	background: #fff;
}
.excel-page {
	width: 100%;
	position: absolute;
	bottom: 8px;
	z-index: 9999;
	background: #fff;
}
.submitForm {
	padding: 0.5rem;
	max-height: 20rem;
	overflow-y: auto;
}
.blankBg {
	background: url("~@/assets/images/report-design/blankBox.png") no-repeat;
	background-position: center center;
	background-size: 20%;
}
:deep(.poptip-style-button) {
	margin-top: 10px;
}
:deep(.ivu-dropdown-rel) {
	height: 26px;
}
.total-btn {
	color: #fff;
	background: #2fe86f;
	padding: 4px 10px;
	border: 1px solid #2fe86f;
	&:hover {
		background: #27ce88;
		border: 1px solid #27ce88;
	}
}
</style>
