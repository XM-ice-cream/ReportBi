/* 导入 */
<template>
  <div style="display: flex;align-items: center;">
    <Upload
      :show-upload-list="false"
      :format="uploadFormat"
      :max-size="maxSize"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="false"
      action=""
      type="select"
      style="display: inline-block;"
    >
      <Button type="primary" style="margin-right: 10px;">
        {{ this.file ? $t("fileUpload") + $t("finish") : $t("clickUpload") }}
      </Button>
    </Upload>
    <span class="download" v-if="isDownload">
      {{ $t("pleaseSpecifyTheExcelFormatInTheSpecifiedFormat") }}
      <span @click="download()">
        {{ $t("downloadTemplate") }}
      </span>
    </span>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "import-add",
  props: {
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 上传文件最大限制
    maxSize: {
      type: Number,
      default: 2048,
    },
    // 上传文件类型
    uploadFormat: {
      type: Array,
      default: () => ["xlsx"],
    },
    // 是否下载
    isDownload: {
      type: Boolean,
      default: true,
    },
    //文件id
    fileId: {
      type: String,
      default: "",
    },
    //下载模板名称
    templateName: {
      type: String,
      default: () => dayjs().format("YYYY_MM_DD_HH_mm_ss"),
    },
    //后缀
    suffix: {
      type: String,
      default: () => ".xlsx",
    },
  },
  data() {
    return {
      file: null,
    };
  },
  destroyed() {
    this.file = null;
  },
  mounted() {},
  methods: {
    //返回是否 是上传的文件类型
    isAssetTypeAnImage(ext) {
      return this.uploadFormat.includes(ext.toLowerCase());
    },
    //上传之前触发
    handleBeforeUpload(file) {
      this.file = file;
      //获取后缀
      let ext = file.name
        .split(".")
        .pop()
        .toLowerCase();
      if (!this.isAssetTypeAnImage(ext)) {
        this.$Msg.warning(
          `${file.name}。${this.$t("uploadFormError")}.${this.uploadFormat.join(",.")}`
        );
        this.file = null;
      }
      return false;
    },
    //上传超出限制触发
    handleMaxSize(file) {
      this.$Spin.hide();
      this.$Msg.warning(`${file.name}。${this.$t("uploadMaxSize")}${this.maxSize / 1024}M`);
    },
    //下载模板
    download() {
      this.$publicApi.downloadReq({ fileId: this.fileId }, this.templateName, this.suffix);
    },
  },
};
</script>
<style scoped lang="less">
.download {
  font-size: 14px;
  span {
    color: #409eef;
    cursor: pointer;
  }
}
</style>
