<template>
  <div class="header-bar" id="header-bar">
    <sider-trigger :collapsed="collapsed" icon="iconfont icon-menu" :size="24" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon :list="breadCrumbList" :font-size="12"></custom-bread-crumb>
    <notice-board :titleWidth="titleWidth" :content="tipsPublicObj.content" :color="tipsPublicObj.color" v-if="tipsPublicObj.content"></notice-board>
    <div class="custom-content-con" id="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from "./sider-trigger";
import customBreadCrumb from "./custom-bread-crumb";
import NoticeBoard from './notice-board/notice-board.vue';
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";

export default {
  name: "HeaderBar",
  components: { siderTrigger, customBreadCrumb, NoticeBoard },
  props: {
    collapsed: Boolean,
  },
  data () {
    return {
      titleWidth: 0,
    }
  },
  provide () {
    return {
    }
  },
  computed: {
    breadCrumbList () {
      this.$nextTick(()=>{
        this.windowResize();
      },500)
      window.onresize = () => {
        setTimeout(()=>{
          this.windowResize();
        },1000)
      }
      return this.$store.state.breadCrumbList;
    },
    tipsPublicObj () {
      return this.$store.state.tipsPublicObj;
    }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit("on-coll-change", state);
    },
    windowResize () {
      const headerWidth = document.getElementById('header-bar')?.offsetWidth;
      const crumbWidth = document.getElementById('custom-bread-crumb')?.offsetWidth;
      const conWidth = document.getElementById('custom-content-con')?.offsetWidth
      this.titleWidth = headerWidth - (crumbWidth + conWidth) - 60;
    },
    getDataItemDetailList (itemCode) {
      getdataitemlistReq({ itemCode, enabled: 1 }).then((res) => {
        if (res.code === 200) {
          if (res.result) {
            const obj = res.result[res.result.length - 1]
            this.$store.commit('updateTipsPublic', { content: obj?.detailCode, color: obj?.detailName })
          }
        }
      });
    },
  },
  created() {
    this.getDataItemDetailList("SystemTopTips");
  },
  mounted () {
    setTimeout(()=>{
      this.windowResize();
    },1000)
  }

};
</script>

<style scoped lang="less">
@size: 40px;
.header-bar {
  width: 100%;
  height: 100%;
  position: relative;
  .custom-content-con {
    float: right;
    height: auto;
    /*padding-right: 20px;*/
    line-height: @size;
    & > * {
      float: right;
    }
  }
}
</style>
