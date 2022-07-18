
<template>
  <Tabs size="small" v-if="type===2" class="tabPane2">
    <TabPane label="单元格元素" name="first" size="small">
      <Form ref="rightForm" :model="rightForm" :label-width="60" style="padding: 0 0.5rem">
        <!-- <FormItem label="单元格">
          <label>{{rightForm.coordinate}}</label>
        </FormItem> -->
        <!-- 显示方式：分组，列表，汇总 -->
        <FormItem label="数据设置">
          <Select v-model="rightForm.showType" size="small" transfer class="showtype" @on-change="autoChangeFunc">
            <Option v-for="item in showTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 分组为普通的 -->
          <Select v-model="rightForm.showTypeValue" size="small" transfer v-if="rightForm.showType==='group'" class="showtype" @on-change="autoChangeFunc">
            <Option v-for="item in showTypeList[0].children" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 分组为高级 -->
          <div v-if="rightForm.showTypeValue==='high'" class="showtypebtn" @click="userDefinedClick">自定义</div>
        </FormItem>
        <FormItem label="过滤条件">
          <Button long @click="filterClick">编辑</Button>
        </FormItem>
      </Form>
    </TabPane>
    <!-- 自定义 -->
    <pane-2-user-defined ref="userDefined" :formData="rightForm" />
    <!-- 过滤数据 -->
    <pane-2-filter-data ref="filterData" :formData="rightForm" @autoChangeFunc="autoChangeFunc"/>
  </Tabs>

</template>
<script>
import Pane2FilterData from './pane2-filter-data.vue';
import pane2UserDefined from './pane2-user-defined.vue';

export default {
  components: { pane2UserDefined, Pane2FilterData },
  name: "tabPane2",
  props: {
    formData: {
      type: Object,
      default: () => { },
    },
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {
    formData: {
      handler () {
        console.log("this.formData", this.formData);
        this.rightForm = { ...this.formData };
      },
      deep: true,
      immediate: true
    },
  },
  data () {
    return {
      rightForm: {},
      //数据显示类型
      showTypeList: [
        {
          label: "分组",
          value: "group",
          children: [
            { label: "普通", value: "ordinary" },
            { label: "相邻连续", value: "adjacent" },
            { label: "高级", value: "high" }
          ]
        }, {
          label: "列表",
          value: "list"
        }, {
          label: "汇总",
          value: "summary"
        }
      ]
    }
  },
  methods: {
    autoChangeFunc (val) {
       this.rightForm = {...this.rightForm,...val}
      const { showType } = this.rightForm;
      if (showType !== "group") this.rightForm.showTypeValue = "";
      this.$emit("autoChangeFunc", 'cell', this.rightForm);
    },
    //自定义按钮设定
    userDefinedClick () {
      this.$refs.userDefined.drawerFlag = true;
    },
    //过滤数据
    filterClick () {
      this.$refs.filterData.drawerFlag = true;
    }
  }
}
</script>
<style>
</style>
<style scoped lang = "less">
.tabPane2 {
  .showtype {
    margin-bottom: 5px;
  }
  .showtypebtn {
    border: 1px solid #dcdee2;
    text-align: center;
  }
}
</style>
