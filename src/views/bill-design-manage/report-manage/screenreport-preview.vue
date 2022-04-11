
<template>
  <Modal :mask-closable="false" :closable="false" v-model="visib" fullscreen :z-index='900' class="screenpreview">
    <div class="layout">
      <div :style="bigScreenStyle">
        <widget v-for="(widget, index) in widgets" :key="index" v-model="widget.value" :type="widget.type" />
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <Button @click="closeDialog">取消</Button>
    </div>
  </Modal>
</template>

<script>
import widget from "./screenreport-design/widget/temp";
import { previewScreenReq } from '@/api/bill-design-manage/report-manage.js'
export default {
  name: "screenreport-preview",
  components: {
    widget
  },
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false,
    },
    reportCode: {
      required: false,
      type: String,
    },
  },
  data () {
    return {
      bigScreenStyle: {},
      widgets: [],
      dialogFormVisibleTitle: '大屏预览',
    };
  },
  watch: {
    visib () {
      if (this.visib) {
        this.$nextTick(() => {
          this.getData();
        });
      }
    },
  },
  methods: {
    //获取预览数据
    async getData () {
      const reportCode = this.reportCode;
      const { code, result } = await previewScreenReq({ reportCode: reportCode });
      if (code != 200) return;
      const equipment = document.body.clientWidth;
      const clientHeight = document.body.clientHeight - 40
      const ratioEquipment = equipment / result.dashboard.width;
      const ratioEquipmentH = clientHeight / result.dashboard.height;
      console.log(ratioEquipment);
      this.bigScreenStyle = {
        width: result.dashboard.width + "px",
        height: result.dashboard.height + "px",
        "background-color": result.dashboard.backgroundColor,
        "background-image": "url(" + result.dashboard.backgroundImage + ")",
        "background-position": "0% 0%",
        "background-size": "100% 100%",
        "background-repeat": "initial",
        "background-attachment": "initial",
        "background-origin": "initial",
        "background-clip": "initial",
        transform: `scale(${ratioEquipment}, ${ratioEquipmentH})`,
        "transform-origin": "0 0"
      };
      this.widgets = result.dashboard.widgets;
    },
    //关闭弹框
    closeDialog () {
      this.$emit("update:visib", false);
    },
  }
};
</script>
<style>
.screenpreview .ivu-modal-fullscreen .ivu-modal-body {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 0;
  right: 0;
  left: 0px;
  bottom: 2.5rem;
  padding: 0;
  background-color: #f3f3f3;
}
</style>
<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;
  text-align: center;
}
.bottom-text {
  width: 100%;
  color: #a0a0a0;
  position: fixed;
  bottom: 16px;
  z-index: 9999;
}
</style>
