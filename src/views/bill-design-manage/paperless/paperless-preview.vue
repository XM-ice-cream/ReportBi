<template>
	<Modal v-model="modalFlag" fullscreen :mask="false" :z-index="999" transfer>
		<div class="page-style excel-preview">
			<div class="comment">
				<Card :bordered="false" dis-hover class="card-style">
					<!-- 表格 -->
					<div class="data-table" style="height: 100%">
						<table class="table tableScroll" id="exceltable" :class="tableHtml.length > 1 ? '' : 'blankBg'">
							<tr v-for="(itemTr, indexTr) in tableHtml" :key="indexTr" style="height: 18px">
								<template v-for="(item, index) in itemTr">
									<td v-if="item && item.rowspan" :style="item.style" :colspan="item.colspan || 1" :rowspan="item.rowspan || 1" :key="index">
										<div :title="item.value" :style="item.divStyle" :v-html="item.divInner">
											{{ item.value }}
										</div>
									</td>
									<td v-if="!item" :key="index" style="width: 75px; height: 18px"></td>
								</template>
							</tr>
						</table>
					</div>
				</Card>
			</div>
		</div>
	</Modal>
</template>

<script>
export default {
	name: "paperless-preview",
	components: {},
	data() {
		return {
			tableHtml: [],
			modalFlag: false,
		};
	},
	watch: {
		modalFlag() {
			this.getTable();
		},
	},
	methods: {
		//初始化表格
		getTable() {
			let data =
				'{"name": "report", 	"color": "", 	"index": 0, 	"status": 1, 	"order": 0, 	"hide": 0, 	"row": 36, 	"column": 18, 	"defaultRowHeight": 19, 	"defaultColWidth": 73, 	"celldata": [{ 		"r": 0, 		"c": 0, 		"v": { 			"mc": { 				"r": 0, 				"c": 0, 				"rs": 1, 				"cs": 12 			}, 			"m": "IPQC CheckList-SMT2", 			"ct": { 				"fa": "General", 				"t": "g" 			}, 			"v": "IPQC CheckList-SMT2", 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 1, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 2, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 3, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 4, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 5, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 6, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 7, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 8, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 9, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 10, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 0, 		"c": 11, 		"v": { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		} 	}, { 		"r": 1, 		"c": 0, 		"v": { 			"getCellValue": null, 			"cellType": { 				"type": "checkbox", 				"default": "ES", 				"data": [{ 					"name": "ES", 					"value": "ES" 				}, { 					"name": "EVT", 					"value": "EVT" 				}, { 					"name": "PVT", 					"value": "PVT" 				}, { 					"name": "MP", 					"value": "MP" 				}] 			} 		} 	}, { 		"r": 1, 		"c": 1, 		"v": { 			"m": "客户名称", 			"ct": { 				"fa": "General", 				"t": "g" 			}, 			"v": "客户名称" 		} 	}, { 		"r": 1, 		"c": 2, 		"v": { 			"getCellValue": null, 			"cellType": { 				"type": "input", 				"default": "", 				"data": [] 			} 		} 	}, { 		"r": 1, 		"c": 3, 		"v": {} 	}, { 		"r": 2, 		"c": 1, 		"v": { 			"m": "机种名称", 			"ct": { 				"fa": "General", 				"t": "g" 			}, 			"v": "机种名称" 		} 	}, { 		"r": 2, 		"c": 2, 		"v": { 			"getCellValue": null, 			"cellType": { 				"type": "input", 				"default": "", 				"data": [] 			} 		} 	}, { 		"r": 2, 		"c": 4, 		"v": {} 	}], 	"config": { 		"merge": { 			"0_0": { 				"r": 0, 				"c": 0, 				"rs": 1, 				"cs": 12 			} 		}, 		"rowlen": { 			"0": 56 		}, 		"columnlen": {}, 		"rowhidden": {}, 		"colhidden": {}, 		"borderInfo": {}, 		"authority": {}, 		"customHeight": { 			"0": 1 		} 	}, 	"scrollLeft": 0, 	"scrollTop": 0, 	"luckysheet_select_save": [{ 		"left": 222, 		"width": 73, 		"top": 57, 		"height": 19, 		"left_move": 222, 		"width_move": 73, 		"top_move": 57, 		"height_move": 19, 		"row": [1, 1], 		"column": [3, 3], 		"row_focus": 1, 		"column_focus": 3 	}], 	"calcChain": [], 	"isPivotTable": false, 	"pivotTable": {}, 	"filter_select": {}, 	"filter": null, 	"luckysheet_alternateformat_save": [], 	"luckysheet_alternateformat_save_modelCustom": [], 	"luckysheet_conditionformat_save": {}, 	"frozen": {}, 	"chart": [], 	"zoomRatio": 1, 	"image": [], 	"showGridLines": 1, 	"dataVerification": {}, 	"jfgird_select_save": [], 	"data": [ 		[{ 			"mc": { 				"r": 0, 				"c": 0, 				"rs": 1, 				"cs": 12 			}, 			"m": "IPQC CheckList-SMT2", 			"ct": { 				"fa": "General", 				"t": "g" 			}, 			"v": "IPQC CheckList-SMT2", 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, { 			"mc": { 				"r": 0, 				"c": 0 			}, 			"bl": 1, 			"ht": "0" 		}, null, null, null, null, null, null], 		[{ 			"getCellValue": null, 			"cellType": { 				"type": "checkbox", 				"default": "ES", 				"data": [{ 					"name": "ES", 					"value": "ES" 				}, { 					"name": "EVT", 					"value": "EVT" 				}, { 					"name": "PVT", 					"value": "PVT" 				}, { 					"name": "MP", 					"value": "MP" 				}] 			} 		}, { 			"m": "客户名称", 			"ct": { 				"fa": "General", 				"t": "g" 			}, 			"v": "客户名称" 		}, { 			"getCellValue": null, 			"cellType": { 				"type": "input", 				"default": "", 				"data": [] 			} 		}, {}, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, { 			"m": "机种名称", 			"ct": { 				"fa": "General", 				"t": "g" 			}, 			"v": "机种名称" 		}, { 			"getCellValue": null, 			"cellType": { 				"type": "input", 				"default": "", 				"data": [] 			} 		}, null, {}, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], 		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] 	], 	"visibledatarow": [57, 77, 97, 117, 137, 157, 177, 197, 217, 237, 257, 277, 297, 317, 337, 357, 377, 397, 417, 437, 457, 477, 497, 517, 537, 557, 577, 597, 617, 637, 657, 677, 697, 717, 737, 757], 	"visibledatacolumn": [74, 148, 222, 296, 370, 444, 518, 592, 666, 740, 814, 888, 962, 1036, 1110, 1184, 1258, 1332], 	"ch_width": 1452, 	"rh_height": 837, 	"luckysheet_selection_range": [], 	"images": {} }';
			data = JSON.parse(data);
			let { celldata, config, frozen } = data;
			this.tableHtml = [];
			// 处理表格单元格样式
			celldata.forEach((item, index) => {
				const { r, c } = item;
				//console.log(r, c, item);
				if (!this.tableHtml[r]) this.tableHtml[r] = [];
				if (!this.tableHtml[r][c]) this.tableHtml[r][c] = {};

				const { v, bg, bl, fc, ht, vt, mc, fs, cellType, authority } = item.v; //获取样式
				console.log(item.v);
				const { columnlen, rowlen } = config; //边框
				let style = "";
				//   宽高
				let width = columnlen && columnlen[c] ? columnlen[c] : 75;
				let height = rowlen && rowlen[r] ? rowlen[r] : 18;
				// td 样式
				if (bg) style += `background:${bg};`; //背景颜色
				if (bl) style += `font-weight:${bl == 1 ? "bold" : "normal"};`; //字体粗细
				if (fc) style += `color:${fc};`; //字体颜色
				if (fs) style += `font-size:${fs}px;`; //文字大小
				if (ht) style += `justify-content:${ht == 0 ? "center" : ht == 2 ? "right" : "left"};`; //水平居中 0:居中;1:居左;2:居右
				if (vt) style += `align-items:${vt == 0 ? "center" : vt == 2 ? "right" : "left"};`; //垂直居中
				if (frozen?.type && r == 0) style += "position:sticky;top:0;"; //冻结首行
				style += `border:1px solid #eeeeee;`; //边框
				//合并单元格
				const colspan = `${mc?.cs || 1}`;
				const rowspan = `${mc?.rs || 1}`;

				//td 内部div样式
				let divStyle = `width:${width * colspan}px;height:${height * rowspan}px;line-height:${height * rowspan}px;`; //宽高
				divStyle += `white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: flex;`; //超出文字省略
				if (ht) divStyle += `justify-content:${ht == 0 ? "center" : ht == 2 ? "right" : "left"};`; //水平居中 0:居中;1:居左;2:居右
				if (vt) divStyle += `align-items:${vt == 0 ? "center" : vt == 2 ? "right" : "left"};`; //垂直居中

				// td 内部输入框、复选框、时间选择器
				let divInner = "";
				if (cellType) {
					if (cellType.type === "input") {
						divInner = "<input type='text' value='" + cellType.default + "'/>";
						console.log(divInner);
					}
				}

				this.tableHtml[r][c] = { style, colspan, rowspan, divStyle, value: v, divInner };
			});
		},
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
