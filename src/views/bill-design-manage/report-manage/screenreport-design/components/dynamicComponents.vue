<template>
  <div>
    <Form :label-width="80" label-position="left">
      <FormItem label="数据集">
        <Select size="small" v-model="dataSetValue" filterable placeholder="请选择" @on-change="selectDataSet">
          <Option v-for="item in dataSet" :key="item.setCode" :label="item.setName" :value="item.setCode" />
        </Select>
      </FormItem>
      <FormItem v-for="(item, index) in userNameList" :key="index" :label="item.paramName">
        <Input type="text" v-model.trim="item.sampleItem" v-if="item.paramType==='String'" clearable size="small" />
        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model.trim="item.sampleItem" v-else-if="item.paramType==='Array'" clearable size="small" />
        <DatePicker v-else v-model="item.sampleItem" transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" clearable size="small"></DatePicker>
        <!-- <Input v-model.trim="item.sampleItem" size="small" /> -->
      </FormItem>
      <FormItem v-for="item in setParamList" :key="item" :label="item">
        <Dictionary v-model="params[item]" :dict-key="getDictKey()" @input="selectParams($event, item)" />
      </FormItem>
      <Button style="width: 100%" type="primary" plain size="small" @click="saveDataBtn">刷新</Button>
    </Form>
  </div>
</template>
<script>
// import { queryAllDataSet, detailBysetId } from "@/api/bigscreen";
import { getpagelistReq, getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";
import Dictionary from "@/components/dictionary/index";

export default {
  name: "DynamicComponents",
  components: {
    Dictionary
  },
  model: {
    prop: "formData",
    event: "input"
  },
  props: {
    chartType: String,
    dictKey: String,
    formData: Object
  },
  data () {
    return {
      dataSetValue: "",
      dataSet: [], // 数据集
      userNameList: [], // 用户
      setParamList: [], // 对应的不同的图形数据参数
      params: {},
      chartProperties: {}
    };
  },
  watch: {
    formData: {
      handler (val) {
        this.echoDataSet(val);
      },
      deep: true
    }
  },
  computed: {
    setCode () {
      let code = "";
      this.dataSet.forEach(el => {
        if (el.id == this.dataSetValue) {
          code = el.setCode;
        }
      });
      return code;
    }
  },
  mounted () {
    this.loadDataSet();
    this.echoDataSet(this.formData);
  },
  methods: {
    //获取全部数据集
    async loadDataSet () {
      let obj = {
        orderField: "setCode", // 排序字段
        ascending: true, // 是否升序
        pageSize: 9999, // 分页大小
        pageIndex: 1, // 当前页码
        data: { sourceCode: "", setCode: "", setName: "" },
      };
      const { code, result } = await getpagelistReq(obj);
      this.dataSet = result.data;
      if (code != 200) return;
    },
    // 获取选中数据集具体数据
    async selectDataSet () {
      const { code, result } = await getDeatilByIdReq({ setCode: this.dataSetValue });
      this.userNameList = result.dataSetParamDtoList;
      this.setParamList = result.setParamList;
      if (code != 200) return;
    },
    async saveDataBtn () {
      const contextData = {};
      for (let i = 0; i < this.userNameList.length; i++) {
        contextData[this.userNameList[i].paramName] = this.userNameList[
          i
        ].sampleItem;
      }
      const params = {
        chartType: this.chartType,
        setCode: this.setCode,
        chartProperties: this.chartProperties,
        contextData
      };
      this.$emit("input", params);
      this.$emit("change", params);
    },
    selectParams (val, key) {
      this.chartProperties[key] = val;
    },
    getDictKey () {
      return this.dictKey == null ? "CHART_PROPERTIES" : this.dictKey;
    },
    // 数据集回显
    async echoDataSet (val) {
      if (!val) return;
      const setCode = val.setCode;

      await this.loadDataSet();

      this.dataSetValue = this.dataSet.filter(
        el => setCode == el.setCode
      )[0].id;

      await this.selectDataSet();
      this.echoDynamicData(val);
    },
    echoDynamicData (val) {
      const chartProperties = this.deepClone(val.chartProperties);
      this.chartProperties = chartProperties;
      if (this.userNameList.length > 0) {
      }
      if (this.setParamList.length > 0) {
        for (let i = 0; i < this.setParamList.length; i++) {
          const item = this.setParamList[i];
          if (chartProperties.hasOwnProperty(item)) {
            this.params[item] = chartProperties[item];
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
