
<template>
  <Tabs size="small" v-if="type===1">
    <TabPane label="扩展" name="first" size="small">
      <Form ref="rightForm" :model="rightForm" :label-width="60" style="padding: 0 0.5rem">
        <FormItem label="扩展方向">
          <RadioGroup type="button" v-model="rightForm.expend.expend" button-style="solid" size="small" @on-change="autoChangeFunc()">
            <Radio label="no">无</Radio>
            <Radio label="cross">横向</Radio>
            <Radio label="portrait">纵向</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="扩展排序">
          <RadioGroup type="button" v-model="rightForm.expend.expendSort" button-style="solid" size="small" @on-change="autoChangeFunc()">
            <Radio label="no">无</Radio>
            <Radio label="asc">升序</Radio>
            <Radio label="desc">降序</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="上父格">
          <Select v-model="rightForm.expend.topParent" size="small" transfer @on-change="resetParent('topParentValue')">
            <Option v-for="item in cellRelationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input type="text" v-model="rightForm.expend.topParentValue.label" size="small" v-if="rightForm.expend.topParent=='userDefined'" placeholder="例：A1" @on-blur="(evt)=>changeInput(evt,'topParentValue')"></Input>
        </FormItem>
        <FormItem label="左父格">
          <Select v-model="rightForm.expend.leftParent" size="small" transfer @on-change="resetParent('leftParentValue')">
            <Option v-for="item in cellRelationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input type="text" v-model="rightForm.expend.leftParentValue.label" size="small" v-if="rightForm.expend.leftParent=='userDefined'" placeholder="例：A1" @on-blur="(evt)=>changeInput(evt,'leftParentValue')"></Input>
        </FormItem>
      </Form>
    </TabPane>
    <TabPane label="样式" name="second">

    </TabPane>
    <TabPane label="形态" name="third">

    </TabPane>
    <TabPane label="其他" name="fourth">

    </TabPane>
  </Tabs>

</template>
<script>

export default {
  name: "tabPane1",
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
        this.rightForm = { ...this.formData };
      },
      deep: true,
      immediate: true
    },
  },
  data () {
    return {
      rightForm: {},
      cellRelationList: [
        {
          label: "无",
          value: "no"
        }, {
          label: "默认",
          value: "default"
        }, {
          label: "自定义",
          value: "userDefined"
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
    resetParent (key) {
      this.rightForm.expend[key] = { label: "", value: "" };
      const { leftParent, topParent } = this.rightForm.expend;
      //无父子格
      if (leftParent === "no" || topParent === "no") {
        this.rightForm.expend[key] = "";
      }
      this.autoChangeFunc();
    }
  }
}
</script>
<style>
.excel-menu .ivu-menu-vertical .ivu-menu-item-group-title {
  display: none;
}
/* .excel-tabs .ivu-tabs-nav .ivu-tabs-tab {
  padding: 8px 5px;
  margin-right: 8px;
} */
</style>
<style scoped lang = "less">
.extel-panel {
  display: flex;
  .excel-menu {
    width: 3rem;
    display: inline-block;
  }
  .excel-tabs {
    width: calc(100% - 3rem);
    display: inline-block;
    margin-left: 1rem;
  }
}
</style>
