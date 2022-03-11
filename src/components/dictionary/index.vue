
<template>
  <Select v-model="dictionary" placeholder="请选择" clearable @change="selectChange" size="small">
    <Option v-for="item in dictionaryOptions" :key="item.id" :label="item.text" :value="item.id" />
  </Select>
</template>

<script>
// import { getDictList } from "@/api/bill-design-manage/dict-data"; // 获取数据字典
export default {
  name: "GetDictionary",
  props: {
    dictKey: String, // 字典code
    updataDict: String, // 回显绑定的值
    value: String
  },
  data () {
    return {
      dictionary: "", // 绑定选中的值
      dictionaryOptions: [] // 拉下字典选项
    };
  },
  watch: {
    dictKey: {
      immediate: true,
      handler () {
        this.getSystem();
      }
    },
    value: {
      handler (val) {
        this.dictionary = val;
      },
      deep: true
    }
  },
  created () {
    this.getSystem();
  },
  mounted () {
    this.dictionary = this.value;
  },
  methods: {
    // 获取数据字典
    async getSystem () {
      //   const { code, data } = await getDictList(this.dictKey);
      //   if (code != "200") return;
      this.dictionaryOptions = [];
    },
    selectChange (val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="less" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
