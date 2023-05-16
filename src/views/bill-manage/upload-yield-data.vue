/* 上传良率数据 */
<template>
	<div class="page-style">
		<!-- 页面表格 -->
		<div class="comment upload-yield-data">
			<Card :bordered="false" dis-hover class="card-style">
				<Alert type="warning" style="text-align: center" show-icon>上传数据后<span class="tips">请等待1分钟后再查询数据</span>请知悉~</Alert>
				<div class="upload">
					<Upload
						:show-upload-list="false"
						:format="uploadFormat"
						:max-size="maxSize"
						:on-exceeded-size="handleMaxSize"
						:before-upload="handleBeforeUpload"
						:multiple="false"
						action=""
						type="select"
						style="display: inline-block"
					>
						<Button type="primary" style="margin-right: 10px; padding: 0 40px; height: 30px">
							{{ this.file ? $t("fileUpload") + $t("finish") : $t("clickUpload") }}
						</Button>
					</Upload>
					<span class="download">
						{{ $t("pleaseSpecifyTheExcelFormatInTheSpecifiedFormat") }}
						<span @click="downloadTemplate()" style="font-size: 20px">
							{{ $t("downloadTemplate") }}
						</span>
					</span>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
import { downloadReq, importReq } from "@/api/bill-manage/upload-yield-data";
import { exportFile, errorType } from "@/libs/tools";

export default {
	components: {},
	name: "upload-yield-data",
	data() {
		return {
			searchPoptipModal: false,
			btnData: [],
			noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
			data: [], // 表格数据
			file: null,
			uploadFormat: ["xlsx"],
			maxSize: 2048,
			drawerTitle: "上传文件",
		};
	},
	activated() {},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		//下载模板
		downloadTemplate() {
			downloadReq({}).then((res) => {
				let blob = new Blob([res], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});
				const fileName = this.$t("upload-yield-data") + ".xlsx"; // 自定义文件名
				exportFile(blob, fileName);
			});
		},
		//导入数据
		importData() {
			let formData = new FormData();
			formData.append("file", this.file);
			importReq(formData).then((res) => {
				if (res.code === 200) {
					this.$Message.success(this.drawerTitle + this.$t("success"));
				} else {
					this.$Modal.error({
						title: this.drawerTitle + this.$t("fail"),
						content: `${res.message}`,
					});
				}
			});
		},
		//上传之前触发
		handleBeforeUpload(file) {
			this.file = file;
			//获取后缀
			let ext = file.name.split(".").pop().toLowerCase();
			if (!this.isAssetTypeAnImage(ext)) {
				this.$Msg.warning(`${file.name}。${this.$t("uploadFormError")}.${this.uploadFormat.join(",.")}`);
			} else {
				this.importData();
			}
			//终止上传改为自定义
			return false;
		},
		//返回是否 是上传的文件类型
		isAssetTypeAnImage(ext) {
			return this.uploadFormat.includes(ext.toLowerCase());
		},
		//上传超出限制触发
		handleMaxSize(file) {
			this.$Msg.warning(`${file.name}. ${this.$t("uploadMaxSize")}${this.maxSize / 1024}M`);
		},
	},
	mounted() {},
};
</script>
<style scoped lang="less">
.upload-yield-data {
	.tips {
		font-size: 14px;
		font-weight: bold;
		padding: 0 10px;
	}
	.upload {
		display: flex;
		align-items: center;
		height: 100%;
		justify-content: center;
	}
}
</style>
