/* 锦溪图片查看 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment">
			<Card :bordered="false" dis-hover class="card-style">
				<div slot="title">
					<Row>
						<i-col span="6" style="display: flex">
							<Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
								<Button @click.stop="searchPoptipModal = !searchPoptipModal">
									<Icon type="ios-funnel" />
								</Button>
								<div class="poptip-style-content" slot="content">
									<Form ref="searchReq" :model="req" :label-width="70" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
										<!-- 小条码 -->
										<FormItem label="SN" prop="SN">
											<Input v-model.trim="req.SN" :placeholder="$t('pleaseEnter') + 'SN'" />
										</FormItem>
									</Form>
									<div class="poptip-style-button">
										<Button @click="resetClick()">{{ $t("reset") }}</Button>
										<Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
									</div>
								</div>
							</Poptip>
						</i-col>
						<!-- <i-col span="18">
              <button-custom :btnData="btnData" @on-export-click="exportClick"></button-custom>
            </i-col> -->
					</Row>
				</div>
				<Table
					:border="tableConfig.border"
					:highlight-row="tableConfig.highlightRow"
					:height="tableConfig.height"
					:loading="tableConfig.loading"
					:columns="columns"
					:data="data"
				>
					<template slot-scope="{ row }" slot="image">
						<Button style="height: 16px" v-if="row.remotePath" type="primary" size="small" @click="previewImage(row.remotePath, row.directoryType)">{{
							$t("preview")
						}}</Button>
						<Button
							style="height: 16px; margin-left: 5px"
							v-if="row.remotePath"
							type="primary"
							size="small"
							@click="downloadImage(row.remotePath, row.directoryType, row.fileName)"
							>{{ $t("download") }}
						</Button>
					</template>
				</Table>
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
		<Modal draggable v-model="visible" :closable="false">
			<!-- <img class="img-style" :src="imgUrl"/> -->
			<p name="result" id="result"></p>
		</Modal>
	</div>
</template>

<script>
import { getpagelistReq, downPictureReq } from "@/api/bill-manage/picture-view";
import { getButtonBoolean, renderDate } from "@/libs/tools";
import { Spin } from "view-design";
// import axios from "axios";
export default {
	name: "picture-view",
	data() {
		return {
			imgUrl: "",
			visible: false,
			searchPoptipModal: false,
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			tableConfig: { ...this.$config.tableConfig }, // table配置
			data: [], // 表格数据
			btnData: [],
			req: {
				SN: "",
				...this.$config.pageConfig,
			}, //查询数据
			columns: [
				{
					type: "index",
					fixed: "left",
					width: 50,
					align: "center",
					indexMethod: (row) => {
						return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
					},
				},
				{ title: "SN", key: "sn", align: "center", width: 180, tooltip: true },
				{ title: "SN类型", key: "snType", align: "center", width: 120, tooltip: true },
				{ title: "穴位", key: "boardNo", align: "center", width: 50, tooltip: true },
				{ title: "厂区", key: "area", align: "center", width: 50, tooltip: true },
				{ title: "区域", key: "location", align: "center", width: 50, tooltip: true },
				{ title: "楼层", key: "floor", align: "center", width: 50, tooltip: true },
				{ title: "线体", key: "lineName", align: "center", width: 80, tooltip: true },
				{ title: "站点", key: "processName", align: "center", width: 120, tooltip: true },
				{ title: "机台", key: "eqpName", align: "center", width: 150, tooltip: true },
				{ title: "图片存储时间", key: "storageTime", align: "center", width: 130, tooltip: true, render: renderDate },
				{ title: "存储路径", key: "remotePath", align: "center", width: 200, tooltip: true },
				{ title: "操作", slot: "image", width: 100, align: "center", width: 125, tooltip: true },
			], // 表格数据
		};
	},
	activated() {
		this.pageLoad();
		this.autoSize();
		window.addEventListener("resize", () => this.autoSize());
		getButtonBoolean(this, this.btnData);
	},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		//预览图片
		previewImage(fileFullName, directoryType) {
			var httpPath = "";
			var source;
			switch (directoryType) {
				case "ICOS":
					httpPath = "http://10.32.36.227:81/";
					source = fileFullName.split("\\ICOS\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "AXI":
					httpPath = "http://10.32.36.227:82/";
					source = fileFullName.split("\\AXI\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "E1SIP":
					httpPath = "http://10.32.36.227:83/";
					source = fileFullName.split("\\E1SIP\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "LA1":
					httpPath = "http://10.32.36.227:84/";
					source = fileFullName.split("\\LA1\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "Audio-SIP":
					httpPath = "http://10.32.36.227:85/";
					source = fileFullName.split("\\Audio-SIP\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "ZS7-2_aoi": //越南
					httpPath = "http://10.171.13.119:85/";
					source = fileFullName.split("\\ZS7-2_aoi\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "ZS7-2_icos": //越南
					httpPath = "http://10.171.13.119:84/";
					source = fileFullName.split("\\ZS7-2_icos\\");
					httpPath += source[1].replace("\\", "/");
					break;
				default:
					break;
			}
			window.open(httpPath, "_blank");
		},
		downloadImage(fileFullName, directoryType, fileName) {
			var httpPath = "";
			var source;
			switch (directoryType) {
				case "ICOS":
					httpPath = "http://10.32.36.227:81/";
					source = fileFullName.split("\\ICOS\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "AXI":
					httpPath = "http://10.32.36.227:82/";
					source = fileFullName.split("\\AXI\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "E1SIP":
					httpPath = "http://10.32.36.227:83/";
					source = fileFullName.split("\\E1SIP\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "LA1":
					httpPath = "http://10.32.36.227:84/";
					source = fileFullName.split("\\LA1\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "Audio-SIP":
					httpPath = "http://10.32.36.227:85/";
					source = fileFullName.split("\\Audio-SIP\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "ZS7-2_aoi": //越南
					httpPath = "http://10.171.13.119:85/";
					source = fileFullName.split("\\ZS7-2_aoi\\");
					httpPath += source[1].replace("\\", "/");
					break;
				case "ZS7-2_icos": //越南
					httpPath = "http://10.171.13.119:84/";
					source = fileFullName.split("\\ZS7-2_icos\\");
					httpPath += source[1].replace("\\", "/");
					break;
				default:
					break;
			}
			let obj = {
				path: httpPath,
			};
			Spin.show();
			downPictureReq(obj)
				.then((res) => {
					let blob = new Blob([res]);
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement("a");
					a.href = url;
					a.download = fileName;
					a.click();
					Spin.hide();
				})
				.catch(() => {
					Spin.hide();
				});
			//直接下载报跨域问题
			// Spin.show();
			// axios
			//   .post(httpPath, { responseType: "blob" })
			//   .then((res) => {
			//     let url = window.URL.createObjectURL(res.request.response);
			//     let a = document.createElement("a");
			//     a.href = url;
			//     a.download = fileName;
			//     a.click();
			//     Spin.hide();
			//   })
			//   .catch(() => {
			//     Spin.hide();
			//   });
		},
		// 点击搜索按钮触发
		searchClick() {
			this.req.pageIndex = 1;
			this.pageLoad();
			this.searchPoptipModal = false;
		},
		// 获取分页列表数据
		pageLoad() {
			this.tableConfig.loading = false;
			let { SN } = this.req;
			if (SN) {
				this.tableConfig.loading = true;
				let obj = {
					orderField: "sntype,storageTime", // 排序字段
					ascending: true, // 是否升序
					pageSize: this.req.pageSize, // 分页大小
					pageIndex: this.req.pageIndex, // 当前页码
					data: { SN },
				};
				getpagelistReq(obj)
					.then((res) => {
						this.tableConfig.loading = false;
						if (res.code === 200) {
							let { data, pageSize, pageIndex, total, totalPage } = res.result;
							this.data = data || [];
							this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
						}
					})
					.catch(() => (this.tableConfig.loading = false));
			} else {
				this.$Msg.warning("请输入SN");
			}
		},
		// 点击重置按钮触发
		resetClick() {
			this.$refs.searchReq.resetFields();
			this.searchPoptipModal = false;
			this.$nextTick(() => {
				this.searchPoptipModal = true;
			});
		},
		// 自动改变表格高度
		autoSize() {
			this.tableConfig.height = document.body.clientHeight - 170 - 60;
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
