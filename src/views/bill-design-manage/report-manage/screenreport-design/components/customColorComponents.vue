<template>
  <div class="custom-color">
    <Button type="primary" size="small" icon="el-icon-plus" plain @click="handleAddClick">新增</Button>
    <Table :columns='columns' :data="formData" style="width: 100%">
      <template slot-scope="{ row }" slot="color">
        <span class="color-box" :style="{background:row.color}"></span>
      </template>
      <template slot-scope="{ row,index }" slot="position">
        <span class="editor" @click="handleEditorClick(index,row)">
          编辑
        </span>
      </template>
      <template slot-scope="{ row,index }" slot="operator">
        <span class="editor" @click="handleDeleteClick(index,row)">
          <i class="el-icon-delete" /> 删除
        </span>
      </template>
    </Table>

    <Modal title="新增" v-model="dialogVisible" width="30%" :before-close="handleClose">
      <Form>
        <FormItem label="颜色">
          <Input v-model="colorValue" style="width: 200px" placeholder="请输入颜色" size="small">
          <template slot="append">
            <ColorPicker v-model="colorValue" :predefine="predefineColors" size="small" />
          </template>
          </Input>
        </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button size="small" @click="dialogVisible = false">取 消</Button>
        <Button size="small" type="primary" @click="handleSaveClick">确 定</Button>
      </span>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "CustomColorComponents",
  model: {
    prop: "formData",
    event: "input"
  },
  props: {
    formData: Array
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
      colorValue: "",
      dialogVisible: false,
      flag: true, // true 新增， false 编辑
      indexEditor: -1, // 编辑第几个数据
      columns: [{
        title: '颜色',
        slot: 'color',
        align: 'center',
      }, {
        title: '位置',
        slot: 'position',
        align: 'center',
      }, {
        title: '操作',
        slot: 'operator',
        align: 'center',
      }]
    };
  },
  mounted () { },
  methods: {
    // 弹出框关闭
    handleClose () {
      this.dialogVisible = false;
      this.colorValue = "";
    },
    // 新增
    handleAddClick () {
      this.colorValue = "";
      this.flag = true;
      this.dialogVisible = true;
    },
    // 确定
    handleSaveClick () {
      if (this.flag) {
        // 新增
        const obj = {
          color: this.colorValue
        };
        this.formData.push(obj);
        this.dialogVisible = false;
      } else {
        // 编辑
        this.formData[this.indexEditor].color = this.colorValue;
        this.dialogVisible = false;
      }
      this.$emit("input", this.formData);
      this.$emit("change", this.formData);
    },
    // 编辑
    handleEditorClick (index, row) {
      this.flag = false;
      this.colorValue = row.color;
      this.dialogVisible = true;
      this.indexEditor = index;
    },
    // 删除
    handleDeleteClick (index) {
      this.formData.splice(index, 1);
      this.$emit("input", this.formData);
      this.$emit("change", this.formData);
    }
  }
};
</script>
<style lang="less" scoped>
.color-box {
  .title {
    display: flex;
    flex-direction: row;
  }
}
.custom-color {
  /deep/.ivu-btn-primary {
    color: #fff;
    background-color: #155697;
    border-color: #155697;
    padding: 0 1.3rem;
    margin-bottom: 0.3rem;
  }
  /deep/.ivu-table {
    background-color: transparent;
  }
  /deep/.ivu-table th {
    background: transparent;
    color: #15b3c8;
    border: 1px solid;
  }
  /deep/.ivu-table-small td {
    height: 40px;
    background: transparent;
    border: 1px solid #15b3c8;
  }
}
/deep/.ColorPicker--mini,
/deep/.ColorPicker--mini .ColorPicker__trigger {
  width: 23px;
  height: 23px;
}
/deep/.Dialog {
  background: #1b1e25;
  .Dialog__title {
    color: #fff;
  }
}
.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 5px;
}
.editor {
  color: #409eff;
  cursor: pointer;
}
</style>
