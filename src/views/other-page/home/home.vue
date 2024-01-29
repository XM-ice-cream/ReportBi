<template>
	<div class="page-style overflowY home-style">
		<div class="home-content">
			<div class="home-form">
				<RadioGroup v-model="req.dateType" size="small" type="button" button-style="solid" class="content-radio" @on-change="pageLoad('')">
					<Radio label="day">日</Radio>
					<Radio label="week">周</Radio>
					<Radio label="month">月</Radio>
				</RadioGroup>

				<RadioGroup v-model="req.type" size="small" type="button" button-style="solid" class="content-radio" @on-change="pageLoad('')">
					<Radio label="BI">BI</Radio>
					<Radio label="Report">Report</Radio>
				</RadioGroup>
			</div>
			<div class="content-top">
				<div class="header-box user-info">
					<img class="head-portrait" src="../../../assets/images/home/headIcon.png" />
					<div class="base-info">
						<div class="title">你好，{{ userName }} !</div>
						<div class="num">{{ account }}</div>
					</div>
				</div>
				<div class="header-box model-info">
					<div class="model-base">
						<div class="sub-title">新增模型</div>
						<div class="title">{{ data.addModelCount }}</div>
						<div class="sub-title">总模型数量: {{ data.modelCount }}</div>
					</div>
					<div class="model-line">
						<LineNewModel :data="datasetList" v-if="isShow" />
					</div>
				</div>
				<div class="header-box model-info">
					<div class="model-base">
						<div class="sub-title">新增模板</div>
						<div class="title">{{ data.addWorkbookCount }}</div>
						<div class="sub-title">总模板数量: {{ data.workbookCount }}</div>
					</div>
					<div class="model-line">
						<LineNewExample :data="workbookList" v-if="isShow" />
					</div>
				</div>
				<div class="header-box model-info">
					<div class="model-base">
						<div class="sub-title">访问次数</div>
						<div class="title">{{ data.addCount }}</div>
						<div class="sub-title">
							较{{ getCurrArea }} {{ data.addCountPreRt }}
							<Icon type="ios-undo" v-if="data.addCountPreRt > 0" />
							<Icon type="md-share-alt" v-if="data.addCountPreRt < 0" />
						</div>
					</div>
					<div class="model-line">
						<BarViewTimes :data="clickList" v-if="isShow" />
					</div>
				</div>
			</div>
			<div class="content-center">
				<div class="center-box">
					<div class="box-title">
						<span>已收藏BI模板</span>
						<span>/ Collect BI Templates</span>
						<span @click="previewMore('BI')">查看更多 > </span>
					</div>
					<div class="box">
						<div class="box-cell" v-for="item in data.biModelList.concat(data.dashboardModelList)" @click="preview('BI', item)">
							<img src="../../../assets/images/home/bi.png" />
							<div class="collect">
								<span>{{ item.name }}</span>
								<span>{{ item.code }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="center-box">
					<div class="box-title">
						<span>已收藏Report模板</span>
						<span>/ Collect Report Templates</span>
						<span @click="previewMore('Report')">查看更多 > </span>
					</div>
					<div class="box">
						<div class="box-cell" v-for="item in data.reportModelList" @click="preview('Report', item)">
							<img src="../../../assets/images/home/report.png" />
							<div class="collect">
								<span>{{ item.name }}</span>
								<span>{{ item.code }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="right-box">
					<div class="box-title">
						<span>访问模板排名</span>
						<span> / Visit Model Ranking</span>
					</div>
					<div class="box">
						<div class="box-cell" v-for="(item, index) in data.top5Data" @click="getTopChartRecord(item.workBooId, index)">
							<div class="example-info">
								<span class="order">{{ index + 1 }}</span>
								<!-- <span class="model-type">{{ templateList[item.modelName] }}模型</span> -->
								<span class="model-name">{{ item.workBookName }}</span>
								<div style="display: inline-block; float: right">
									<span class="num"
										><span style="font-weight: bold">{{ item.clickCount }}</span
										>次</span
									>
									<span class="taketime"><Icon type="md-time" /> 平均耗时：{{ item.pTimeConSum }} ms</span>
								</div>
							</div>
							<Progress
								:stroke-width="4"
								:percent="(item.clickCount / data.addCount) * 100"
								hide-info
								:stroke-color="['rgba(39,206,136,0)', '#27CE88']"
							/>
						</div>
					</div>
				</div>
			</div>
			<!-- top5 -->
			<div class="content-bottom">
				<div class="bottom-left">
					<div class="box-title">
						<span>访问次数统计</span>
						<span>/ Visit Statistics</span>
					</div>
					<!-- 访问次数折线图 -->
					<div class="box">
						<LineRecord index="0" ref="lineRecordChartRef" :data="data.lineRecordData" />
					</div>
				</div>
				<div class="bottom-right">
					<div class="box-title">
						<span>模型占比统计</span>
						<span>/ Model Proportion Statistics</span>
					</div>
					<div class="box">
						<PieModel index="0" ref="pieModelRef" v-if="isShow" :data="data.modelRecordData" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getreportbirecordReq, gettopfiveReq, getmodelrecordReq, getCollectReq, getTopChartRecordReq } from "@/api/other-page/home";
import { getlistReq } from "@/api/system-manager/data-item";
import { formatDate } from "@/libs/tools";
import AvatarCustom from "@/components/avatar-custom";
import LineRecord from "@/components/echarts/line-record";
import LineNewExample from "@/components/echarts/line-new-example";
import LineNewModel from "@/components/echarts/line-new-model";

import PieModel from "@/components/echarts/pie-model";
import BarViewTimes from "@/components/echarts/bar-view-times.vue";

export default {
	name: "home",
	components: { AvatarCustom, LineRecord, PieModel, LineNewModel, LineNewExample, BarViewTimes },
	data() {
		return {
			isShow: false,
			modalFlag: false,
			modalTitle: "",
			lineChartTitle: "访问记录",
			templateList: {}, //模板list
			req: {
				type: "BI",
				dateType: "day",
			},
			data: {
				top5Data: [],
				biModelList: [],
				dashboardModelList: [],
				reportModelList: [],
				lineRecordData: [],
				modelRecordData: [],
			},
			userIP: this.$store.state.ip,
			headIcon: this.$store.state.avatarImgPath,
			account: this.$store.state.account,
			userName: this.$store.state.userName,
			email: this.$store.state.email,
			phone: this.$store.state.phone,
			vipLevel: this.$store.state.vipLevel,
			datasetList: [],
			workbookList: [],
			clickList: [],
		};
	},
	computed: {
		getCurrArea() {
			let obj = {
				day: "昨日",
				week: "上周",
				month: "上月",
			};
			return obj[this.req.dateType];
		},
	},
	mounted() {
		this.$Message.destroy();
		this.pageLoad();
		this.getDataItemData();
	},
	methods: {
		async pageLoad() {
			this.lineChartTitle = "访问记录";
			this.getNum();
			this.getTopFive();
			this.getTopChartRecord("");

			this.data.biModelList = await this.getCollectList("BI");
			const dashboardList = await this.getCollectList("Dashboard");
			this.data.biModelList = this.data.biModelList.concat(dashboardList);
			this.data.reportModelList = await this.getCollectList("Report");
			this.datasetList = await this.getTopChartRecordTop("dataset");
			this.workbookList = await this.getTopChartRecordTop("workbook");
			this.clickList = await this.getTopChartRecordTop("");
			await this.$nextTick(() => {
				this.isShow = true;
				this.data = JSON.parse(JSON.stringify(this.data));
			});
			await this.getModelRecord();
		},
		//获取汇总数量
		getNum() {
			const obj = {
				dateType: this.req.dateType,
				reportType: this.req.type,
			};
			getreportbirecordReq(obj).then((res) => {
				if (res.code == 200) {
					this.data = { ...this.data, ...res.result };
				}
			});
		},
		//获取top5
		getTopFive() {
			const obj = {
				dateType: this.req.dateType,
				reportType: this.req.type,
			};
			gettopfiveReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res?.result || [];
					this.data.top5Data = data;
				}
			});
		},
		//折线图
		getTopChartRecord(id, index) {
			if (id) this.lineChartTitle = `访问记录【${this.data.top5Data[index].workBookName}】`;
			const obj = {
				id,
				dateType: this.req.dateType,
				reportType: this.req.type,
			};
			getTopChartRecordReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res?.result || [];
					this.data.lineRecordData = data;
					this.$nextTick(() => {
						this.$refs?.lineRecordChartRef.initChart();
					});
				}
			});
		},
		//获取模型占比
		getModelRecord() {
			const obj = {
				dateType: this.req.dateType,
				reportType: this.req.type,
			};
			getmodelrecordReq(obj).then((res) => {
				if (res.code === 200) {
					this.data.modelRecordData = res?.result || [];
					this.$nextTick(() => {
						this.$refs?.pieModelRef.initChart();
					});
				}
			});
		},
		//获取BI用户收藏
		async getCollectList(dataType) {
			let result = [];
			const obj = { reportType: dataType };
			await getCollectReq(obj).then((res) => {
				if (res.code == 200) {
					result = res?.result || [];
				}
			});
			return result;
		},
		//获取趋势图
		async getTopChartRecordTop(dataType) {
			let result = [];
			const obj = {
				dateType: this.req.dateType,
				reportType: this.req.type,
				dataType,
			};
			await getTopChartRecordReq(obj).then((res) => {
				result = res?.result || [];
			});
			return result;
		},
		//查看更多
		previewMore(type) {
			if (type === "BI") {
				this.$router.push({ name: "preview-bi" });
			} else {
				this.$router.push({ name: "preview-excel" });
			}
		},
		//跳转页面
		preview(type, data) {
			const { collect, name } = data;
			let params = type == "BI" ? { id: collect } : { reportCode: collect, reportName: name };
			let skipName = `${type}Preview`;
			const href = this.skipUrl(skipName, { ...params });
			window.open(href, "_blank");
		},
		//跳转路径
		skipUrl(key, data) {
			const obj = {
				ReportPreview: "/bill-design-manage/excelreport-preview",
				BIPreview: "/bill-design-manage/workbook-preview",
			};
			const { href } = this.$router.resolve({
				path: obj[key],
				query: { ...data },
			});
			return href;
		},
		// 弹窗取消事件
		modalCancel() {
			this.modalFlag = false;
			this.modalTitle = "";
		}, // 获取数据字典数据
		async getDataItemData() {
			this.templateList = await this.getDataItemDetailList("biTemplateModel");
		},
		async getDataItemDetailList(itemCode) {
			let arr = {};
			await getlistReq({ itemCode, enabled: 1 }).then((res) => {
				if (res.code === 200) res.result?.forEach((item) => (arr[item.detailCode] = item.detailName)) || [];
			});
			return arr;
		},
	},
};
</script>

<style>
.home-content .ivu-tabs-bar {
	margin-bottom: 0;
	border-bottom: none;
}
.home-content .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
	border: none;
	padding: 10px 50px;
	height: 100%;
	font-size: 16px;
	font-weight: bold;
}
.home-content .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
	height: 50px;
}
.home-content .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-wrap {
	height: 100%;
}
.home-content .ivu-tabs-nav-scroll {
	height: 100%;
}
.home-content .ivu-tabs-nav {
	height: 100%;
}
.home-content .ivu-radio-group-button .ivu-radio-wrapper:first-child,
.home-content .ivu-radio-group-button .ivu-radio-wrapper:last-child {
	border-radius: 0px;
}
.home .ivu-radio-group-button .ivu-radio-wrapper {
	border: none;
}
</style>
<style scoped lang="less">
.home-style {
	background: #f5f7f9;
}
.home-card {
	box-shadow: -1px 1px 6px #e0e6ea;
}

.home-content {
	height: 100%;
	.home-form {
		margin-bottom: 15px;
		div {
			margin-right: 10px;
		}
	}
	.box-title {
		height: 30px;
		background: url("../../../assets/images/home/title.png");
		background-repeat: no-repeat;
		background-position: bottom left;
		padding-left: 15px;
		line-height: 30px;
		span:nth-child(1) {
			color: #333333;
			font-weight: bold;
			font-size: 14px;
			margin-right: 5px;
		}
		span:nth-child(2) {
			color: #333333;
			font-weight: lighter;
		}
		span:nth-child(3) {
			color: #05995b;
			display: inline-block;
			float: right;
			cursor: pointer;
		}
	}
	.content-top {
		width: 100%;
		height: 140px;
		background: #fff;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		.header-box {
			width: calc(100% / 4 - 15px);
			height: 70%;
			background: rgba(126, 231, 201, 0.27);
			margin: 10px 0;
			padding: 15px 30px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-size: 18px;
				padding: 0;
				font-weight: bold;
				color: #09090c;
			}

			&.user-info {
				background: linear-gradient(180deg, rgba(126, 231, 201, 0.27), rgba(39, 206, 136, 0.06));
				img {
					width: 48px;
					height: auto;
				}
				.base-info {
					width: calc(100% - 68px);
					margin-left: 20px;

					.num {
						color: #3d3d3d;
						font-size: 14px;
						margin-top: 10px;
					}
				}
			}
			&.model-info {
				background: #eef4ff;
				.model-base,
				.model-line {
					width: 50%;
					height: 100%;
				}
				.sub-title {
					color: rgba(0, 0, 0, 0.53);
					font-size: 12px;
					margin: 8px 0;
					i {
						color: #fb574b;
						transform: rotate(90deg);
					}
					&:first-child {
						color: #555555;
					}
				}
				&:nth-child(3) {
					background: #fff1ee;
				}
				&:nth-child(4) {
					background: #f5f0ff;
				}
			}
		}
		.content {
			height: calc(100% - 200px - 10px);
			position: relative;
			.content-radio {
				position: absolute;
				top: 5px;
				right: 0;
				z-index: 1;
			}
			.left-collect {
				height: 200px;
				margin-bottom: 10px;
				background: #fff;
				.content {
					height: calc(100% - 70px);
					display: flex;
					flex-wrap: nowrap;
					align-content: center;
					justify-content: flex-start;
					align-items: center;
					margin: 0 10px;
					padding: 10px 0;
					overflow-x: auto;
					overflow-y: hidden;
					.box {
						width: 200px;
						height: 100%;
						border: 1px solid #efefef;
						position: relative;
						border-radius: 10px;
						flex-shrink: 0;
						margin: 0 10px;
						.name {
							width: 100%;
							position: absolute;
							text-align: center;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							color: #000;
							font-weight: bold;
							padding: 10px;
							font-size: 16px;
						}
						&:hover {
							background: #22936512;
							cursor: pointer;
							border: 1px solid #5dc79c;
							.name {
								font-size: 18px;
							}
						}
					}
					&::-webkit-scrollbar-thumb {
						border-radius: 5px;
						background-color: #f5f7f9;
					}
				}
			}
			.line-chart {
				height: calc(100% - 200px - 50px - 10px - 10px);
				background: #fff;
				margin-top: 10px;
			}
		}
	}
	.content-center {
		height: calc(60% - 37px - 140px - 15px);
		width: 100%;
		margin-top: 15px;
		.center-box {
			padding: 5px 15px;
			width: 30%;
			height: 100%;
			background: #fff;
			float: left;
			margin-right: 15px;

			.box {
				height: calc(100% - 50px);
				margin-top: 15px;
				overflow: auto;

				.box-cell {
					height: 44px;
					line-height: 44px;
					border-bottom: 1px solid #f3f3f3;
					display: flex;
					align-items: center;
					margin-bottom: 8px;
					padding-bottom: 8px;
					cursor: pointer;
					img {
						vertical-align: middle;
					}
					.collect {
						margin-left: 10px;
						span {
							color: #939393;
							font-size: 12px;
							display: block;
							line-height: 1.5;
						}
						span:nth-child(1) {
							color: #000000;
							font-size: 14px;
						}
					}
				}
			}
		}
		.right-box {
			width: calc(40% - 30px);
			padding: 5px 15px;
			height: 100%;
			background: #fff;
			float: left;
			.box {
				height: calc(100% - 50px);
				margin-top: 15px;
				overflow: auto;
				.box-cell {
					height: 44px;
					margin-bottom: 4px;
					.example-info {
						line-height: 2;
						.order {
							display: inline-block;
							width: 27px;
							height: 27px;
							text-align: center;
							line-height: 1.5;
							border: 1px solid rgba(149, 152, 206, 0.33);
							box-shadow: 0px 0px 3px rgba(149, 152, 206, 0.34);
							color: #9598ce;
							border-radius: 4px;
							font-size: 16px;
							margin-right: 10px;
						}
						.num {
							color: rgba(61, 61, 61, 0.87);
							margin-right: 10px;
						}
						.taketime {
							background: rgba(39, 206, 136, 0.12);
							color: rgba(21, 120, 78, 0.96);
							padding: 3px 10px;
							border-radius: 3px;
						}
					}
					&:nth-child(1) .example-info .order {
						border: 1px solid rgba(255, 22, 6, 0.55);
						box-shadow: 0px 0px 3px rgba(255, 22, 6, 0.27);
						color: #f74413;
						font-weight: bold;
					}
					&:nth-child(2) .example-info .order {
						border: 1px solid rgba(239, 155, 87, 0.55);
						box-shadow: 0px 0px 3px rgba(166, 168, 215, 0.6);
						color: #f3ba63;
						font-weight: bold;
					}
					&:nth-child(3) .example-info .order {
						border: 1px solid rgba(149, 152, 206, 0.33);
						box-shadow: 0px 0px 3px rgba(149, 152, 206, 0.36);
						color: #9598ce;
						font-weight: bold;
					}
				}
			}

			:deep(.ivu-progress-bg) {
				background: linear-gradient(90deg, rgba(39, 206, 136, 0) 0%, rgb(39, 206, 136) 100%) !important;
				position: relative;
			}
			:deep(.ivu-progress-bg:after) {
				content: "";
				position: absolute;
				right: 0;
				top: -1px;
				width: 8px;
				height: 6px;
				background: #27ce88;
			}
		}
	}
	.content-bottom {
		height: calc(40% - 15px - 2px);
		margin-top: 15px;
		width: 100%;

		.bottom-left {
			padding: 10px 15px;
			width: calc(60% + 15px);
			height: 100%;
			background: #fff;
			float: left;
			margin-right: 15px;
			.box {
				height: calc(100% - 45px);
				margin-top: 15px;
				overflow: auto;
			}
		}
		.bottom-right {
			padding: 10px 15px;
			width: calc(40% - 30px);
			height: 100%;
			background: #fff;
			float: right;
			.box {
				height: calc(100% - 50px);
				margin-top: 15px;
				overflow: auto;
			}
		}
	}
}
@keyframes rotate {
	0% {
		transform: translate(-50%, 0) rotateZ(0deg);
	}

	50% {
		transform: translate(-50%, -2%) rotateZ(180deg);
	}

	100% {
		transform: translate(-50%, 0%) rotateZ(360deg);
	}
}
</style>
