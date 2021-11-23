<template>
  <div class="button-right">
    <ButtonGroup>
      <Button
        class="button-right-style"
        v-for="(item, i) in btnDataExpand"
        :key="i"
        type="primary"
        :custom-icon="item.icon"
        :icon="item.icon"
        @click="btnClick(item.name)"
        >{{ item.title }}</Button>
    </ButtonGroup>
    <Dropdown v-if="btnDataOption.length" placement="bottom-end" @on-click="btnClick">
      <Button type="primary"> 更多 <Icon type="ios-arrow-down"></Icon> </Button>
      <DropdownMenu slot="list" class="button-right-list">
        <DropdownItem v-for="(item, i) in btnDataOption" :key="i" :name="item.name">
          <Icon :type="item.icon" size="12"></Icon> {{ item.title }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
export default {
  name: "ButtonCustom",
  props: {
    /**
     * @description 要展示的按钮
     */
    btnData: {
      type: Array,
      default: () => [],
    },
    //按钮显示的个数，其他放进下拉,0默认都显示
    openNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      btnDataExpand: [], //展示在外面
      btnDataOption: [], //放进下拉展示
    };
  },
  methods: {
    btnClick(name) {
      this.$emit(`on-${name}-click`);
    },
    setBtnData() {
      let sliceNum = this.openNum || this.btnData.length;
      this.btnDataExpand = [...this.btnData.slice(0, sliceNum)]; //展示在外面
      this.btnDataOption = [...this.btnData.slice(sliceNum)]; //放进下拉展示
    },
  },
  watch: {
    //按钮数据变更时，设置按钮显示
    btnData() {
      this.setBtnData();
    },
  },
  mounted() {
    //代码热更时设置按钮显示
    if (this.btnData.length) {
      this.setBtnData();
    }
  },
};
</script>
<style scope lang="less">
.button-right {
  float: right;

  &-style {
    & > i {
      vertical-align: 0;
    }
  }

  &::after {
    display: block;
    content: "";
    clear: both;
    height: 0;
  }
  &-list {
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
