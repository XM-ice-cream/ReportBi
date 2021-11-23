/* 导入 */
<template>
  <div>
    <!-- 左侧抽屉 -->
    <Drawer
      v-model="drawerFlag"
      :title="drawerTitle"
      width="650"
      :mask-closable="false"
      @on-close="cancelClick"
    >
      <div class="import_con">
        <div class="upload-custom upload-con">
          <Upload
            :show-upload-list="false"
            :format="uploadFormat"
            :max-size="maxSize"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :multiple="multiple"
            action=""
            type="select"
            style="display: inline-block;"
          >
            <Button type="success">{{ $t("clickUpload") }}</Button>
          </Upload>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "import-formData",
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
  },
  data() {
    return {
      drawerTitle: this.$t("import"),
      drawerFlag: false,
    };
  },
  mounted() {},
  methods: {
    //返回是否 是上传的文件类型
    isAssetTypeAnImage(ext) {
      return this.uploadFormat.includes(ext.toLowerCase());
    },
    /**
     * 上传之前触发
     */
    handleBeforeUpload(file) {
      //获取后缀
      let ext = file.name
        .split(".")
        .pop()
        .toLowerCase();
      if (this.isAssetTypeAnImage(ext)) {
        this.$emit("fileUpload", file);
      } else {
        this.$Msg.warning(
          `${file.name}。${this.$t("uploadFormError")}.${this.uploadFormat.join(",.")}`
        );
      }
      return false;
    },
    /**
     * 上传超出限制触发
     */
    handleMaxSize(file) {
      this.$Spin.hide();
      this.$Msg.warning(`${file.name}。${this.$t("uploadMaxSize")}${this.maxSize / 1024}M`);
    },
    // 左侧抽屉取消
    cancelClick() {
      this.drawerFlag = false;
    },
  },
};
</script>
<style scoped lang="less">
.upload-custom {
  display: inline-block;
  margin-left: 10px;
}
</style>
