<template>
  <div>
    <Button type="primary" size="small" icon="el-icon-plus" plain @click="handleAddClick">新增</Button>
    <el-table :data="formData" style="width: 100%">
      <el-table-column prop="name" label="名称" width="60" />
      <el-table-column prop="key" label="key值" width="70" />
      <el-table-column prop="width" label="宽度" width="50" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div class="button-group">
            <Button @click="handleEditorClick(scope.$index, scope.row)" type="text" size="small">编辑</Button>
            <Button type="text" size="small" @click="handleDeleteClick(scope.$index, scope.row)">删除</Button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <Modal title="新增" :v-model="dialogVisible" width="30%" :before-close="handleClose">
      <Form :model="rowFormData" label-width="50px">
        <FormItem label="名称:">
          <Input v-model.trim="rowFormData['name']" placeholder="请输入名称" size="small">
          </Input>
        </FormItem>
        <FormItem label="key值:">
          <Input v-model.trim="rowFormData['key']" placeholder="请输入key值" size="small">
          </Input>
        </FormItem>
        <FormItem label="宽度:">
          <Input v-model.trim="rowFormData['width']" placeholder="请输入宽度" size="small">
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
  name: 'dynamicAddTable',
  model: {
    prop: "formData",
    event: "input"
  },
  props: {
    formData: Array
  },
  data () {
    return {
      dialogVisible: false,
      rowFormData: {
        name: "",
        key: "",
        width: ""
      },
      flag: true, // true 新增， false 编辑
      indexEditor: -1, // 编辑第几个数据
      tableData: []
    };
  },
  methods: {
    // 新增
    handleAddClick () {
      this.rowFormData = {};
      this.flag = true;
      this.dialogVisible = true;
    },
    // 编辑
    handleEditorClick (index, row) {
      this.flag = false;
      this.rowFormData = this.deepClone(row);
      this.indexEditor = index;
      this.dialogVisible = true;
    },
    // 关闭
    handleClose () {
      this.dialogVisible = false;
    },
    // 保存
    handleSaveClick () {
      if (this.flag) {
        // 新增
        this.formData.push(this.rowFormData);
        this.dialogVisible = false;
      } else {
        // 编辑
        this.formData[this.indexEditor] = this.rowFormData;
        this.$set(this.formData, this.indexEditor, this.rowFormData);
        this.dialogVisible = false;
      }
      this.$emit("input", this.formData);
      this.$emit("change", this.formData);
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
/deep/::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 0; // 横向滚动条
  height: 8px; // 纵向滚动条 必写
}
// 滚动条的滑块
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(144, 146, 152, 0.3);
}
/deep/.el-table,
/deep/.el-table__expanded-cell,
/deep/.el-table th,
/deep/.el-table tr {
  background-color: transparent !important;
  color: #859094 !important;
  font-size: 12px !important;
}
/deep/.el-table td,
/deep/.el-table th.is-leaf {
  border-bottom: none;
  line-height: 26px;
}
/deep/.el-table tbody tr:hover {
  background-color: #263445 !important;
}
/deep/.el-table tbody tr:hover > td {
  background-color: #263445 !important;
}
/deep/.el-table::before {
  height: 0;
}
.button-group .Button {
  padding: 0;
}
</style>
