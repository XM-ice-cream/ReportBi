/* 跳站 */
<template>
  <div>
    <!-- 左侧抽屉 -->
    <Drawer
      v-model="drawerFlag"
      :title="drawerTitle"
      width="520"
      :mask-closable="false"
      @on-close="cancelClick"
    >
      <Form
        ref="submitReq"
        :model="submitData"
        :rules="ruleValidate"
        :label-width="90"
        :label-colon="true"
        @submit.native.prevent
      >
        <!-- 条码类型 -->
        <FormItem :label="$t('barCodingType')" prop="barCodeType">
          <Select
            v-model="submitData.barCodeType"
            clearable
            filterable
            @on-select="autoFocus = 1"
            :placeholder="`${$t('pleaseEnter')}${$t('barCodingType')}`"
          >
            <Option v-for="(item, i) in barCodeTypeData" :value="item.detailCode" :key="i">
              {{ item.detailName }}
            </Option>
          </Select>
        </FormItem>
        <!-- 条码 -->
        <FormItem :label="$t('barCoding')" prop="barCode">
          <Input
            ref="barCodeRefsName"
            v-model.trim="submitData.barCode"
            v-focus="autoFocus === 1"
            @on-focus="autoFocus = null"
            @on-keydown.enter="getJumpStationData"
            :placeholder="`${$t('pleaseEnter')}${$t('barCoding')}`"
          />
        </FormItem>
        <div v-show="isShow">
          <!-- 当前站点 -->
          <FormItem :label="$t('currentSite')">{{ submitData.curProcessName }}</FormItem>
          <FormItem :label="$t('nextSite')">{{ submitData.nextProcessName }}</FormItem>
          <FormItem :label="$t('curFlow')">{{ submitData.routeName }}</FormItem>
          <FormItem :label="$t('workOrder')">{{ submitData.workOrder }}</FormItem>
          <FormItem :label="$t('jumpWhere')">
            <Button type="primary" @click="browseClick">{{ $t("browse") }}</Button>
            {{ submitData.processName }}
          </FormItem>
          <!-- 按钮 -->
          <FormItem>
            <Button style="margin-right: 5px;" @click="cancelClick">{{ $t("cancel") }}</Button>
            <Button type="primary" @click="submitClick">{{ $t("submit") }}</Button>
          </FormItem>
        </div>
      </Form>
      <!-- 提交信息展示 -->
      <tips-custom :tips-list="errData"/>
    </Drawer>
    <FlowCustomPreview
      ref="refFlowCustomPreview"
      refName="jump-station-"
      :options="flowObj"
      :list="flowData"
      :nameList="stationList"
      @node-dblclick="getNodeItem"
    />
  </div>
</template>

<script>
import { getunitinfoReq, skipReq } from "@/api/bill-manage/flow-card";
import { getlistReq } from "@/api/basis-info/wf-route";
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
import FlowCustomPreview from "@/components/flow-custom/flow-custom-preview.vue";
import { getlisttreeReq } from "@/api/basis-info/zone-manage";
import { isAddNode, errorType, inputSelectContent, playSound } from "@/libs/tools";
import { hasChild } from "@/libs/utils";

export default {
  name: "jump-station",
  components: { FlowCustomPreview },
  props: {
    selectObj: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      autoFocus: null,
      isShow: false,
      drawerFlag: false,
      drawerTitle: this.$t("jumpStation"),
      submitData: {
        barCodeType: "", //条码类型
        barCode: "", //条码
        curProcessName: "", //当前站点
        nextProcessName: "", //下一站点
        routeName: "", //当前流程
        workOrder: "", //工单
        processId: "", //站点id
        processName: "", //站点名称
      },
      // 验证实体
      ruleValidate: {
        barCodeType: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}${this.$t("barCode")}${this.$t("type")}`,
            trigger: "change",
          },
        ],
        barCode: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}${this.$t("barCode")}`,
            trigger: "change",
          },
        ],
      },
      errData: [], //打印信息
      flowList: [],
      barCodeTypeData: [],
      flowObj: {
        name: "",
        width: 0,
        height: 0,
      }, // 初始化画布宽高
      flowData: {
        nodes: [],
        lines: [],
      }, // 流程数据
      stationList: [], // 站点数据
    };
  },
  watch: {
    drawerFlag(newValue) {
      if (newValue) {
        this.getDataItemData();
      }
    },
  },
  methods: {
    //提交
    submitClick() {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          if (!this.submitData.processId)
            return this.$Msg.error(`${this.$t("pleaseEnter")}${this.$t("jumpWhere")}`);
          let obj = { ...this.submitData, ruleName: "Skip", barCodes: [this.submitData.barCode] };
          skipReq(obj).then((res) => {
            let isSuccess = false
            if (res.code === 200) {
              isSuccess = true
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
              this.submitData = { barCodeType: this.submitData.barCodeType, barCode: "" };
              this.isShow = false;
            } else {
              playSound(this.$config.tipsVoice.NgTips);
              this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${errorType(this, res)}`);
            }
            inputSelectContent(this.$refs.barCodeRefsName);
            // 组合错误信息
            const errText = isSuccess ? '' : ` ${this.$t('errCase')}: ${res.result.message}`
            this.errData.unshift({
              type: isSuccess ? 'success' : 'error',
              text: `${this.$t("barCoding")}:${obj.barCodes[0]},${this.$t("workOrder")}:${obj.workOrder},${this.$t("currentSite")}:${obj.curProcessName},${this.$t("nextSite")}:${obj.nextProcessName},${this.$t("jumpWhere")}:${obj.processName}${errText}`,
            });
          });
        }
      });
    },
    // 左侧抽屉取消
    cancelClick() {
      this.drawerFlag = false;
      this.isShow = false;
      this.$refs.submitReq.resetFields(); //清除表单红色提示
      this.errData = [];
      this.submitData = { barCodeType: "", barCode: "" };
    },
    // 获取流程节点数据
    getNodeItem(item) {
      this.submitData.processId = item.labelId;
      this.$set(this.submitData, "processName", item.label);
    },
    // 获取线体数据
    getJumpStationData() {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let { barCode, barCodeType } = this.submitData;
          getunitinfoReq({ barCode, barCodeType }).then((res) => {
            if (res.code === 200) {
              if (res.result) {
                this.submitData = { barCode, barCodeType, ...res.result };
                this.isShow = true;
              } else {
                this.$Msg.error(this.$t("barCodeError"));
                this.isShow = false;
              }
            }
          });
        }
      });
    },
    // 点击浏览按钮触发
    browseClick() {
      const obj = { id: this.submitData.routeId, category: 0, enabled: 1 };
      getlistReq(obj).then(async (res) => {
        if (res.code === 200) {
          this.flowList = res.result || [];
          if (this.flowList.length) {
            let flowItem = this.flowList[0];
            const { nodes, edges } = flowItem.json
              ? JSON.parse(flowItem.json)
              : { nodes: [], edges: [] };
            const node = nodes.map((o) => {
              let color = "";
              if (o.flowMain && o.necessary) {
                color = "#ed4014";
              } else if (o.flowMain && !o.necessary) {
                color = "#19be6b";
              } else {
                color = "#990099";
              }
              return {
                ...o,
                trackInMethods: hasChild(o, "trackInMethods")
                  ? o.trackInMethods
                  : ["UserCheckAsync", "BarCodeCheckAsync", "WorkOrderCheckAsync", "WorkFlowCheckAsync",], // 进站
                collectDataMethods: o.collectDataMethods || [], // 收值
                trackOutMethods: hasChild(o, "trackOutMethods")
                  ? o.trackOutMethods
                  : ["SaveDefectInfoAsync"], // 出站
                allowBarCodeTypes: o.allowBarCodeTypes?.join('') || '',
                style: {
                  fill: color,
                  fillOpacity: 0.5,
                  stroke: color,
                  radius: 6,
                  cursor: "pointer",
                  lineWidth: 1,
                },
              };
            });
            this.flowData = { nodes: node, edges, id: flowItem.id };
            this.flowObj.name = flowItem.name;
            this.flowObj.width = document.documentElement.clientWidth;
            this.flowObj.height = document.documentElement.clientHeight - 63;
            await this.getZoneData();
            this.$refs.refFlowCustomPreview.modalFlag = true;
          }
        }
      });
    },
    // 获取制程数据
    async getZoneData() {
      const obj = { id: "", parentId: "0", name: "", category: 0, enabled: 1 };
      await getlisttreeReq(obj).then((res) => {
        if (res.code === 200) {
          let data = res.result ? res.result : [];
          this.stationList = [];
          this.initTreeData(this.stationList, data);
        }
      });
    },
    // 初始化树型数据
    initTreeData(list, data) {
      let i = 0;
      for (let item of data) {
        let node = {
          ...item,
          label: item.name,
          type: "rect",
          nodeType: "flowNode",
          iconClass: "iconfont icon-box",
          isAdd: isAddNode(item, this.flowData.nodes),
          num: i,
        };
        delete node.children;
        i++;
        if (item.category === 0) node.children = [];
        if (hasChild(item)) this.initTreeData(node.children, item.children);
        list.push(node);
      }
    },
    // 点击编码规则中的加号按钮触发
    async getDataItemData() {
      this.barCodeTypeData = await this.getDataItemDetailList("BarCodeType");
    },
    async getDataItemDetailList(itemCode) {
      const obj = { itemCode, enabled: 1 };
      let arr = [];
      await getdataitemlistReq(obj).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
    },
  },
};
</script>
