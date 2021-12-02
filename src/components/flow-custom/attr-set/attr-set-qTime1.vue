<template>
  <Form
    ref="submitReq"
    :model="submitData"
    :rules="ruleValidate"
    :label-width="90"
    :label-colon="true"
  >
    <Tabs v-model="stationName" @on-click="tabsClick">
      <TabPane :label="$t('stationIn')" name="stationIn"></TabPane>
      <TabPane :label="$t('stationOut')" name="stationOut"></TabPane>
    </Tabs>
    <Row>
      <i-col span="12">
        <!-- 行为 -->
        <FormItem :label="$t('actionType')" prop="actionType">
          <Select
            v-model="submitData.actionType"
            :placeholder="$t('pleaseSelect') + $t('actionType')"
          >
            <Option v-for="(item, i) in actionTypeData" :value="item.detailCode" :key="i">{{
              item.detailName
            }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="12" v-show="stationName === 'stationOut'">
        <!-- 开始站点RuleName -->
        <FormItem :label="`${$t('fromProcess')}Rule`" prop="fromProcessRuleName">
          <Select
            v-model="submitData.fromProcessRuleName"
            :placeholder="$t('pleaseSelect') + $t('fromProcessRuleName')"
          >
            <Option v-for="(item, i) in ruleNameData" :value="item.detailCode" :key="i">{{
              item.detailName
            }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <!-- 结束流程 -->
      <i-col span="12" v-show="stationName === 'stationOut'">
        <FormItem :label="$t('endFlow')" prop="toRouteId">
          <v-selectpage
            class="select-page-style"
            v-if="stationName === 'stationOut'"
            key-field="id"
            show-field="name"
            :data="wfPageListUrl"
            v-model="submitData.toRouteId"
            @values="getProcess"
            :placeholder="$t('pleaseSelect') + $t('endFlow')"
            :result-format="
              (res) => {
                return {
                  totalRow: res.total,
                  list: res.data || [],
                };
              }
            "
          >
          </v-selectpage>
        </FormItem>
      </i-col>
      <!-- 结束站点RuleName -->
      <i-col span="12" v-show="stationName === 'stationOut'">
        <FormItem :label="`${$t('toProcess')}Rule`" prop="toProcessRuleName">
          <Select
            v-model="submitData.toProcessRuleName"
            :placeholder="$t('pleaseSelect') + $t('toProcessRuleName')"
          >
            <Option v-for="(item, i) in ruleNameData" :value="item.detailCode" :key="i">{{
              item.detailName
            }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <!-- 结束站点 -->
      <i-col span="12" v-if="stationName === 'stationOut'">
        <FormItem :label="$t('toProcess')" prop="toProcessId">
          <Select
            v-model="submitData.toProcessId"
            transfer
            filterable
            clearable
            :placeholder="$t('pleaseSelect') + $t('toProcess')"
            label-in-value
          >
            <Option v-for="(item, i) in processList" :value="item.id" :key="i">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="12">
        <!-- 限制时间 -->
        <FormItem :label="$t('limitTime')" prop="limitTime">
          <InputNumber style="width: unset" v-model="submitData.limitTime" :min="1"></InputNumber>
          {{ $t("minute") }}
        </FormItem>
      </i-col>
      <i-col span="12">
        <!-- 等待时间 -->
        <FormItem :label="$t('waitTime')" prop="waitTime">
          <InputNumber style="width: unset" v-model="submitData.waitTime" :min="0"></InputNumber>
          {{ $t("minute") }}
        </FormItem>
      </i-col>
      <i-col span="12">
        <!-- 预警时间 -->
        <FormItem :label="$t('alarmTime')" prop="alarmTime">
          <InputNumber
            style="width: unset"
            v-model="submitData.alarmTime"
            :min="0"
            :max="submitData.limitTime - 1"
          ></InputNumber>
          {{ $t("minute") }}
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem :label="$t('enabled')" prop="enabled">
          <i-switch size="large" v-model="submitData.enabled" :true-value="1" :false-value="0">
            <span slot="open">{{ $t("open") }}</span>
            <span slot="close">{{ $t("close") }}</span>
          </i-switch>
        </FormItem>
      </i-col>
    </Row>
    <FormItem :label="$t('remark')" prop="remark">
      <Input v-model="submitData.remark" :placeholder="$t('pleaseEnter') + $t('remark')" />
    </FormItem>
    <FormItem v-if="isShow">
      <Button type="primary" @click="submit">{{ $t("submit") }}</Button>
    </FormItem>
  </Form>
</template>

<script>
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
import { getlistReq, addReq, modifyReq } from "@/api/system-manager/qtime";
import { errorType } from "@/libs/tools";
import { wfPageListUrl } from "@/api/basis-info/wf-route";
import { getprocessbyrouteidReq } from "@/api/basis-info/wf-route";
export default {
  name: "attr-set-qTime",
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
      wfPageListUrl: wfPageListUrl(),
      stationName: "stationIn", // 站点设置
      req: {
        processId: "", // 制程id
        enabled: 1, // 1有效 0无效
      },
      submitData: {
        id: "", // 行为 : Hold / Noop
        actionType: "", // 行为 : Hold / Jump
        routeId: "N/A", // 流程Id
        fromRouteId: "", // 当前流程Id
        toRouteId: "", //结束流程id
        fromProcessId: "", // 从那个站点
        fromProcessRuleName: "", // 开始站点RuleName
        toProcessId: null, // 到那个站点
        toProcessRuleName: "", // 结束站点RuleName
        limitTime: 1, // 限制时间单位分钟
        waitTime: 0, // 等待时间单位分钟
        alarmTime: 1, // 预警时间,将来给看板用
        enabled: 1, // 1有效 0无效
        remark: "", // 描述
      },
      // 验证实体
      ruleValidate: {
        actionType: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}${this.$t("actionType")}`,
            trigger: "change",
          },
        ],
        fromProcessRuleName: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}${this.$t("fromProcessRuleName")}`,
            trigger: "change",
          },
        ],
        toProcessId: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}${this.$t("toProcess")}`,
            trigger: "change",
          },
        ],
        toProcessRuleName: [
          {
            required: true,
            message: `${this.$t("pleaseEnter")}${this.$t("toProcessRuleName")}`,
            trigger: "change",
          },
        ],
        limitTime: [
          {
            required: true,
            type: "number",
            message: `${this.$t("pleaseEnter")}${this.$t("limitTime")}`,
            trigger: "change",
          },
        ],
        toRouteId: [
          {
            required: true,
            message: `${this.$t("pleaseSelect")}${this.$t("endFlow")}`,
            trigger: "change",
          },
        ],
      },
      actionTypeData: [], // 行为数据
      ruleNameData: [], // 限制类型数据
      qTimeSelectObj: [], // 限制类型数据
      stationInObj: null, // 站内数据
      stationOutObj: null, // 站外数据
      processList: [], //当前流程图制程数据
    };
  },
  created() {
    this.req.processId = this.model.labelId;
    this.getQTimeData();
    this.getDataItemData();
  },
  watch: {
    "submitData.toRouteId"(newVal) {
      if (!newVal) {
        this.submitData.toProcessId = "";
      }
    },
  },
  methods: {
    getProcess() {
      this.processList = [];
      //如果结束流程是当前流程就取当前流程里面的制程
      if (this.submitData.toRouteId === this.optList.id) {
        const { nodes } = this.optList.graph.save();
        this.processList = nodes
          .filter((o) => o.nodeType == "flowNode")
          .map((o) => {
            return {
              id: o.labelId,
              name: o.label,
            };
          });
      } else {
        let obj = { routeId: this.submitData.toRouteId };
        getprocessbyrouteidReq(obj).then((res) => {
          if (res.code === 200) {
            let result = res.result || [];
            this.processList = result.filter((o) => o.id !== "start" && o.id !== "end");
          }
        });
      }
    },

    // 获取分页列表数据
    getQTimeData() {
      getlistReq({ fromProcessId: this.req.processId, routeId: this.optList.id, enabled: -1 }).then(
        (res) => {
          if (res.code === 200) {
            let inObj = null,
              outObj = null,
              otherObj = {
                id: "", // 行为 : Hold / Noop
                actionType: "", // 行为 : Hold / Jump
                routeId: "N/A" || this.optList.id, // 流程Id
                fromRouteId: this.optList.id, // 当前流程Id
                toRouteId: this.optList.id, //结束流程id
                fromProcessId: this.req.processId, // 从那个站点
                fromProcessRuleName: "", // 开始站点RuleName
                toProcessId: null, // 到那个站点
                toProcessRuleName: "", // 结束站点RuleName
                limitTime: 1, // 限制时间单位分钟
                waitTime: 0, // 等待时间单位分钟
                alarmTime: 1, // 预警时间,将来给看板用
                enabled: 1, // 1有效 0无效
                remark: "", // 描述
              };
            if (res.result && res.result.length) {
              inObj = res.result.find((o) => o.fromProcessId === o.toProcessId);
              if (inObj) {
                inObj.fromRouteId = inObj.fromRouteId || this.optList.id; // 当前流程Id
                inObj.toRouteId = inObj.toRouteId || this.optList.id; //结束流程id
              }
              outObj = res.result.find((o) => o.fromProcessId !== o.toProcessId);
              //    outObj =
              // res.result.length === 2
              //   ? res.result.find((o) => o.fromProcessId !== o.toProcessId)
              //   : null;
            }
            this.stationInObj = inObj || {
              ...otherObj,
              fromProcessRuleName: "TrackIn",
              toProcessId: this.req.processId,
              toProcessRuleName: "TrackOut",
            };
            this.stationOutObj = outObj || otherObj;
            this.tabsClick(this.stationName);
          }
        }
      );
    },
    // 点击编码规则中的加号按钮触发
    async getDataItemData() {
      this.actionTypeData = await this.getDataItemDetailList("actionType");
      this.ruleNameData = await this.getDataItemDetailList("RuleName");
    },
    async getDataItemDetailList(itemCode) {
      const obj = { itemCode, enabled: 1 };
      let arr = [];
      await getdataitemlistReq(obj).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
    },
    // 结束站点选择变化
    parentInput(value) {
      if (!value) {
        this.submitData.toProcessId = null;
      }
    },
    // 选项卡切换
    tabsClick(name) {
      this.submitData = { ...this[`${name}Obj`] };
    },
    // 提交
    submit() {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          if (this.model.trackInMethods.length === 0 || this.model.trackOutMethods.length === 0) {
            this.$Msg.error("进站和出站不能为空");
          } else {
            let obj = { ...this.submitData };
            let request = obj.id ? modifyReq(obj) : addReq(obj);
            request.then((res) => {
              if (res.code === 200) {
                this.$Message.success(`${this.$t("success")}`);
                this.getQTimeData();
              } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
            });
          }
        }
      });
    },
  },
};
</script>
