<template>
  <div>
    <Tabs v-model="stationName" @on-click="tabsClick">
      <TabPane :label="$t('stationIn')" name="stationIn">
        <in-time v-if="stationName === 'stationIn'" :req="req" :model="model" :isShow="isShow" :optList="optList"/>
      </TabPane>
      <TabPane :label="$t('stationOut')" name="stationOut">
        <out-time v-if="stationName === 'stationOut'" :req="req" :model="model" :isShow="isShow" :optList="optList"/>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import inTime from "@/components/flow-custom/attr-set/in-time.vue";
import outTime from "@/components/flow-custom/attr-set/out-time.vue";

export default {
  name: "attr-set-qTime",
  components:{
    inTime,
    outTime,
  },
  props: {
    // 当前节点数据
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    // 配置项
    optList: {
      type: Object,
      default() {
        return {};
      },
    },
    // 当前流程数据
    stationList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否显示提交按钮
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stationName: "stationIn", // 站点设置
      req: {
        processId: "", // 制程id
        enabled: 1, // 1有效 0无效
      },
      actionTypeData: [], // 行为数据
      ruleNameData: [], // 限制类型数据
      qTimeSelectObj: [], // 限制类型数据
      processList: [], //当前流程图制程数据
      stationOutNameList:[
        {
          name:'新增',
          id:0
        }
      ] ,//站外名称列表
      addList:[], //新增列表
      data:[], //站外数据列表
      stationOutName:'', //站外名称,
      toRouteTitle:''
    };
  },
  created() {
    this.req.processId = this.model.labelId;
  },
  watch: {
  },
  methods: {
    // 选项卡切换
    tabsClick(name) {
      this.stationName = name
    },
  },
};
</script>
<style scoped lang="less">
  .station-box {
    border:1px dashed #ccc;
    padding: 17px 18px 9px 8px;
    margin-bottom: 20px;
    position: relative;
  }
  .delete {
    position: absolute;
    right: -13px;
    top: -15px;
    font-size: 26px;
    color: #8e8a89;
    cursor: pointer;
  }
</style>
