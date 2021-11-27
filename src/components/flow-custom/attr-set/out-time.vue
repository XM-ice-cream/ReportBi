<template>
  <Form
    ref="submitReq"
    :model="submitData"
    :rules="ruleValidate"
    :label-width="90"
    :label-colon="true"
  >
    <Row>
      <i-col span="15">
        <!-- 站外名称 -->
        <FormItem :label="$t('stationOutName')" prop="stationOutName">
          <Select v-model="stationOutName"
            :placeholder="$t('pleaseSelect') + $t('stationOutName') + $t('enterCreateStationOutName')"
            filterable
            @on-change="changeStationOut"
          >
            <Option v-for="(item, i) in stationOutNameList" :value="item.id" :key="i">{{
              item.id != 0
                ? item.fromProcessName +
                  "(" +
                  item.fromProcessRuleName +
                  ")---" +
                  item.name +
                  "(" +
                  item.toProcessRuleName +
                  ")"
                : item.name
            }}</Option>
          </Select>
        </FormItem>
      </i-col>
    </Row>
    <div class="station-box">
      <Icon
        class="delete"
        type="md-close-circle"
        @click="deleteStation"
        v-if="stationOutName !== 0"
      />
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
        <i-col span="12">
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
        <i-col span="12">
          <FormItem :label="$t('endFlow')" prop="toRouteId">
            <v-selectpage
              class="select-page-style"
              key-field="id"
              ref="toRouteId"
              :title="toRouteTitle"
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
        <i-col span="12">
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
        <i-col span="12">
          <FormItem :label="$t('toProcess')" prop="toProcessId">
            <Select
              v-model="submitData.toProcessId"
              transfer
              filterable
              clearable
              :placeholder="$t('pleaseSelect') + $t('toProcess')"
              @on-change="toProcessChange"
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
            <InputNumber style="width: unset" v-model="submitData.waitTime" :min="-1"></InputNumber>
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
          <!-- 最大解锁次数 -->
          <FormItem label="最大解锁次数" prop="unholdTimes">
            <InputNumber
              style="width: unset"
              v-model="submitData.unholdTimes"
              :min="0"
            ></InputNumber>
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
    </div>
    <div v-if="isShow" style="text-align: center;">
      <Button
        type="primary"
        @click="add"
        style="margin-right: 10px;"
        v-if="stationOutName === 0 && addFlag === false"
        >{{ $t("Add") }}</Button
      >
      <Button type="primary" @click="submit" v-if="stationOutName !== 0 || addFlag === true">{{
        $t("submit")
      }}</Button>
    </div>
  </Form>
</template>

<script>
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
import { getlistReq, addReq } from "@/api/system-manager/qtime";
import { errorType } from "@/libs/tools";
import { wfPageListUrl } from "@/api/basis-info/wf-route";
import { getprocessbyrouteidReq } from "@/api/basis-info/wf-route";
export default {
  name: "out-time",
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
      submitInData: {
        id: "", // 行为 : Hold / Noop
        actionType: "", // 行为 : Hold / Jump
        routeId: "N/A", // 流程Id
        fromRouteId: "", // 当前流程Id
        toRouteId: "", //结束流程id
        fromProcessId: "", // 从那个站点
        fromProcessRuleName: "", // 开始站点RuleName
        toProcessId: "", // 到那个站点
        toProcessRuleName: "", // 结束站点RuleName
        limitTime: 1, // 限制时间单位分钟
        waitTime: 0, // 等待时间单位分钟
        alarmTime: 1, // 预警时间,将来给看板用
        unholdTimes:0,//最大解锁次数
        enabled: 1, // 1有效 0无效
        remark: "", // 描述
      },
      submitData: {
        id: "", // 行为 : Hold / Noop
        actionType: "", // 行为 : Hold / Jump
        routeId: "N/A", // 流程Id
        fromRouteId: "", // 当前流程Id
        toRouteId: "", //结束流程id
        fromProcessId: "", // 从那个站点
        fromProcessRuleName: "", // 开始站点RuleName
        toProcessId: "", // 到那个站点
        toProcessRuleName: "", // 结束站点RuleName
        toProcessNotNecessary: 0, // 值0 1
        limitTime: 1, // 限制时间单位分钟
        waitTime: 0, // 等待时间单位分钟
        alarmTime: 1, // 预警时间,将来给看板用
        unholdTimes:0,//最大解锁次数
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
      stationOutNameList: [
        {
          name: "新增",
          id: 0,
        },
      ], //站外名称列表
      addList: [], //新增列表
      data: [], //站外数据列表
      stationOutName: "", //站外名称,
      toRouteTitle: "",
      addFlag: false,
    };
  },
  created() {
    this.req.processId = this.model.labelId;
    this.getDataItemData();
    this.getStationOutList();
  },
  watch: {
    // "submitData.toRouteId"(newVal) {
    // if (!newVal) {
    //   this.submitData.toProcessId = "";
    // }
    // },
  },
  methods: {
    toProcessChange(data) {
      this.submitData.toProcessNotNecessary = data && !(this.processList.find(o => o.id = data)?.necessary) ? 1 : 0
    },
    getProcess() {
      this.processList = [];
      //如果结束流程是当前流程就取当前流程里面的制程
      if (this.submitData.toRouteId === this.optList.id) {
        const { nodes } = this.optList.graph.save();
        this.processList = nodes
          .filter((o) => o.nodeType === "flowNode")
          .map((o) => {
            return {
              id: o.labelId,
              name: o.label,
              necessary: o.necessary
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
    // 改变站外名称
    changeStationOut() {
      if (this.stationOutName === 0) {
        this.reset();
      } else {
        this.addList.forEach((item) => {
          if (item.toProcessId && this.stationOutName === item.toProcessId) {
            this.$nextTick(() => {
              this.submitData = item;
            });
          }
        });
      }
    },
    //获取站外节点列表
    getStationOutList() {
      getlistReq({
        fromRouteId: this.optList.id,
        fromProcessId: this.req.processId,
        enabled: -1,
      }).then((res) => {
        if (res.code === 200) {
          this.addList = res.result;
          let outObj = res.result.filter((o) => o.fromProcessId !== o.toProcessId);
          this.stationOutNameList = [
            {
              name: "新增",
              id: 0,
            },
          ];
          outObj.forEach((item) => {
            this.stationOutNameList.push({
              name: item.toProcessName,
              id: item.toProcessId,
              stationOutId: item.id,
              fromProcessName: item.fromProcessName,
              fromProcessRuleName: item.fromProcessRuleName,
              toProcessRuleName: item.toProcessRuleName,
            });
          });
        }
      });
    },
    // 新增
    async add() {
      await this.$refs.submitReq.validate(async (validate) => {
        if (validate) {
          let flag = this.addList.some(
            (val) =>
              val.fromRouteId === this.optList.id &&
              val.fromProcessId === this.req.processId &&
              val.fromProcessRuleName === this.submitData.fromProcessRuleName &&
              val.toRouteId === this.submitData.toRouteId &&
              val.toProcessId === this.submitData.toProcessId &&
              val.toProcessRuleName === this.submitData.toProcessRuleName
          );
          if (flag) {
            this.$Msg.error(`数据重复`);
          } else {
            this.submitData.fromRouteId = this.optList.id;
            this.submitData.fromProcessId = this.req.processId;
            this.addList.push({ ...this.submitData });
            await this.submit();
            await this.getStationOutList();
          }
        }
      });
    },
    // 删除
    deleteStation() {
      this.addList.splice(
        this.addList.findIndex((val) => val.id === this.submitData.id),
        1
      );
      this.stationOutNameList.splice(
        this.stationOutNameList.findIndex((val) => val.stationOutId === this.submitData.id),
        1
      );
      this.$Message.success(`${this.$t("delete") + this.$t("successTips")}`);
      this.stationOutName = 0;
      this.reset();
    },
    // 提交
    submit() {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          addReq(this.addList).then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.$t("success")}`);
            } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
          });
        }
      });
    },
    reset() {
      this.submitData = {
        id: "",
        actionType: "",
        routeId: "N/A", // 流程Id
        fromRouteId: "", // 当前流程Id
        toRouteId: "", //结束流程id
        fromProcessId: "", // 从那个站点
        fromProcessRuleName: "", // 开始站点RuleName
        toProcessId: "", // 到那个站点
        toProcessRuleName: "", // 结束站点RuleName
        limitTime: 1, // 限制时间单位分钟
        waitTime: 0, // 等待时间单位分钟
        alarmTime: 1, // 预警时间,将来给看板用
        unholdTimes:0,//最大解锁次数
        enabled: 1, // 1有效 0无效
        remark: "", // 描述
      };
      this.$refs.toRouteId.remove();
    },
  },
};
</script>
<style scoped lang="less">
.station-box {
  border: 1px dashed #ccc;
  padding: 17px 18px 9px 8px;
  margin-bottom: 20px;
  position: relative;
}
.delete {
  position: absolute;
  right: 7px;
  top: -14px;
  font-size: 26px;
  color: #8e8a89;
  cursor: pointer;
}
</style>
