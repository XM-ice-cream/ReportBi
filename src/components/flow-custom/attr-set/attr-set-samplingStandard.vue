/* 抽检标准 */
<template>
  <div>
    <Table :border="true" :max-height="250" :columns="columns" :data="data">
      <!-- 类型 -->
      <template slot-scope="{ index }" slot="type">
        <Select
          v-model="data[index].type"
          transfer
          @on-change="
            (value) => {
              typeChange(value, index);
            }
          "
        >
          <Option v-for="item in selectList" :value="item" :key="item">{{ item }} </Option>
        </Select>
      </template>

      <template slot-scope="{ index }" slot="itemName">
        <Input v-model="data[index].keyName" />
      </template>
      <template slot-scope="{ index }" slot="itemValue">
        <Input v-model="data[index].stringValue" v-if="data[index].type === 'String'" />
        <div class="referenceValueStyle" v-else>
          <InputNumber style="width:47%" v-model="data[index].minValue" :min="0"></InputNumber>
          -
          <InputNumber style="width:47%" v-model="data[index].maxValue" :min="0"></InputNumber>
        </div>
      </template>

      <template slot-scope="{ index }" slot="action">
        <Button type="error" size="small" @click="remove(index)" icon="iconfont icon-delete">
        </Button>
      </template>
    </Table>
    <!-- 按钮 -->
    <div class="drawer-button" v-if="isShow">
      <Button type="primary" @click="submit">{{ $t("submit") }}</Button>
    </div>
  </div>
</template>

<script>
import { getlistReq, addReq } from "@/api/quality-manage/samplingStandard";
import { errorType } from "@/libs/tools";

export default {
  name: "attr-set-samplingStandard",
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
        routeId: "", // 流程ID
        routeName: "", // 流程名称
        processId: "", //制程ID
        processName: "", // 制程名称
        samplingConfigList: [],
      },
      // 验证实体
      ruleValidate: {},
      columns: [
        {
          type: "index",
          width: 30,
          align: "center",
        },
        {
          title: "类型",
          slot: "type",
          width: 120,
        },
        {
          title: "项目名",
          slot: "itemName",
          width: 100,
        },
        {
          title: "项目值",
          slot: "itemValue",
        },
        {
          title: "操作",
          slot: "action",
          width: 50,
          align: "center",
          renderHeader: (h) => {
            return h("Button", {
              props: {
                type: "primary",
                size: "small",
                icon: "iconfont icon-add",
              },
              on: {
                click: () => {
                  this.add();
                },
              },
            });
          },
        },
      ],
      data: [],
      selectList: ["String", "Number"],
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
    this.getlist(); //获取抽检标准
  },
  methods: {
    //获取抽检标准
    getlist() {
      let { routeId, processId } = this.submitData;
      getlistReq({ routeId, processId, enabled: 1 }).then((res) => {
        if (res.code === 200) {
          let result = res.result || [];
          this.data = result.map((item) => {
            let { type, keyName, stringValue, minValue, maxValue } = item;
            return { type, keyName, stringValue, minValue, maxValue };
          });
        }
      });
    },
    //添加
    add() {
      let params = {
        type: "String",
        keyName: "",
        stringValue: "",
        maxValue: 0,
        minValue: 0,
      };
      this.data.push(params);
    },
    //移除
    remove(index) {
      this.data.splice(index, 1);
    },
    //类型选择
    typeChange(value, index) {
      if (value === "String") {
        this.data[index].minValue = 0;
        this.data[index].maxValue = 0;
      }
      if (value === "Number") {
        this.data[index].stringValue = "";
      }
    },
    // 提交
    submit() {
      let errorMsg = "";
      //遍历数组有空值return并提示
      this.data.some((item, index) => {
        let { type, keyName, stringValue, minValue, maxValue } = item;
        if (!type) {
          errorMsg = `第${index + 1}条数据，请选择类型`;
          return true;
        } else if (!keyName) {
          errorMsg = `第${index + 1}条数据，请输入项目名`;
          return true;
        } else if (type === "String" && !stringValue) {
          errorMsg = `第${index + 1}条数据，请输入项目值`;
          return true;
        } else if (type === "Number") {
          if (minValue === null || maxValue === null) {
            errorMsg = `第${index + 1}条数据，请输入项目值`;
            return true;
          } else if (minValue > maxValue) {
            errorMsg = `第${index + 1}条数据，请输入正确的项目值`;
            return true;
          }
        }
      });
      if (errorMsg) {
        this.$Msg.error(errorMsg);
      } else {
        this.submitData.samplingConfigList = this.data;
        addReq(this.submitData).then((res) => {
          if (res.code === 200) {
            this.$Message.success(`${this.$t("success")}`);
          } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
        });
      }
    },
  },
};
</script>
<style scoped lang="less">
.drawer-button {
  text-align: center;
  margin-top: 20px;
  button {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
