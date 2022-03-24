<template>
  <Modal :title="caseResultTitle" :mask-closable="false" :closable="true" v-model="visib" width="70%" :before-close="closeDialog">
    <vue-json-editor v-model="caseResultContent" :show-btns="false" :mode="'code'" lang="zh" class="my-editor" />
    <span slot="footer">
      <Button type="primary" @click="closeDialog">关闭</Button>
    </span>
  </Modal>
</template>
<script>
import vueJsonEditor from "vue-json-editor";
export default {
  name: "data-view",
  components: { vueJsonEditor },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogCaseResult: false,
      caseResultTitle: "",
      caseResultContent: null
    };
  },
  methods: {
    dataViewPreview (caseResultTitle, caseResultContent) {
      this.caseResultTitle = caseResultTitle;
      this.caseResultContent = caseResultContent;
    },

    // 关闭模态框
    closeDialog () {
      this.$emit("update:visib", false);
    },
    // onJsonChange (value) { },
    // onJsonSave (value) { }
  }
};
</script>
