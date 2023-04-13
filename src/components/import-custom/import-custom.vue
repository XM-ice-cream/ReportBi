/* 导入 */
<template>
	<div>
		<!-- 左侧抽屉 -->
		<Drawer v-model="drawerFlag" :title="title" width="650" :mask-closable="false" @on-close="cancelClick">
			<div class="import_con">
				<UploadCustom
					class="upload-con"
					uploadIcon="ios-cloud-upload-outline"
					:uploadUrl="uploadUrl"
					:uploadHeight="33"
					:maxSize="10240"
					:uploadFormat="['xlsx']"
					@upload-success="uploadSuccess"
				>
					<div slot="button">
						<Button type="success">{{ $t("clickUpload") }}</Button>
					</div>
				</UploadCustom>

				<div class="download">
					{{ $t("pleaseSpecifyTheExcelFormatInTheSpecifiedFormat") }}
					<span @click="download()">
						{{ $t("downloadTemplate") }}
					</span>
				</div>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { errorType, exportFile } from "@/libs/tools";
import UploadCustom from "@/components/upload-custom";
export default {
	name: "import-custom",
	components: { UploadCustom },
	props: {
		drawerTitle: {
			type: String,
		},
		downloadReq: {
			type: Function,
		},
		uploadUrl: {
			type: String,
		},
		templateName: {
			type: String,
		},
		//文件id
		fileId: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			title: this.$t("import"),
			drawerFlag: false,
		};
	},
	watch: {
		drawerFlag(newValue) {
			if (newValue) {
				if (this.drawerTitle) {
					this.title = this.drawerTitle;
				}
			}
		},
	},
	mounted() {},
	methods: {
		//下载模板
		download() {
			if (this.fileId) {
				this.$publicApi.downloadReq({ fileId: this.fileId }, this.templateName, ".xlsx");
			} else {
				this.downloadReq().then((res) => {
					let blob = new Blob([res], {
						type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					});
					const fileName = this.templateName + ".xlsx"; // 自定义文件名
					exportFile(blob, fileName);
				});
			}
		},
		// 导入成功触发
		uploadSuccess(data) {
			let { response } = data;
			if (response.code === 200) {
				this.$Msg.success(`${this.$t("import")}${this.$t("success")}`);
				this.cancelClick();
				this.$emit("pageLoad");
			} else {
				let content = `${errorType(this, response)}<br> ${response.message}`;
				this.$Modal.error({
					title: this.$t("import") + this.$t("fail"),
					content: content,
				});
			}
		},
		// 左侧抽屉取消
		cancelClick() {
			this.drawerFlag = false;
		},
	},
};
</script>
