
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
          <Input type="text" v-model="rightForm.expend.topParentValue.label" size="small" v-if="rightForm.expend.topParent=='userDefined'" placeholder="例:A1" @on-blur="(evt)=>changeInput(evt,'topParentValue')"></Input>
        </FormItem>
        <FormItem label="左父格">
          <Select v-model="rightForm.expend.leftParent" size="small" transfer @on-change="resetParent('leftParentValue')">
            <Option v-for="item in cellRelationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input type="text" v-model="rightForm.expend.leftParentValue.label" size="small" v-if="rightForm.expend.leftParent=='userDefined'" placeholder="例:A1" @on-blur="(evt)=>changeInput(evt,'leftParentValue')"></Input>
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
    //修改父组件rightForm值
    autoChangeFunc () {
      this.$emit("autoChangeFunc", 'cellAttribute', this.rightForm);
    },
    //监听父子格输入框
    changeInput (evt, key) {
      const value = evt.target.value;
      console.log("监听父子格输入框", value, this.rightForm.expend);
      const { leftParent, topParent, leftParentValue, topParentValue } = this.rightForm.expend;
      //左父格，上父格为自定义时,修改值
      if (leftParent === "userDefined") this.rightForm.expend.leftParentValue.value = this.setParentValue(leftParentValue.label);//行，列
      if (topParent === "userDefined") this.rightForm.expend.topParentValue.value = this.setParentValue(topParentValue.label);//行，列
      this.autoChangeFunc();
    },
    //父格自定义 value值改为 行号，列号 格式
    setParentValue (label) {
      const alpha = label.toUpperCase().match(/[A-Z]+/gi);
      const str = this.getAlphaSeq(alpha);
      const num = label.match(/\d+$/gi) - 1;
      return `${num},${str}`;
    },
    //获取字母是第几列
    getAlphaSeq (str) {
      let strArray = str.toString().split('') || "";
      let num = 0;
      for (let i = 0; i < strArray.length; i++) {
        //   charCodeAt 转ASCII码，A:65
        num = (num + Math.pow(26, i) + (parseInt(strArray[i].charCodeAt() - 65)));
      }
      return num - 1;
    },

    //重置父子格数据
    resetParent (key) {
      this.rightForm.expend[key] = { label: "", value: "" };
      const { leftParent, topParent } = this.rightForm.expend;
      //无父子格
      if (leftParent === "no") this.rightForm.expend[key] = "";
      if (topParent === "no") this.rightForm.expend[key] = "";
      this.autoChangeFunc();
    }
  }
}
</script>
<style>
</style>
<style scoped lang = "less">
</style>
