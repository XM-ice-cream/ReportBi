
<template>
  <div class="extel-panel">
    <div class="excel-menu">
      <Menu :active-name="activeName" style="width: 3rem;" @on-select="changeMenu">
        <MenuGroup>
          <MenuItem :name="1">
          <Poptip trigger="hover" content="单元格属性" placement="left">
            <Icon type="md-expand" />
          </Poptip>
          </MenuItem>
          <MenuItem :name="2">
          <Poptip trigger="hover" content="单元格元素" placement="left">
            <Icon type="ios-keypad" />
          </Poptip>
          </MenuItem>
        </MenuGroup>
      </Menu>
    </div>
    <div class="excel-tabs">
      <!-- 单元格属性 -->
      <tab-pane-1 :type="activeName" :formData="rightForm.cellAttribute" @autoChangeFunc="autoChangeFunc"></tab-pane-1>
      <!-- 单元格元素 -->
      <tab-pane-2 :type="activeName" :formData="rightForm.cell" @autoChangeFunc="autoChangeFunc"></tab-pane-2>
    </div>
  </div>

</template>
<script>
import tabPane1 from './tabPane1.vue';
import TabPane2 from './tabPane2.vue';

export default {
  components: { tabPane1, TabPane2 },
  name: "right-tabPane",
  props: {
    formData: {
      type: Object,
      default: () => { },
    },
  },
  watch: {
    formData: {
      handler () {
        this.rightForm = { ...this.formData };
        console.log(this.rightForm);
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      rightForm: {},
      activeName: 1,
    }
  },
  methods: {
    //   切换菜单
    changeMenu (name) {
      this.activeName = name;
    },
    autoChangeFunc (type, rightForm) {
      this.rightForm[type] = { ...rightForm };
      console.log(rightForm, type, this.rightForm);
      this.$emit("autoChangeFunc", this.rightForm);
    }
  }
}
</script>
<style>
.excel-menu .ivu-menu-vertical .ivu-menu-item-group-title {
  display: none;
}
.excel-menu .ivu-icon {
  margin-right: 6px;
  font-size: 1rem;
  text-align: center;
  font-weight: bold;
}
.excel-menu .ivu-menu-vertical .ivu-menu-item {
  padding: 12px 14px;
}
.excel-menu .ivu-poptip-body-content {
  overflow: hidden;
  text-align: center;
}
.excel-menu .ivu-poptip-popper {
  min-width: 60px;
}
/* .excel-tabs .ivu-tabs-nav .ivu-tabs-tab {
  padding: 8px 5px;
  margin-right: 8px;
} */
</style>
<style scoped lang = "less">
.extel-panel {
  display: flex;
  margin-left: 0.5rem;
  .excel-menu {
    width: 3rem;
    display: inline-block;
  }
  .excel-tabs {
    width: calc(100% - 3rem);
    display: inline-block;
  }
}
</style>
