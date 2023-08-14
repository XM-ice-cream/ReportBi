/* BI 预览 */
<template>
	<div class="page-style preview-bi">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Form ref="searchReq" :model="req" inline :label-width="80" @submit.native.prevent @keyup.native.enter="searchClick">
						<!-- 机种 -->
						<FormItem label="机种" prop="model">
							<Select
								v-model="req.model"
								clearable
								:placeholder="$t('pleaseSelect') + '机种'"
								transfer
								filterable
								cleabler
								@on-change="searchClick"
								style="width: 200px"
							>
								<Option v-for="(item, i) in modelList" :value="item.title" :label="item.title" :key="i"></Option>
							</Select>
						</FormItem>
					</Form>
				</div>
				<!-- 预览Card -->
				<div class="previewBiCard">
					<template v-for="item in roleBtn">
						<div class="cardCell" title="点击查看" @click="turnToWorkBookManage(item.href, item.sortCode)">
							<!-- <img src="../../assets/images/bg2.jpg" class="img" /> -->
							<span class="title">
								<span class="name" :title="item.title">
									<Icon type="ios-apps" v-if="item.name == 'commonTemplate'" />
									<Icon type="ios-stats" v-else />
									{{ item.title }}
									<Icon type="md-arrow-forward" class="icon-forward" />
								</span>
								<span class="sub-name">
									{{ item.remark }}
								</span>
							</span>
						</div>
					</template>
				</div>
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
	name: "preview-bi",
	data() {
		return {
			selectObj: null, //表格选中
			formatDate: formatDate,
			roleBtn: [], //该角色下的报表权限卡片
			roleBtnCopy: [],
			pageConfig: { ...this.$config.pageConfig },
			authorityBtn: {},
			req: { model: "" }, //查询数据
			modelList: [],
		};
	},
	mounted() {
		this.getRoleBtn();
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		//查询
		searchClick() {
			this.roleBtn = this.req.model ? this.roleBtnCopy.filter((item) => item.title === this.req.model) : this.roleBtnCopy;
			console.log(this.roleBtn, this.roleBtnCopy);
		},
		// 跳转到工作簿管理
		turnToWorkBookManage(href, index) {
			const obj = { nodeId: href, authorityBtn: this.authorityBtn[index] };
			window.localStorage.setItem("previewBiPermission", JSON.stringify(obj));
			this.$router.push({
				name: "workbook-manage",
			});
		},

		//获取角色按钮
		getRoleBtn() {
			//按钮权限
			this.authorityBtn = {};
			//卡片权限
			this.roleBtn = [];
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
					console.log(data);
					data.forEach((item, index) => {
						const { name, remark } = item;
						const intRemark = parseInt(remark);
						if (name.indexOf("Template") > -1) this.roleBtn.push({ ...item });
						else {
							if (!this.authorityBtn[intRemark]) this.authorityBtn[intRemark] = [];
							this.authorityBtn[intRemark].push({ ...item });
						}
					});
					this.roleBtn.unshift({
						name: "commonTemplate",
						title: "公共模型",
						href: "commonTemplate",
						remark: "公共模型,所有人都可查看",
						sortCode: 0,
					});
					this.modelList = this.roleBtn;
					this.roleBtnCopy = this.roleBtn;
				}
			});
		},
	},
};
</script>
<style>
.preview-bi .comment .ivu-card-body {
	background: #f5f7f9;
}
.preview-bi .ivu-form-item {
	margin-bottom: 0;
}
</style>
<style scoped lang="less">
.previewBiCard {
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
		margin-top: 15px;
		margin-left: 15px;
		padding: 10px 15px;
		position: relative;
		background: #fff;
		border-radius: 0;
		cursor: pointer;
		transition: all 0.2s ease-out;
		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 6px 16px 2px rgba(7 12 20 8%) !important;
			.title .name {
				color: #27ce88;
				.icon-forward {
					color: #27ce88;
					animation: promotionV5G023Arrow 0.9s linear infinite;
				}
			}
		}
		.img {
			width: 100%;
			height: 240px;
			border-radius: 10px 10px 0 0;
		}
		.title {
			width: 100%;
			display: inline-block;
			padding: 10px;
			.name {
				width: 100%;
				/* font-weight: 600; */
				display: block;
				text-overflow: ellipsis;
				padding: 5px 0;
				font-size: 20px;
				color: #222222;
				position: relative;
				height: 50px;
				i {
					font-size: 24px;
					color: #27ce88;
				}
				.icon-forward {
					position: absolute;
					right: 0px;
					color: #222222;
				}
			}
			.sub-name {
				width: 100%;
				display: block;
				text-overflow: ellipsis;
				font-size: 0.14rem;
				padding: 10px 0;
			}
		}
	}
}
@keyframes promotionV5G023Arrow {
	0% {
		right: 0;
	}

	33% {
		right: 6px;
	}

	67% {
		right: 6px;
	}

	100% {
		right: 0px;
	}
}

// 适配
@media (min-width: 1280px) {
	.previewBiCard .cardCell {
		width: 31.6%;
	}
}
@media (min-width: 1536px) {
	.previewBiCard .cardCell {
		width: 23.7%;
	}
}
@media (min-width: 1745.45px) {
	.previewBiCard .cardCell {
		width: 23.8%;
	}
}
@media (min-width: 1920px) {
	.previewBiCard .cardCell {
		width: 24%;
	}
}
</style>
