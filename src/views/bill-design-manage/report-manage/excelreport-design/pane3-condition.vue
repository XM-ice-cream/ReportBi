/* 条件属性设定 */
<template>
  <div class="pane3-condition">
    <!-- 左侧抽屉 -->
    <Drawer v-model="drawerFlag" :title="drawerTitle" width="600" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitReq" :model="rightForm" :label-width="80" :label-colon="true" @submit.native.prevent>
        <FormItem label="属性" prop="type">
          <Select v-model="rightForm.type" size="small" transfer class="showtype" :label-in-value="true" @on-change="typeChange">
            <Option v-for="item in attrList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
      <List class="list" size="small">
        <ListItem class="listItem" v-for="(item,index) in rightForm.types" :key="item.label">
          <Icon type="md-close" class="icon" @click="remove(index)" />
          <span class="name">{{item.label}}:</span>
          <InputNumber v-model="rightForm.types[index].value" class="inputNumber" />
        </ListItem>
      </List>
      <!-- 过滤表格 -->
      <ConditionSetting ref="conditionsetting" @updateData="updateData" :drawerFlag.sync="drawerFlag" :rightForm="rightForm.data" />

      <drawer-button :text="drawerTitle" class="tree" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>

    </Drawer>
  </div>
</template>

<script>
import ConditionSetting from "@/components/condition-setting/condition-setting.vue";

export default {
  name: "pane3-condition",
  components: { ConditionSetting },
  data () {
    return {
      rightForm: {
      },
      tableConfig: { ...this.$config.tableConfig }, // table配置
      drawerFlag: false,
      drawerTitle: "条件属性设定",
      data: [],
      attrList: [
        { label: "", value: "" },
        { label: "行高", value: "rh" },
        { label: "列宽", value: "cw" },
      ],
    };
  },
  mounted () { },
  methods: {
    //更新数据
    submitClick (flag) {
      this.rightForm.filterData = "";
      this.rightForm.data = [...this.data];
      this.data.forEach(item => {
        this.rightForm.filterData += `${item.title} `;
      })
      if (flag) this.cancelClick();
      this.$emit("autoChangeFunc", this.rightForm);
    },
    // 属性下拉框改变
    typeChange (val) {
      if (val) {
        const { label, value } = val
        let obj = { label, type: value, value: 0 };
        if (!this.rightForm.types) this.rightForm.types = [];
        if (label) this.rightForm.types.push(obj);
      }

    },
    //条件设定值 ConditionSetting组件下
    updateData (val) {
      console.log(val);
      this.data = val;
    },
    //删除
    remove (index) {
      this.rightForm.types.splice(index, 1)
    },
    // 左侧抽屉取消
    cancelClick () {
      this.drawerFlag = false;
    },
  },
};
</script>
<style>
</style>
<style scoped lang="less">
.list {
  max-height: 150px;
  overflow-y: auto;
  margin-bottom: 1rem;
  border: 1px solid #dcdee2;
  border-radius: 5px;
  .listItem {
    margin-left: 40px;
    .icon {
      padding: 0.4rem;
      color: red;
      font-weight: bold;
      border: 1px solid #ccc;
      margin-right: 0.3rem;
    }
    .name {
      display: inline-block;
      width: 40px;
    }
    .inputNumber {
      width: 25%;
    }
  }
}

.tree {
  text-align: center;
}
</style>
