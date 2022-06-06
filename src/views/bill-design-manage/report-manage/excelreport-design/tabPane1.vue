
<template>
  <Tabs size="small" v-if="type===1">
    <TabPane label="扩展" name="first" size="small">
      <Form ref="rightForm" :model="rightForm" :label-width="60" style="padding: 0 0.5rem">
        <FormItem label="扩展方向">
          <RadioGroup type="button" v-model="rightForm.expend" button-style="solid" size="small" @on-change="autoChangeFunc()">
            <Radio label="no">无</Radio>
            <Radio label="cross">横向</Radio>
            <Radio label="portrait">纵向</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="扩展排序">
          <RadioGroup type="button" v-model="rightForm.expendSort" button-style="solid" size="small" @on-change="autoChangeFunc()">
            <Radio label="no">无</Radio>
            <Radio label="asc">升序</Radio>
            <Radio label="desc">降序</Radio>
          </RadioGroup>
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
        console.log("监听:", this.formData);
        this.rightForm = { ...this.formData };
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      rightForm: {},
    }
  },
  methods: {
    autoChangeFunc () {
      console.log("panel1", this.rightForm);
      this.$emit("autoChangeFunc", this.rightForm);
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
