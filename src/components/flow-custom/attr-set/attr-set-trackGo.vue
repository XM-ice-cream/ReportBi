<template>
  <div>
    <Tabs v-model="tabName">
      <TabPane :label="$t('trackIn')" name="trackIn">
        <CheckboxGroup v-model="trackInMethods" @on-change="checkAllGroupChange">
          <Checkbox v-for="(item, i) in trackInList" :key="i" :label="item.detailCode">
            <Tooltip :max-width="200" :content="item.remark || item.detailName" transfer>
              {{ item.detailName }}
            </Tooltip>
          </Checkbox>
        </CheckboxGroup>
      </TabPane>
      <TabPane :label="$t('collectData')" name="collectData">
        <CheckboxGroup v-model="collectDataMethods" @on-change="checkAllGroupChange">
          <Checkbox v-for="(item, i) in collectDataList" :key="i" :label="item.detailCode">
            <Tooltip :max-width="200" :content="item.remark || item.detailName" transfer>
              {{ item.detailName }}
            </Tooltip>
          </Checkbox>
        </CheckboxGroup>
      </TabPane>
      <TabPane :label="$t('trackOut')" name="trackOut">
        <CheckboxGroup v-model="trackOutMethods" @on-change="checkAllGroupChange">
          <Checkbox v-for="(item, i) in trackOutList" :key="i" :label="item.detailCode">
            <Tooltip :max-width="200" :content="item.remark || item.detailName" transfer>
              {{ item.detailName }}
            </Tooltip>
          </Checkbox>
        </CheckboxGroup>
      </TabPane>
    </Tabs>
    <div v-if="isShow" style="text-align: center;margin: 30px 20% 0;">
      <Button type="primary" long @click="submit">{{ $t("save") }}</Button>
    </div>
  </div>
</template>

<script>
import { getlistReq as getdataitemlistReq } from "@/api/system-manager/data-item";
export default {
  name: "attr-set-trackGo",
  props: {
    // 当前节点数据
    model: {
      type: Object,
      default: () => {},
    },
    // 是否显示提交按钮
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabName: "trackIn", // 站点设置
      trackInList: [], // 进站列表
      collectDataList: [], // 收值列表
      trackOutList: [], // 出站列表
      trackInMethods: [], // 进站数据
      collectDataMethods: [], // 收值数据
      trackOutMethods: [], // 出站数据
    };
  },
  methods: {
    async initTrackData({ inList = [] }) {
      await this.getDataItemData();
      this.trackInMethods = [...inList];
      this.trackOutMethods = [];
      this.collectDataMethods = [];
      // 过滤掉禁用标签
      this.trackInList.map((o) => {
        if (this.model.trackInMethods.includes(o.detailCode)) {
          this.trackInMethods.push(o.detailCode);
        }
      });
      this.collectDataList.map((o) => {
        if (this.model.collectDataMethods.includes(o.detailCode)) {
          this.collectDataMethods.push(o.detailCode);
        }
      });
      this.trackOutList.map((o) => {
        if (this.model.trackOutMethods.includes(o.detailCode)) {
          this.trackOutMethods.push(o.detailCode);
        }
      });
      this.tabName = "trackIn";
    },
    // 点击编码规则中的加号按钮触发
    async getDataItemData() {
      this.trackInList = await this.getDataItemDetailList("TrackIn");
      this.collectDataList = await this.getDataItemDetailList("CollectData");
      this.trackOutList = await this.getDataItemDetailList("TrackOut");
    },
    async getDataItemDetailList(itemCode) {
      const obj = { itemCode, enabled: 1, oderType: 0 };
      let arr = [];
      await getdataitemlistReq(obj).then((res) => {
        if (res.code === 200) arr = res.result || [];
      });
      return arr;
    },
    // 结束站点选择变化
    checkAllGroupChange(data) {
      this[`${this.tabName}Methods`] = data;
    },
    // 提交
    submit() {
      let mapKey = ["trackIn", "collectData", "trackOut"];
      mapKey.map((item) => {
        let sortData = [];
        this[`${item}List`].map((o) => {
          if (this[`${item}Methods`].includes(o.detailCode)) {
            sortData.push(o.detailCode);
          }
        });
        this[`${item}Methods`] = sortData;
      });
      let obj = {
        trackInMethods: this.trackInMethods,
        collectDataMethods: this.collectDataMethods,
        trackOutMethods: this.trackOutMethods,
      };
      if (
        obj.trackOutMethods.includes("MaterialDeductionAsync") &&
        !obj.trackInMethods.includes("MaterialCheckAsync")
      ) {
        obj.trackInMethods.push("MaterialCheckAsync");
      }
      this.$emit("on-trackGo-submit", obj);
    },
  },
};
</script>
