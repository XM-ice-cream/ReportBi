<template>
	<div class="page-style overflowY home-style">
		<div class="home-content">
			<div class="content-left">
				<div class="home-header">
					<!-- <div class="header-left"> -->

					<!-- </div> -->
					<div class="header-box home-card">
						<avatar-custom :imgUrl="headIcon" v-if="headIcon" class="home-icon"></avatar-custom>
						<template v-else>
							<div class="avatar-custom home-icon">
								<span class="ivu-avatar ivu-avatar-circle ivu-avatar-image ivu-avatar-small">
									<img class="head-portrait" src="../../../assets/images/default-head.png" />
								</span>
							</div>
						</template>
						<div class="user-info">
							<div class="user-content">
								<p>
									<span>工号</span><span>{{ account }}</span>
								</p>
								<p>
									<span>姓名</span><span>{{ userName }}</span>
								</p>
							</div>
						</div>
					</div>
					<div class="header-box home-card">
						<!-- <div class="title">模板数量</div>
							<div class="num">{{ data.workbookCount }}</div> -->
					</div>
					<div class="header-box home-card">
						<!-- <div class="title">访问次数</div>
							<div class="num">{{ data.clickCount }}</div> -->
					</div>
					<div class="header-box home-card">
						<!-- <div class="title">新增数</div>
							<div class="num">{{ data.addCount }}</div> -->
					</div>
				</div>
				<div class="content">
					<RadioGroup v-model="req.dateType" type="button" button-style="solid" size="default" class="content-radio" @on-change="pageLoad('')">
						<Radio label="month">月</Radio>
						<Radio label="week">周</Radio>
						<Radio label="day">天</Radio>
					</RadioGroup>
					<!-- 收藏表单 -->
					<Tabs type="card" v-model="req.type" @on-click="pageLoad('')">
						<TabPane label="BI" name="BI">
							<div class="left-collect">
								<div class="title">收藏模板</div>
								<div class="content">
									<div class="box" v-for="item in data.modelList">
										<div class="name textOverhidden">{{ item.name }}</div>
									</div>
								</div>
							</div>
						</TabPane>
						<TabPane label="Report" name="Report">
							<div class="left-collect">
								<div class="title">收藏模板</div>
								<div class="content">
									<div class="box" v-for="item in data.modelList">
										<div class="name textOverhidden">{{ item.name }}</div>
									</div>
								</div>
							</div>
						</TabPane>
					</Tabs>
					<!-- 访问次数折线图 -->
					<div class="line-chart">
						<div class="title">{{ lineChartTitle }}</div>
						<LineRecord index="0" ref="lineRecordChartRef" v-if="isShow" :data="data.lineRecordData" style="height: calc(100% - 70px)" />
					</div>
				</div>
			</div>
			<!-- top5 -->
			<div class="content-right">
				<div class="content-top">
					<div class="title">访问次数Top5</div>
					<div class="content">
						<div class="box" v-for="(item, index) in data.top5Data" @click="getTopChartRecord(item.workBooId, index)">
							<span class="order">NO.{{ index + 1 }}</span>
							<span class="model-type textOverhidden">{{ templateList[item.modelName] }}模型</span>
							<span class="model-name textOverhidden">{{ item.workBookName }}</span>
							<span class="num">{{ item.clickCount }}</span>
						</div>
					</div>
				</div>
				<div class="content-bottom">
					<div class="title">模型占比</div>
					<div class="content">
						<PieModel index="0" ref="pieModelRef" v-if="isShow" :data="data.modelRecordData" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getreportbirecordReq, gettopfiveReq, gettopchartrecordReq, getmodelrecordReq } from "@/api/other-page/home";
import { getlistReq } from "@/api/system-manager/data-item";
import { formatDate } from "@/libs/tools";
import AvatarCustom from "@/components/avatar-custom";
import LineRecord from "@/components/echarts/line-record";
import PieModel from "@/components/echarts/pie-model";

export default {
	name: "home",
	components: { AvatarCustom, LineRecord, PieModel },
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
				modelList: [
					{
						name: "SN 总数BY Config",
					},
					{
						name: "panel location(N01&N02)",
					},
					{
						name: "LINENAME(NCC)",
					},
				],
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
			selectPageVal: "",
			hoursTip: "",
			textTip: "祝你开心每一天！",
			textList: [
				"不能改变世界，那你试过改变自己吗?",
				"祝你开心每一天！",
				"云破日出，你是那道光束。",
				"未来还长，梦想还远，余生的路，不在敷衍。",
				"活出生命辽阔，拥有选择的权利。",
				"此刻想举重若轻，之前必要负重前行。",
				"这一生，你唯一要完成的KPI，就是做自己。",
				"不管有多少沮丧，别对自己失望好吗，好春光不必趁早，那些辜负你的总会奔赴而来。",
				"人生的可能，就是选择相信。",
				"在江湖上想要被看见，要学会亮剑，我已经出招，你呢?",
				"逆风的方向，更适合飞翔。",
				"总有一天，光会为你而来。",
				"青春是不计后果的勇敢，成长是看清真相后的坚持。",
				"未来还长，梦想还远，余生的路不再敷衍。",
				"生活是自己的，创造自己的答案，我要我觉得，不要你觉得。",
				"下一个夏天，要再勇敢一点。",
				"你只要放下烦恼，且听风吟就好。",
				"人生苦短要勇敢，翻一座山，追一个梦，爱一个人。",
				"那个你想到达的地方，念念不忘，必有回响。",
				"不管今年多少岁，只要你觉得每一天都值得，就是不负好年华。",
				"苦心人，天不负，卧薪尝胆，三千越甲可吞吴。",
				"仲夏，尝完这口甜，就去跟世界和解。",
				"有韧性，更任性。",
				"那些不期而会的遇到，才是无招胜有招。",
				"生活很苦，偶尔要学会加一点甜。",
				"生活从来不平等，你有多努力，才能有多特殊。",
				"等云开雾散的那天，去见你想见的那个人吧。跑着去~",
				"交出一部分自己的青春，来换谁也偷不走的阅历。",
				"和生活单挑时，每刺出致胜一剑，你就有资格为自己加冕。",
				"努力的意义，就是给爸妈花钱的时候可以毫不犹豫。",
				"你未必光芒万丈，但你的一点温暖，却能照亮远方。",
				"若想胜券在握，就得关关难过，关关过。",
				"你若要纵情撒野，今生我把酒奉陪。",
			],
		};
	},
	mounted() {
		this.$Message.destroy();
		this.changeTips();
		this.changeText();
		this.pageLoad();
		this.getDataItemData();
		this.$nextTick(() => {
			this.isShow = true;
		});
	},
	methods: {
		pageLoad() {
			this.lineChartTitle = "访问记录";
			this.getNum();
			this.getTopFive();
			this.getTopChartRecord("");
			this.getModelRecord();
		},
		//获取汇总数量
		getNum() {
			const obj = {
				dateType: this.req.dateType,
				reportType: this.req.type,
			};
			getreportbirecordReq(obj).then((res) => {
				if (res.code == 200) {
					const { workbookCount, clickCount, addCount } = res.result;
					this.data = { ...this.data, workbookCount, clickCount, addCount };
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
			gettopchartrecordReq(obj).then((res) => {
				if (res.code === 200) {
					const data = res?.result || [];
					this.data.lineRecordData = data;
					this.$nextTick(() => {
						this.$refs.lineRecordChartRef.initChart();
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
						this.$refs.pieModelRef.initChart();
					});
				}
			});
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
		// 判断当前时间
		changeTips() {
			let date = new Date();
			if (date.getHours() >= 0 && date.getHours() < 12) {
				this.hoursTip = "早安";
			} else if (date.getHours() >= 12 && date.getHours() < 18) {
				this.hoursTip = "午安";
			} else {
				this.hoursTip = "晚上好";
			}
		},
		changeText() {
			let randomTextIndex = Math.round(Math.random() * this.textList.length);
			this.textTip = this.textList[randomTextIndex];
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
	display: flex;
	.title {
		height: 50px;
		line-height: 50px;
		padding: 0 20px;
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}
	.content-left {
		width: 70%;
		height: 100%;
		margin: 0 10px;
		position: relative;
		.home-header {
			height: 200px;
			width: 100%;
			margin-bottom: 10px;
			display: flex;
			position: relative;
			justify-content: space-between;
			align-items: flex-end;
			.header-box {
				width: calc(100% / 4 - 20px);
				height: 70%;
				background: #fff;
				position: relative;
				margin: 10px 0;
				.title {
					color: #778290;
					position: absolute;
					top: 70%;
					left: 50%;
					font-size: 15px;
					transform: translate(-50%, -70%);
					z-index: 1;
				}
				.num {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					font-size: 38px;
					font-weight: bold;
				}
				.avatar-custom {
					width: 100px;
					height: 100px;
					display: inline-block;
					margin-right: 10px;
					position: absolute;
					top: -50px;
					:deep(.ivu-avatar-small) {
						margin: 14px;
						width: calc(100% - 28px);
						height: calc(100% - 28px);
						border-radius: 50%;
						box-shadow: 10px 10px 10px #ccc, -10px -10px -10px #ccc;
						box-shadow: 7px 0px 18px #53f2816e, -7px -7px 16px #6cdceb;
						background: #faf6f7;
					}
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
	.content-right {
		height: 100%;
		width: calc(30% - 40px);
		background: #fff;
		margin: 0 10px;
		.content-top,
		.content-bottom {
			height: 50%;
			margin-bottom: 20px;
			.content {
				height: calc(100% - 70px);

				.box {
					padding: 0 20px;
					font-size: 16px;
					margin: 20px 0;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					/*	box-shadow: 3px 4px 10px #cec9c936;*/
					position: relative;
					&:before {
						/*	box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.16);*/
						position: absolute;
						top: 0;
						bottom: 0;
						left: -2px;
						z-index: 2;
						width: 30px;
						transition: box-shadow 0.3s;
						content: "";
						pointer-events: none;
					}
					span {
						padding: 0 10px;
						display: inline-block;
						/*排序*/
						&.order {
							font-weight: bold;
							font-style: italic;
							color: #fff;
							/*	height: 30px;*/
							background: #406196;
							transform: perspective(10px) rotateX(-5deg);
							border: 1px solid #4c6a9d;
							display: inline-block;
							padding: 7px;
						}
						&.model-type,
						&.model-name {
							width: 200px;
							text-align: center;
						}
						&.num {
							color: #30cbc0;
							font-weight: bold;
							cursor: pointer;
							font-size: 18px;
						}
					}
					&:nth-child(1) {
						span.order {
							background: #c45550;
							border: 1px solid #a95b61;
						}
					}
					&:nth-child(2) {
						span.order {
							background: #c48c63;
							border: 1px solid #e6a355;
						}
					}
					&:nth-child(3) {
						span.order {
							background: #166fd5;
							border: 1px solid #26649e;
						}
					}
					&:hover {
						background: #cccccc17;
						font-weight: bold;
						cursor: pointer;
					}
				}
			}
		}
		.content-bottom {
			height: calc(50% - 20px);
			margin-bottom: 0;
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
