<template>
  <video :style="styleColor" :src="styleColor.videoAdress" controls="controls">
    您的浏览器不支持 video 标签。
  </video>
</template>

<script>
import { objToOne } from '@/libs/tools.js'
export default {
  name: "WidgetVideo",
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
        videoAdress: this.transStyle.videoAdress
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
.container {
  width: 100%;
  height: 100%;
}
video {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
