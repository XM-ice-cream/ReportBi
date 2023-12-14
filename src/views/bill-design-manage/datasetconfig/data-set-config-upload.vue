/* 上传数据集数据信息 */
<template>
	<Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="true" v-model="modalFlag" :before-close="closeDialog">
		<Card :bordered="false" dis-hover class="card-style data-set-config-upload">
			<div class="upload">
				<Upload
					:show-upload-list="false"
					:format="uploadFormat"
					:max-size="maxSize"
					:on-exceeded-size="handleMaxSize"
					:before-upload="handleBeforeUpload"
					:multiple="false"
					:on-success="handleSuccess"
					:on-error="handleError"
					:action="uploadUrl"
					:data="{ type: 'hdfs' }"
					type="select"
					style="display: inline-block"
				>
					<Button type="primary" style="margin-right: 10px; padding: 0 40px; height: 30px" :loading="file">
						{{ $t("clickUpload") }}
					</Button>
				</Upload>
				<div v-if="isShowTips">
					<Alert :type="req.isSuccess ? 'success' : 'error'" show-icon>{{ req.isSuccess ? "导入成功" : "导入失败" }}</Alert>
					<Alert><b>文件名称: </b> {{ req.fileName }}</Alert>
					<Alert><b>文件大小: </b> {{ req.fileSize }}</Alert>
					<Alert><b>导入耗时: </b> {{ req.uploadTime }}</Alert>
					<Alert style="color: #000; font-weight: bold"
						><b>{{ req.isSuccess ? "数据表名" : "错误信息" }}: </b> {{ req.tableName }}
						<Icon type="md-copy" title="一键复制" @click="handleCopy" style="font-size: 16px"
					/></Alert>
				</div>
			</div>
		</Card>
	</Modal>
</template>

<script>
import { uploadUrl } from "@/api/bill-design-manage/data-set-config.js";
import { copyToClip } from "@/libs/tools";
export default {
	components: {},
	name: "data-set-config-upload",
	props: {
		modalFlag: {
			required: true,
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			uploadUrl: uploadUrl(),
			dialogFormVisibleTitle: "导入外部数据源",
			file: null,
			uploadFormat: ["xlsx"],
			maxSize: 2048,
			isShowTips: false, //是否显示上传文件的基础信息
			req: {
				isSuccess: true, //是否上传成功
				fileName: "", //文件名称
				fileSize: 0, //文件大小
				uploadTime: 0, //导入耗时
				tableName: "", //数据表名
			},
		};
	},
	activated() {},
	// 导航离开该组件的对应路由时调用
	beforeRouteLeave(to, from, next) {
		this.searchPoptipModal = false;
		next();
	},
	methods: {
		handleSuccess(response, file, fileList) {
			console.log(1, response, file, fileList);

			const size = file.size / (1024 * 1024); // 上传文件的大小，单位为字节 转换为找字节
			const name = file.name; // 上传文件的名称
			const time = response.elapsedMilliseconds / 1000; // 服务器返回的上传耗时
			this.req.uploadTime = time;
			this.req = { ...this.req, fileSize: `${size}M`, fileName: name, uploadTime: `${time}s` };
			if (response.code === 200) {
				this.req.tableName = response.result;
				this.req.isSuccess = true;
			} else {
				this.req.isSuccess = false;
				this.req.tableName = response.message;
			}
			this.isShowTips = true;
			this.file = null;
		},
		//上传之前触发
		handleBeforeUpload(file) {
			this.isShowTips = false;
			this.file = file;
			//获取后缀
			let ext = file.name.split(".").pop().toLowerCase();

			if (!this.isAssetTypeAnImage(ext)) {
				this.$Msg.warning(`${file.name}。${this.$t("uploadFormError")}.${this.uploadFormat.join(",.")}`);
				return false;
			}
		},
		// 上传失败
		handleError(error, file, fileList) {
			console.log("上传失败", error, file, fileList);
		},
		//复制
		handleCopy() {
			copyToClip(this.req.tableName, () => {
				return this.$Msg.success(`${this.$t("copy")}${this.$t("successTips")}`);
			});
		},
		//返回是否 是上传的文件类型
		isAssetTypeAnImage(ext) {
			return this.uploadFormat.includes(ext.toLowerCase());
		},
		//上传超出限制触发
		handleMaxSize(file) {
			this.$Msg.warning(`${file.name}. ${this.$t("uploadMaxSize")}${this.maxSize / 1024}M`);
		},
		// 关闭模态框
		closeDialog() {
			this.req = {};
			this.file = null;
			this.isShowTips = false;
			this.$emit("update:modalFlag", false);
		},
	},
	mounted() {},
};
</script>
<style scoped lang="less">
.data-set-config-upload {
	.tips {
		font-size: 14px;
		font-weight: bold;
		padding: 0 10px;
	}
	.upload {
	}
	:deep(.ivu-upload) {
		text-align: center;
		margin-bottom: 10px;
		width: 100%;
	}
	:deep(.ivu-icon) {
		line-height: 1.5;
	}
}
</style>
