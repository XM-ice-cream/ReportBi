<template>
  <Input clearable v-model="colorValue" placeholder="请输入颜色" size="small" @on-change="changeColor">
  <template slot="append">
    <ColorPicker v-model="colorValue" :predefine="predefineColors" alpha transfer size="small" @on-change="changeColor" />
  </template>
  </Input>
</template>

<script>
export default {
  name: "ColorPickerComponents",
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: [String],
      default: ""
    }
  },
  data () {
    return {
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585"
      ],
      colorValue: ""
    };
  },
  watch: {
    value (val) {
      this.colorValue = val || "";
    }
  },
  mounted () {
    this.colorValue = this.value;
  },
  methods: {
    changeColor (val) {
      //   this.colorValue = val.target.value || "";
      this.$emit("input", this.colorValue);
      this.$emit("change", this.colorValue);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ColorPicker--mini,
/deep/.ColorPicker--mini .ColorPicker__trigger {
  width: 23px;
  height: 23px;
}
</style>
<style>
.ivu-select-dropdown {
  width: auto !important;
  border: 1px solid #036595;
  border-radius: 10px !important;
  color: #17cbdd;
  background-color: #072a4f;
  /* right: 2px !important; */
}
</style>
