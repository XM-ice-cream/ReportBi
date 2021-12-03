/* 生成条码 */
<template>
  <div>
    <CheckboxGroup v-model="createSnMethods">
      <Checkbox v-for="(item, i) in createSnMethodsList" :key="i" :label="item.detailCode" :disabled="otherProcessBarCode.includes(item.detailCode)">
        <Tooltip :content="item.remark || item.detailName" transfer>
          {{ item.detailName }}
        </Tooltip>
      </Checkbox>
    </CheckboxGroup>

    <div v-if="isShow" style="text-align: center;margin: 30px 20% 0;">
      <Button type="primary" long @click="submit">{{ $t("save") }}</Button>
    </div>
  </div>
</template>

<script>
import {getlistReq as getdataitemlistReq} from "@/api/system-manager/data-item";
import {getPageListReq} from "@/api/flow-manager/route-check-method";

export default {
  name: "attr-set-createBarCode",
  props: {
    // 当前节点数据
    model: {
      type: Object,
      default: () => {
      },
    },
    // 是否显示提交按钮
    isShow: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      createSnMethodsList: [], // 数据字典列表
      createSnMethods: [], // 保存数据
      otherProcessBarCode: [], // 其他制程正在使用的barCode
    };
  },
  methods: {
    async initData() {
      await this.getDataItemData();
      this.otherProcessBarCode = await this.getSelectedBarCodeData()
      this.createSnMethods = [];
      // 过滤掉禁用标签
      this.createSnMethodsList.map((o) => {
        if (this.model.createSnMethods?.includes(o.detailCode)) {
          this.createSnMethods.push(o.detailCode);
        }
      });
    },
    async getSelectedBarCodeData() {
      let result = []
      await getPageListReq({methodTypeName: 'CreateSnMethods', routeIds: [this.model.routeId]}).then((res) => {
        if (res.code === 200) {
          res.result?.forEach(o => {
            if (o.processName !== this.model.label && !result.includes(o.methodName)) result.push(o.methodName)
          })
        }
      })
      return result
    },
    // 点击编码规则中的加号按钮触发
    async getDataItemData() {
      this.createSnMethodsList = await this.getDataItemDetailList("CreateSnMethods");
    },
    async getDataItemDetailList(itemCode) {
      const obj = {itemCode, enabled: 1, oderType: 0,};
      let arr = [];
      await getdataitemlistReq(obj).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
    },
    // 提交
    submit() {
      let obj = {
        createSnMethods: this.createSnMethods,
      };
      this.$emit("on-createBarCode-submit", obj);
    },
  },
};
</script>
