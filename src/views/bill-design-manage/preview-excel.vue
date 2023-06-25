/* Excel 预览 */
<template>
	<div class="page-style preview-excel">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Form ref="searchReq" :model="req" inline :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
						<!-- 类型 -->
						<!-- <FormItem :label="$t('reportType')" prop="reportType">
              <RadioGroup v-model="req.reportType" type="button" button-style="solid" @on-change='searchClick'>
                <Radio label="excel">Excel</Radio>
                <Radio label="largescreen">大屏</Radio>
              </RadioGroup>
            </FormItem> -->
						<!-- 报表分类 -->
						<FormItem label="报表分类" prop="remark">
							<Select
								v-model="req.remark"
								clearable
								:placeholder="$t('pleaseSelect') + '报表分类'"
								transfer
								filterable
								cleabler
								@on-change="searchClick"
								style="width: 200px"
							>
								<Option v-for="(item, i) in remarkList" :value="item.detailName" :key="i">
									{{ item.detailName }}
								</Option>
							</Select>
						</FormItem>
						<!-- 报表名称 -->
						<FormItem :label="$t('reportName')" prop="reportName">
							<Input v-model="req.reportName" clearable :placeholder="$t('pleaseEnter') + $t('reportName')" />
						</FormItem>
						<!-- 报表编码 -->
						<FormItem :label="$t('reportCode')" prop="reportCode">
							<Input v-model="req.reportCode" clearable :placeholder="$t('pleaseEnter') + $t('reportCode')" />
						</FormItem>

						<FormItem>
							<!-- 按钮 -->
							<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
						</FormItem>
					</Form>
				</div>
				<!-- 预览Card -->
				<div class="previewExcelCard">
					<template v-for="item in data">
						<div class="cardCell" title="点击查看" @click="preview(item.reportCode, item.reportName)">
							<span class="title">
								<span class="circle">
									<Icon type="ios-albums" />
								</span>
								<span class="name" :title="item.reportName">
									{{ item.reportName }}
								</span>
							</span>
							<Row :gutter="24">
								<Col :xl="24" :xxl="12">
									<div class="box">
										报表类别
										<span class="value" :title="item.remark" style="font-weight: bold">
											{{ item.remark }}
										</span>
									</div>
								</Col>
								<Col :xl="24" :xxl="12">
									<div class="box">
										报表编码
										<span class="value" :title="item.reportCode">
											{{ item.reportCode }}
										</span>
									</div>
								</Col>
								<Col :xl="24" :xxl="12">
									<div class="box">
										创建时间
										<span class="value" :title="formatDate(item.createDate)">
											{{ formatDate(item.createDate, "yyyy-MM-dd") }}
										</span>
									</div>
								</Col>
								<Col :xl="24" :xxl="12">
									<div class="box">
										修改时间
										<span class="value" :title="formatDate(item.modifyDate)">{{ formatDate(item.modifyDate, "yyyy-MM-dd") }}</span>
									</div>
								</Col>
							</Row>
						</div>
					</template>
				</div>
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
import { formatDate } from "@/libs/tools";
import { getpagelistReq } from "@/api/bill-design-manage/report-manage";
import { getpagelisttreeReq } from "@/api/organize-manager/authorize-manager/menu-manager";
import { getlistReq as getDataItemReq } from "@/api/system-manager/data-item";
export default {
	components: {},
	name: "previewExcel",
	data() {
		return {
			data: [], // 结果集
			selectObj: null, //表格选中
			formatDate: formatDate,
			roleBtn: [], //该角色下的报表权限卡片
			remarkList: [], //报表类型下拉
			pageConfig: { ...this.$config.pageConfig },
			req: {
				reportName: "",
				reportCode: "",
				reportType: "excel",
				remark: "",
				...this.$config.pageConfig,
			}, //查询数据
		};
	},
	mounted() {
		this.getRoleBtn();
		this.getDataItemData();
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
		},
		// 获取分页列表数据
		pageLoad() {
			this.data = [];
			const { reportType, reportName, reportCode, remark } = this.req;
			//   this.tableConfig.loading = true;
			let obj = {
				orderField: "reportType", // 排序字段
				ascending: true, // 是否升序
				pageSize: this.req.pageSize, // 分页大小
				pageIndex: this.req.pageIndex, // 当前页码
				data: {
					reportType,
					reportName,
					reportCode,
					remark,
					codeList: this.roleBtn.toString(),
				},
			};
			getpagelistReq(obj)
				.then((res) => {
					// this.tableConfig.loading = false;
					if (res.code === 200) {
						let { data, pageSize, pageIndex, total, totalPage } = res.result;
						this.data = data || [];
						this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
					}
				})
				.catch();
		},
		//设计
		design(reportCode, reportName) {
			const href = this.skipUrl(this.req.reportType + "Design", reportCode, reportName);
			window.open(href, "_blank");
		},
		// 预览
		preview(reportCode, reportName) {
			const href = this.skipUrl(this.req.reportType + "Preview", reportCode, reportName);
			window.open(href, "_blank");
		},
		//跳转路径
		skipUrl(key, reportCode, reportName) {
			const obj = {
				excelPreview: "/bill-design-manage/excelreport-preview",
				largescreenPreview: "/bill-design-manage/screenreport-preview",
				excelDesign: "/bill-design-manage/excelreport-design",
				largescreenDesign: "/bill-design-manage/screenreport-design",
			};
			const { href } = this.$router.resolve({
				path: obj[key],
				query: { reportCode, reportName },
			});
			return href;
		},
		//获取角色按钮
		getRoleBtn() {
			const obj = {
				orderField: this.pageConfig.orderField, // 排序字段
				ascending: true, // 是否升序
				pageSize: 9999, // 分页大小
				pageIndex: 1, // 当前页码
				data: {
					id: "",
					parentId: this.$store.state.menuId,
					category: 2,
					source: 1,
					name: "",
					title: "",
					enabled: 1,
				},
			};
			getpagelisttreeReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res.result.data;
					this.roleBtn = data.length ? data.map((item) => item.name) : ["a"];
					this.pageLoad();
				}
			});
		},
		// 获取业务数据
		async getDataItemData() {
			this.remarkList = await this.getDataItemDetailList("reportDesignType"); // 获取站点数据
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
<style>
.preview-excel .card-style .ivu-card-body {
	height: calc(100% - 60px);
	background: #f5f7f9;
}
.preview-excel .ivu-form-inline .ivu-form-item {
	display: inline-block;
	margin-right: 10px;
	vertical-align: middle;
	margin-bottom: 0px;
}
.preview-excel .ivu-col {
	margin: 5px 0;
}
</style>
<style scoped lang="less">
.previewExcelCard {
	height: calc(100% - 55px);
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	overflow-y: scroll;
	overflow-x: hidden;
	align-content: flex-start;
	background-color: #f5f7f9;
	padding-bottom: 1rem;
	.cardCell {
		width: 23.8%;
		/* background: #ccc; */
		border: 2px solid #fafcff;
		box-shadow: 3px 5px 7px #d0dbf194;
		padding: 20px;
		margin-top: 15px;
		margin-left: 15px;
		position: relative;
		background: #fff;
		border-radius: 0px;
		cursor: pointer;
		transition: all 0.2s ease-out;
		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 6px 16px 2px rgba(7 12 20 8%) !important;
			border: 2px solid #52d8a0 !important;
		}
		.title {
			width: 100%;
			height: 4rem;
			line-height: 3rem;
			display: inline-block;
			padding: 0.1rem;
			margin: 0.2rem;
			padding-bottom: 0.9rem;
			font-size: 0.92rem;
			color: #3a3b3ae0;
			font-weight: 600;
			//圆圈
			.circle {
				width: 3rem;
				height: 3rem;
				line-height: 3rem;
				background: #52d8a03b;
				/* padding: 0.3rem; */
				display: inline-block;
				text-align: center;
				border-radius: 10px;
				margin-right: 0.7rem;
				position: relative;
				box-shadow: 1px 2px 6px #cccc;
				i {
					font-size: 1.72rem;
					color: #52d79f;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
			//标题名
			.name {
				width: calc(100% - 4rem);
				overflow: hidden;
				display: inline-block;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #4f6185;
				font-weight: bold;
			}
			//操作--预览与编辑
			.title-dot {
				display: inline-block;
				float: right;
				line-height: 3rem;
				button {
					border: none;
					//   background: #ccc;
					margin-right: 0.6rem;
					padding: 0.2rem;
					border-radius: 4px;
				}
				i {
					width: 2rem;
					//   margin-right: 0.5rem;
					height: 100%;
					font-size: 1.12rem;
					//   padding: 0.3rem;
					//   color: #3771f5;
				}
			}
		}
		.box {
			line-height: 30px;
			padding: 5px 10px;
			background: #f7f9fc;
			color: #7c8994;
			.value {
				display: inline-block;
				width: calc(100% - 4rem);
				text-align: left;
				border-radius: 10px;
				float: right;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #334670;
				font-weight: bold;
			}
		}
	}
}
// 适配
@media (min-width: 1280px) {
	.previewExcelCard .cardCell {
		width: 31.6%;
	}
}
@media (min-width: 1536px) {
	.previewExcelCard .cardCell {
		width: 23.7%;
	}
}
@media (min-width: 1745.45px) {
	.previewExcelCard .cardCell {
		width: 23.8%;
	}
}
@media (min-width: 1920px) {
	.previewExcelCard .cardCell {
		width: 24%;
	}
}
</style>
