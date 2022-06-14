
<template>
  <Tabs size="small" v-if="type===2" class="tabPane2">
    <TabPane label="单元格元素" name="first" size="small">
      <Form ref="rightForm" :model="rightForm" :label-width="60" style="padding: 0 0.5rem">
        <FormItem label="单元格">
          <label>{{rightForm.coordinate}}</label>
        </FormItem>
        <!-- 显示方式：分组，列表，汇总 -->
        <FormItem label="数据设置">
          <Select v-model="rightForm.showType" size="small" transfer class="showtype">
            <Option v-for="item in showTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 分组为普通的 -->
          <Select v-model="rightForm.showTypeValue" size="small" transfer v-if="rightForm.showType==='group'" class="showtype">
            <Option v-for="item in showTypeList[0].children" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 分组为高级 -->
          <div v-if="rightForm.showTypeValue==='high'" class="showtypebtn" @click="userDefinedClick">自定义</div>
        </FormItem>
      </Form>
    </TabPane>
    <!-- 自定义 -->
    <pane-2-user-defined ref="userDefined" :formData="rightForm" />
  </Tabs>

</template>
<script>
import pane2UserDefined from './pane2-user-defined.vue';

export default {
  components: { pane2UserDefined },
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
    autoChangeFunc () {
      this.$emit("autoChangeFunc", 'cellAttribute', this.rightForm);
    },
    //监听父子格输入框
    changeInput (evt, key) {
      const value = evt.target.value;
      console.log("监听父子格输入框", value, this.rightForm.expend);
      //   this.rightForm.expend[key].value = value;
      const { leftParent, topParent, leftParentValue, topParentValue } = this.rightForm.expend;
      //左父格，上父格为自定义时,修改值
      if (leftParent === "userDefined") {
        const alpha = leftParentValue.label.toUpperCase().match(/[A-Z]+/gi);
        const str = this.getAlphaSeq(alpha);
        const num = leftParentValue.label.match(/\d+$/gi);
        this.rightForm.expend.leftParentValue.value = `${str},${num}`;
      }
      if (topParent === "userDefined") {
        const alpha = topParentValue.label.toUpperCase().match(/[A-Z]+/gi);
        const str = this.getAlphaSeq(alpha);
        const num = topParentValue.label.match(/\d+$/gi);
        this.rightForm.expend.topParentValue.value = `${str},${num}`;
      }
      console.log("this.rightForm.expend.leftParentValue.value", this.rightForm.expend.leftParentValue, "this.rightForm.expend.topParentValue", this.rightForm.expend.topParentValue);
      this.autoChangeFunc();
    },
    //获取字母是第几列
    getAlphaSeq (key) {
      const obj = {
        A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, J: 6, H: 7, I: 8, G: 9, K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
        U: 20,
        V: 21,
        W: 22,
        X: 23,
        Y: 24,
        Z: 25
      }
      return obj[key]
    },
    //重置父子格数据
    resetShowType (key) {
      this.rightForm.expend[key] = { label: "", value: "" };
      const { leftParent, topParent } = this.rightForm.expend;
      //无父子格
      if (leftParent === "no" || topParent === "no") {
        this.rightForm.expend[key] = "";
      }
      this.autoChangeFunc();
    },
    //自定义按钮设定
    userDefinedClick () {
      console.log(this.$refs.userDefined);
      this.$refs.userDefined.drawerFlag = true;
    },
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
