
<template>
  <div style="height:100%">
    <div :style="bigScreenStyle">
      <widget :visib='true' v-for="(widget, index) in widgets" :key="index" v-model="widget.value" :type="widget.type" />
    </div>
  </div>
</template>

<script>
import widget from "./screenreport-design/widget/temp";
import { previewScreenReq } from '@/api/bill-design-manage/report-manage.js'
export default {
  name: "screenreport-preview",
  components: {
    widget
  },
  data () {
    return {
      bigScreenStyle: {},
      widgets: [],
      dialogFormVisibleTitle: '大屏预览',
      req: {
        widgetsWidth: 0,
        widgetsHeight: 0,
        backgroundColor: '',
        backgroundImage: ''
      },

    };
  },
  watch: {
  },
  mounted () {
    this.$nextTick(() => {
      this.getData();
      window.addEventListener('resize', () => {
        this.onRiseze();
      })
    });
  },
  methods: {
    //获取预览数据
    async getData () {
      const reportCode = this.$route.query.reportCode;
      const { code, result } = await previewScreenReq({ reportCode: reportCode });
      if (code != 200) return;
      const { width, height, backgroundColor, backgroundImage, widgets } = result.dashboard;
      this.req = { ...this.req, widgetsWidth: width, widgetsHeight: height, backgroundColor, backgroundImage };
      this.onRiseze();
      this.widgets = widgets;

    },
    //适应布局
    onRiseze () {
      const { widgetsWidth, widgetsHeight, backgroundImage } = this.req;
      const equipment = document.body.clientWidth;
      const clientHeight = document.body.clientHeight
      const ratioEquipment = equipment / widgetsWidth;
      const ratioEquipmentH = clientHeight / widgetsHeight;
      this.bigScreenStyle = {
        width: widgetsWidth + "px",
        height: widgetsHeight + "px",
        "background-color": '#000d18',//大屏基础背景色
        "background-image": "url(" + backgroundImage + ")",
        "background-position": "0% 0%",
        "background-size": "100% 100%",
        "background-repeat": "initial",
        "background-attachment": "initial",
        "background-origin": "initial",
        "background-clip": "initial",
        transform: `scale(${ratioEquipment}, ${ratioEquipmentH})`,
        "transform-origin": "0 0",
        'overflow-y': 'auto',
        'overflow-x': 'hidden'
      };
    }
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
