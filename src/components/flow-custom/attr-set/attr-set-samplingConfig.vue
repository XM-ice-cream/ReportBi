/* 抽检配置 */
<template>
  <Form
    ref="submitReq"
    :model="submitData"
    :rules="ruleValidate"
    :label-width="120"
    :label-colon="true"
  >
    <!-- 抽检类型 -->
    <FormItem :label="$t('planType')" prop="samplingType">
      <RadioGroup v-model="submitData.samplingType">
        <Radio label="globalScale">{{ $t("globalScale") }}</Radio>
        <Radio label="interval">{{ $t("interval") }}</Radio>
        <Radio label="fixedScale">{{ $t("fixedScale") }}</Radio>
        <Radio label="fai">FAI</Radio>
      </RadioGroup>
    </FormItem>
    <!-- 抽检比例 -->
    <FormItem
      :label="$t('globalScale')"
      prop="globalScale"
      v-show="submitData.samplingType === 'globalScale'"
    >
      <InputNumber
        style="width:unset"
        v-model="submitData.globalScale"
        :min="1"
        :max="100"
        :precision="0"
      ></InputNumber>
      %
    </FormItem>
    <!-- 间隔时间 -->
    <FormItem
      :label="$t('interval')"
      prop="intervalTime"
      v-show="submitData.samplingType === 'interval'"
    >
      每
      <InputNumber
        style="width:unset"
        v-model="submitData.intervalTime"
        :min="1"
        :precision="0"
      ></InputNumber>
      分钟抽
      <InputNumber
        style="width:unset"
        v-model="submitData.intervalAmount"
        :min="1"
        :precision="0"
      ></InputNumber>
      个
    </FormItem>
    <!-- 固定比例 -->
    <FormItem
      :label="$t('fixedScale')"
      prop="fixedBase"
      v-show="submitData.samplingType === 'fixedScale'"
    >
      每
      <InputNumber
        style="width:unset"
        v-model="submitData.fixedBase"
        :min="1"
        :precision="0"
      ></InputNumber>
      个抽
      <InputNumber
        style="width:unset"
        v-model="submitData.fixedScale"
        :min="1"
        :max="submitData.fixedBase"
        :precision="0"
      ></InputNumber>
      个
    </FormItem>
    <!-- 计划抽检生效时间 -->
    <FormItem :label="$t('planStartTime')" prop="planStartTime">
      <DatePicker
        type="datetime"
        v-model="submitData.planStartTime"
        :placeholder="$t('pleaseSelect') + $t('planStartTime')"
        :options="datePickerOptions"
        @on-change="
          (time) => {
            submitData.planStartTime = time;
          }
        "
      ></DatePicker>
    </FormItem>
    <!-- 抽检起始数量 -->
    <FormItem :label="$t('startAmount')" prop="startAmount">
      <InputNumber style="width:unset" v-model="submitData.startAmount" :min="1"></InputNumber>
    </FormItem>
    <FormItem label="选项">
      <Checkbox v-model="submitData.enabledHold" true-value="Y" false-value="N">
        {{ $t("enabledHold") }}
      </Checkbox>
    </FormItem>
    <FormItem v-if="isShow">
      <Button type="primary" @click="submit">{{ $t("submit") }}</Button>
    </FormItem>
  </Form>
</template>

<script>
import { getentityReq, addReq, modifyReq } from "@/api/quality-manage/samplingConfig";
import { errorType } from "@/libs/tools";

export default {
  name: "attr-set-samplingConfig",
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
    // 是否显示提交按钮
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      datePickerOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      submitData: {
        workOrder: "N/A", //工单
        routeId: "", // 流程ID
        routeName: "", // 流程名称
        processId: "", //制程ID
        processName: "", // 制程名称
        samplingType: "globalScale", // 抽检类型：globalScale、interval、fixedScale,fai
        globalScale: 1, //	抽检比例，对应globalScale
        intervalTime: 1, //	间隔时间，单位分钟，对应interval
        intervalAmount: 1, //	间隔抽检数量，对应interval
        fixedBase: 1, //	固定比例基数
        fixedScale: 1, // 固定比例基数里面抽取比例数量
        planStartTime: "", //	计划抽检生效时间
        startAmount: 1, //	抽检起始数量
        enabledHold: "N", //是否开启强制HOLD制程Y/N
        enabled: 1, // 1有效 0无效
      },
      // 验证实体
      ruleValidate: {},
    };
  },
  created() {
    let { labelId, label } = this.model;
    let { id, name } = this.optList;
    this.submitData = {
      ...this.submitData,
      routeId: id, //流程ID
      routeName: name, //流程name
      processId: labelId, //制程ID
      processName: label, //制程name
    };
    //获取抽检配置
    this.getentity({ routeId: id, processId: labelId });
  },
  methods: {
    // 获取抽检配置
    getentity(obj) {
      getentityReq({ ...obj, enabled: 1 }).then((res) => {
        if (res.code === 200) {
          let result = res.result || {};
          this.submitData = {
            ...this.submitData,
            ...result,
          };
        }
      });
    },

    // 提交
    submit() {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let {
            samplingType,
            globalScale,
            intervalTime,
            intervalAmount,
            fixedBase,
            fixedScale,
          } = this.submitData;
          if (samplingType === "globalScale" && globalScale === null) {
            return this.$Msg.warning(this.$t("pleaseEnter") + this.$t("globalScale"));
          }
          if (samplingType === "interval" && (intervalTime === null || intervalAmount === null)) {
            return this.$Msg.warning(this.$t("pleaseEnter") + this.$t("interval"));
          }
          if (samplingType === "fixedScale") {
            if (fixedBase === null || fixedScale === null) {
              return this.$Msg.warning(this.$t("pleaseEnter") + this.$t("fixedScale"));
            } else if (fixedBase < fixedScale) {
              return this.$Msg.warning(this.$t("pleaseEnterPerfect") + this.$t("fixedScale"));
            }
          }
          let request = this.submitData.id ? modifyReq(this.submitData) : addReq(this.submitData);
          request.then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.$t("success")}`);
            } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
          });
        }
      });
    },
  },
};
</script>
