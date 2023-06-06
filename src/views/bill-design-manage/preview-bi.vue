/* BI 预览 */
<template>
	<div class="page-style preview-bi">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<!-- 预览Card -->
				<div class="previewCard">
					<template v-for="item in roleBtn">
						<div class="cardCell" title="点击查看" @click="turnToWorkBookManage(item.href, item.sortCode)">
							<img src="../../assets/images/bg2.jpg" class="img" />
							<span class="title">
								<span class="name" :title="item.title">
									{{ item.title }}
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
			pageConfig: { ...this.$config.pageConfig },
			authorityBtn: {},
			req: {}, //查询数据
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
					console.log("res.result.data;", res.result.data);
					const data = res.result.data;
					data.forEach((item) => {
						const { name, remark } = item;
						if (name.indexOf("Template") > -1) this.roleBtn.push({ ...item });
						else {
							if (!this.authorityBtn[parseInt(remark)]) this.authorityBtn[parseInt(remark)] = [];
							this.authorityBtn[parseInt(remark)].push({ ...item });
						}
					});
					this.roleBtn.unshift({
						name: "commonTemplate",
						title: "公共模型",
						href: "commonTemplate",
						remark: "公共模型,所有人都可查看",
						sortCode: 0,
					});
				}
			});
		},
	},
};
</script>
<style>
.preview-bi .comment .ivu-card-body {
	height: 100%;
	background: #f5f7f9;
}
</style>
<style scoped lang="less">
.previewCard {
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
		width: 32%;
		/* background: #ccc; */
		border: 2px solid #fafcff;
		box-shadow: 3px 5px 7px #d0dbf194;
		padding: 2px;
		margin-top: 15px;
		margin-left: 15px;
		position: relative;
		background: #fff;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease-out;
		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 6px 16px 2px rgba(7 12 20 8%) !important;
			border: 2px solid #009cf1 !important;
		}
		.img {
			width: 100%;
			height: 260px;
			border-radius: 12px 12px 0 0;
		}
		.title {
			width: 100%;
			line-height: 2rem;
			display: inline-block;
			padding: 0.1rem;
			margin: 0.2rem;
			padding-bottom: 0.9rem;
			font-size: 0.92rem;
			color: #3a3b3ae0;
			overflow: hidden;

			white-space: nowrap;

			.name {
				width: 100%;
				font-weight: 600;
				display: block;
				text-overflow: ellipsis;
			}
			.sub-name {
				width: 100%;
				display: block;
				text-overflow: ellipsis;
				font-size: 0.14rem;
			}
		}
	}
}
</style>
