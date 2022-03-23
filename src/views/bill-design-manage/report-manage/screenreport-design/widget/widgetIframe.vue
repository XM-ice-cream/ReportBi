<template>
  <iframe :style="styleColor" :src="styleColor.iframeAdress" width="100%" height="100%" />
</template>

<script>
import { objToOne } from '@/libs/tools.js'

export default {
  name: "WidgetIframe",
  components: {},
  props: {
    value: Object,
    ispreview: Boolean
  },
  data () {
    return {
      options: {}
    };
  },
  computed: {
    transStyle () {
      return objToOne(this.options);
    },
    styleColor () {
      return {
        position: this.ispreview ? "absolute" : "static",
        width: this.transStyle.width + "px",
        height: this.transStyle.height + "px",
        left: this.transStyle.left + "px",
        top: this.transStyle.top + "px",
        right: this.transStyle.right + "px",
        iframeAdress: this.transStyle.iframeAdress
      };
    }
  },
  watch: {
    value: {
      handler (val) {
        this.options = val;
      },
      deep: true
    }
  },
  mounted () {
    this.options = this.value;
  },
  methods: {}
};
</script>

<style scoped lang="less">
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
