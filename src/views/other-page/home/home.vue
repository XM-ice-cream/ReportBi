<template>
	<div class="page-style overflowY home-style">
		<div class="home-header">
			<div class="header-left">
				<avatar-custom :imgUrl="headIcon" v-if="headIcon"></avatar-custom>
				<img class="head-portrait" src="../../../assets/images/default-head.png" v-else />
				<div class="user-info">
					<div class="user-content">
						<p>
							<span>工号</span><span>{{ account }}</span>
						</p>
						<p>
							<span>姓名</span><span>{{ userName }}</span>
						</p>
						<p>
							<span>电话号码</span><span>{{ phone }}</span>
						</p>
						<p>
							<span>邮箱</span><span>{{ email }}</span>
						</p>
					</div>
					<p class="tip">
						{{ textTip }}
					</p>
				</div>
			</div>
			<div class="header-right">
				<div class="header-box">
					<div class="title">模板数量</div>
					<div class="num">50</div>
				</div>
				<div class="header-box">
					<div class="title">访问次数</div>
					<div class="num">10</div>
				</div>
				<div class="header-box">
					<div class="title">新增数</div>
					<div class="num">10</div>
				</div>
			</div>
		</div>
		<div class="home-content">
			<div class="content-left">
				<RadioGroup v-model="req.dateType" type="button" button-style="solid" size="default" class="content-radio">
					<Radio label="year">年</Radio>
					<Radio label="month">月</Radio>
					<Radio label="day">日</Radio>
				</RadioGroup>
				<!-- 收藏表单 -->
				<Tabs type="card" :draggable="true">
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
					<div class="title">访问记录</div>
					<LineRecord index="0" v-if="isShow" style="height: calc(100% - 70px)" />
				</div>
			</div>
			<!-- top5 -->
			<div class="content-right">
				<div class="content-top">
					<div class="title">访问次数Top5</div>
					<div class="content">
						<div class="box" v-for="item in data.top5Data">
							<span class="order">NO.{{ item.sort }}</span>
							<span class="model-type">{{ item.type }}</span>
							<span class="model-name">{{ item.name }}</span>
							<span class="num">{{ item.num }}</span>
						</div>
					</div>
				</div>
				<div class="content-bottom">
					<div class="title">模型占比</div>
					<div class="content">
						<PieModel index="0" v-if="isShow" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getindexjsonReq } from "@/api/organize-manager/user-manager";
import { getpagelistReq } from "@/api/system-manager/developer-center";
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
			navIndex: null,
			qr: {
				text: "功能开发中......",
			},
			bar: {
				barValue: "~VSUFCR.",
				barList: [
					{
						name: "设置为回车结尾",
						text: "~VSUFCR.",
					},
					{
						name: "设置为table结尾",
						text: "~SUFBK29909.",
					},
					{
						name: "删除末尾",
						text: "~SUFCA2.",
					},
				],
			},
			carrierObj: {
				carrierCode: "",
				carrierValue: "",
				carrierCount: 0,
				codeColor: "",
			},
			infoObj: {
				systemName: "",
				systemVersion: "",
				userTotal: 0,
				userLine: 0,
				userActive: 0,
				pVDay: 0,
				pVYear: 0,
				apiDay: 0,
				apiYear: 0,
			},
			navList: [
				{
					iconName: "iconfont icon-bar_code",
					iconColor: "#4ab91c",
					navName: this.$t("barCodeSetting"),
					id: "barCodeSetting",
				},
				{ iconName: "iconfont icon-qr_code", iconColor: "#FF3333", navName: this.$t("qrCode"), id: "qrCode" },
				{ iconName: "iconfont icon-check", iconColor: "#CCFF99", navName: this.$t("carrierCheck"), id: "carrierCheck" },
				{
					iconName: "iconfont icon-barchart",
					iconColor: "#6699FF",
					navName: this.$t("publicReport"),
					id: "publicReport",
				},
				// {iconName: "iconfont icon-mobile", iconColor: "#66CC33", navName: "白泽TV",id:'tv'},
				{ iconName: "iconfont icon-paper", iconColor: "#66CCFF", navName: "流程控制台", id: "flowConsole" },
				// {
				//   iconName: "iconfont icon-paper",
				//   iconColor: "#66FF66",
				//   navName: this.$t("chatAuthorization"),
				//   id:chatAuthorization
				// },
				{ iconName: "iconfont icon-buliang", iconColor: "#996699", navName: "错误代码", id: "errorCode" },
			],
			req: {
				type: "BI",
				dateType: "year",
			},
			data: {
				top5Data: [
					{
						sort: 1,
						type: "公共模型",
						name: "SN 总数BY Config",
						num: 50,
					},
					{
						sort: 2,
						type: "公共模型",
						name: "SN 总数BY Config",
						num: 50,
					},
					{
						sort: 3,
						type: "公共模型",
						name: "SN 总数BY Config",
						num: 50,
					},
					{
						sort: 4,
						type: "公共模型",
						name: "SN 总数BY Config",
						num: 50,
					},
					{
						sort: 5,
						type: "公共模型",
						name: "SN 总数BY Config",
						num: 50,
					},
				],
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
			},
			versionList: [],
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
		this.getIndexJson();
		this.getVersionData();
		this.changeTips();
		this.changeText();
		this.$nextTick(() => {
			this.isShow = true;
		});
	},
	methods: {
		// 获取首页数据
		getIndexJson() {
			getindexjsonReq().then((res) => {
				if (res.code === 200) {
					this.infoObj.systemName = res.result.systemName;
					this.infoObj.systemVersion = res.result.systemCoreVersion;
					this.infoObj.userTotal = res.result.userTotalCount;
					this.infoObj.userActive = res.result.userActiveCount;
					this.infoObj.userLine = res.result.userOnLineCount;
					this.infoObj.pVDay = res.result.pvDay;
					this.infoObj.pVYear = res.result.pvYear;
					this.infoObj.apiDay = res.result.apiDay;
					this.infoObj.apiYear = res.result.apiYear;
				}
			});
		},
		// 获取版本数据
		getVersionData() {
			const obj = {
				orderField: "id", // 排序字段
				ascending: false, // 是否升序
				pageSize: 50, // 分页大小
				pageIndex: 1, // 当前页码
				data: { enabled: 1 },
			};
			getpagelistReq(obj).then((res) => {
				if (res.code === 200) {
					this.versionList = res.result.data || [];
					this.versionList.forEach((o) => {
						o.formCreateDate = formatDate(o.createDate) || null;
					});
				}
			});
		},
		// 弹窗取消事件
		modalCancel() {
			this.modalFlag = false;
			this.modalTitle = "";
			this.navIndex = null;
			this.carrierObj.carrierCount = 0;
			this.carrierObj.carrierValue = "";
			this.carrierObj.carrierCode = "";
			this.carrierObj.codeColor = "";
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
		changeVipLevel(val) {
			const state = {
				0: "v0",
				1: "v1",
				2: "v2",
				3: "v3",
				4: "v4",
				5: "v5",
				6: "v6",
			};
			return state[val];
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
}
.home-content .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
	height: 40px;
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
.home-content .ivu-radio-group-button .ivu-radio-wrapper:first-child {
	border-radius: 0px;
}
</style>
<style scoped lang="less">
.home-style {
	background: #f5f7f9;
}
.home-header {
	height: 200px;
	width: 100%;
	margin-bottom: 10px;
	display: flex;
	.header-left {
		flex: 0.3;
		height: 100%;
		margin: 0 10px;
		background: #fff;
		border-radius: 50% 0 0 0;
		position: relative;
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: center;
		align-items: center;
		.avatar-custom {
			width: 200px;
			height: 200px;
			display: inline-block;
			margin-right: 10px;
			:deep(.ivu-avatar-small) {
				margin: 14px;
				width: calc(100% - 28px);
				height: calc(100% - 28px);
				border-radius: 50%;
				box-shadow: 10px 10px 10px #ccc, -10px -10px -10px #ccc;
				box-shadow: 7px 0px 18px #53f2816e, -7px -7px 16px #6cdceb;
			}
		}
		.user-content {
			width: 100%;
			position: absolute;
			top: 50%;
			transform: translate(0, -65%);
		}
		.user-info {
			display: inline-block;
			width: calc(100% - 220px);
			height: calc(100% - 10px);
			margin-left: 10px;
			position: relative;
			p {
				padding-top: 10px;

				span:first-child {
					width: 90px;
					display: inline-block;
					font-size: 14px;
					font-weight: bold;
					/*两端对齐*/
					text-align: justify;
					text-align-last: justify;
					padding-right: 30px;
				}
				span:last-child {
					font-size: 12px;
					font-weight: normal;
					display: inline-block;
					width: calc(100% - 103px);
				}
			}
			.tip {
				position: absolute;
				bottom: 10px;
				color: #baaaaaa3;
				right: 0px;
			}
		}
	}
	.header-right {
		flex: 0.7;
		height: 100%;
		.header-box {
			width: calc(100% / 3 - 20px);
			height: 100%;
			margin: 0 10px;
			background: #fff;
			display: inline-block;
			position: relative;
			overflow: hidden;
			.title {
				color: #778290;
				position: absolute;
				top: 70%;
				left: 55%;
				font-size: 15px;
				transform: translate(-70%, -55%);
			}
			.num {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 38px;
				font-weight: bold;
			}
			&:nth-child(1) {
				.num {
					color: #897eed;
				}
				&:before {
					content: "";
					width: 200px;
					height: 200px;
					background: #f1f2fd;
					position: absolute;
					border-radius: 50%;
					left: -21%;
					top: -41%;
				}
				&:after {
					content: "";
					width: 110px;
					height: 100px;
					background: #f1f2fd;
					position: absolute;
					border-radius: 50%;
					left: 16%;
					top: 82%;
				}
			}
			&:nth-child(2) {
				.num {
					color: #5b9ffe;
				}
				&:before {
					content: "";
					width: 200px;
					height: 200px;
					background: #edf3fd;
					position: absolute;
					border-radius: 50%;
					left: 39%;
					top: -70%;
				}
				&:after {
					content: "";
					width: 150px;
					height: 200px;
					background: #f1f6fd;
					position: absolute;
					border-radius: 50%;
					left: -5%;
					top: 28%;
				}
			}
			&:nth-child(3) {
				.num {
					color: #30cbc0;
				}
				&:before {
					content: "";
					width: 304px;
					height: 200px;
					background: #eafbfd;
					position: absolute;
					border-radius: 50%;
					left: -34%;
					top: -41%;
				}
				&:after {
					content: "";
					width: 150px;
					height: 150px;
					background: #d2f0ed;
					position: absolute;
					border-radius: 50%;
					right: -20%;
					top: 66%;
				}
			}
		}
	}
}
.home-content {
	height: calc(100% - 200px - 10px);
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
		.content-radio {
			position: absolute;
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
				.box {
					width: 200px;
					height: calc(100% - 20px);
					margin: 20px;
					border: 1px solid #efefef;
					position: relative;
					border-radius: 10px;
					.name {
						width: 100%;
						position: absolute;
						text-align: center;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						color: #000;
						font-weight: bold;
					}
					&:hover {
						background: #22936512;
						cursor: pointer;
						border: 1px solid #5dc79c;
						.name {
							font-size: 16px;
						}
					}
				}
			}
		}
		.line-chart {
			height: calc(100% - 200px - 40px - 10px;);
			background: #fff;
		}
	}
	.content-right {
		height: 100%;
		width: 30%;
		background: #fff;
		margin-right: 10px;
		.content-top,
		.content-bottom {
			height: 50%;
			margin-bottom: 20px;
			.content {
				height: calc(100% - 70px);

				.box {
					padding: 0 20px;
					line-height: 25px;
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
							height: 30px;
							background: #3968a261;
							transform: perspective(10px) rotateX(-5deg);
							border: 1px solid #3968a261;
						}
						&.num {
							color: #30cbc0;
							font-weight: bold;
						}
					}
					&:nth-child(1) {
						span.order {
							background: #ff625c;
							border: 1px solid #ff625c;
						}
					}
					&:nth-child(2) {
						span.order {
							background: #fac000;
							border: 1px solid #fac000;
						}
					}
					&:nth-child(3) {
						span.order {
							background: #5b9ffe;
							border: 1px solid #5b9ffe;
						}
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
</style>
