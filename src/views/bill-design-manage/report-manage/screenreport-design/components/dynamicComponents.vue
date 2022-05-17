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
      <FormItem label="行">
        <div class="row">
          <draggable group="site" v-model="rowParamList" class="site-flex" chosenClass="item">
            <Dropdown v-for="(item,index) in rowParamList" :key="`${item}${index}`" transfer trigger="click" @on-click="name=>dropDownClick(name,index,'row')">
              <div class="item">
                <Icon type="ios-arrow-down"></Icon>
                {{item}}
              </div>
              <DropdownMenu slot="list">
                <Dropdown placement="left-start" transfer>
                  <DropdownItem>
                    <Icon type="ios-arrow-back" />
                    度量
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem name="">原值</DropdownItem>
                    <DropdownItem name="Count">计数</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </DropdownMenu>
            </Dropdown>
          </draggable>
        </div>
      </FormItem>
      <FormItem label="列">
        <div class="columns">
          <draggable group="site" v-model="columnsParamList" class="site-flex" chosenClass="item">
            <Dropdown v-for="(item,index) in columnsParamList" :key="`${item}${index}`" transfer trigger="click" @on-click="name=>dropDownClick(name,index,'column')">
              <div class="item">
                <Icon type="ios-arrow-down"></Icon>
                {{item}}
              </div>
              <DropdownMenu slot="list">
                <Dropdown placement="left-start" transfer>
                  <DropdownItem>
                    <Icon type="ios-arrow-back" />
                    度量
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem name="">原值</DropdownItem>
                    <DropdownItem name="Count">计数</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </DropdownMenu>
            </Dropdown>
          </draggable>
        </div>
      </FormItem>
      <Button style="width: 100%" type="primary" plain size="small" @click="saveDataBtn">刷新</Button>
    </Form>
  </div>
</template>
<script>
// import { queryAllDataSet, detailBysetId } from "@/api/bigscreen";
import { getpagelistReq, getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";
// import { getDataReq } from '@/api/bill-design-manage/report-manage.js'
import Dictionary from "@/components/dictionary/index";
import draggable from "vuedraggable";
import { formatDate } from "@/libs/tools";

export default {
  name: "DynamicComponents",
  components: {
    Dictionary,
    draggable
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
      chartProperties: {},
      rowParamList: [],//行
      columnsParamList: [],//列
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
        if (el.setCode == this.dataSetValue) {
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
    //参数下拉
    dropDownClick (name, index, type) {
      if (type === "row") this.rowParamList[index] = this.removeReg(this.rowParamList[index], name);
      if (type === "column") this.columnsParamList[index] = this.removeReg(this.columnsParamList[index], name);
      this.$forceUpdate();
    },
    //
    removeReg (params, name) {
      let result = "";
      let data = params;
      let reg = /\((.+?)\)/gi;//取括号内部文字
      if (data.match(reg)) {
        data = data.match(reg)[0].replace(/^\(/, "").replace(/\)/, "");
      }
      if (name) {
        result = `${name}(${data})`
      }
      else result = data;
      return result;
    },

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
      console.log("获取选中数据集具体数据", result);
      this.userNameList = result.dataSetParamDtoList;
      this.setParamList = result.setParamList;
      this.$emit("getSetParamsList", this.setParamList);
      if (code != 200) return;
    },
    //刷新
    async saveDataBtn () {
      const contextData = {};
      for (let i = 0; i < this.userNameList.length; i++) {
        let sampleItem = this.userNameList[i].sampleItem;
        if (sampleItem instanceof Date) sampleItem = formatDate(sampleItem)
        contextData[this.userNameList[i].paramName] = sampleItem;
      };
      console.log("刷新", contextData, this.rowParamList, this.columnsParamList);
      let data = { rows: [], columns: [] };
      //行
      [this.rowParamList, this.columnsParamList].forEach((paramList, paramIndex) => {
        const key = paramIndex === 0 ? "rows" : "columns"
        paramList.forEach((item, index) => {
          data[key][index] = { name: "", function: "" }
          //取括号内部的字段名
          data[key][index]["name"] = this.removeReg(item, "");
          //取计算属性
          data[key][index]["function"] = item.substr(0, item.indexOf('('));
        })
      })
      const params = {
        chartType: this.chartType,
        setCode: this.setCode,
        chartProperties: this.chartProperties,
        contextData,
        autoTurn: data
      };
      //  console.log('params', params);
      this.$emit("input", params);
      this.$emit("change", params);
    },
    getDictKey () {
      return this.dictKey == null ? "CHART_PROPERTIES" : this.dictKey;
    },
    // 数据集回显
    async echoDataSet (val) {
      if (!val) return;
      this.dataSetValue = val.setCode;

      await this.loadDataSet();

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
<style lang="less" scoped>
.row,
.columns {
  width: 100%;
  height: 100px;
  max-height: 15rem;
  border: 1px solid #036595;
  min-height: 10rem;
  border-radius: 10px;
  overflow-y: auto;
  .site-flex {
    height: 100%;
    cursor: pointer;
  }
  span {
    display: flex;
    max-height: 5rem;
    min-height: 3rem;
    flex-wrap: wrap;
  }
  /deep/.ivu-dropdown {
    margin: 0.3rem 0.3rem;
    padding: 0px 0.6rem;
    background: #51afff;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    height: 1.6rem;
    width: auto;
    flex-basis: auto;
  }
}
/deep/.ivu-dropdown {
  display: inline-block;
  width: 100%;
}
/deep/.ivu-dropdown-item:hover {
  background: #51afff;
  color: #fff;
}
/deep/.ivu-dropdown-item {
  color: #14adc2;
}
</style>
