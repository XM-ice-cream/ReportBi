<template>
  <div>
    <Button type="primary" size="small" icon="el-icon-plus" plain @click="handleAddClick" style="margin-bottom: 0.3rem">新增</Button>
    <Table border :columns='columns' :data="formData" style="width:100%">
      <template slot-scope='{ row, index }' slot='operator'>
        <div class="button-group">
          <Button @click="handleEditorClick(index, row)" type="text" size="small">编辑</Button>
          <Button type="text" size="small" @click="handleDeleteClick(index,row)">删除</Button>
        </div>

      </template>

    </Table>
    <Modal title="新增" v-model="dialogVisible" width="30%" :before-close="handleClose">
      <Form :model="rowFormData" :label-width="50">
        <FormItem label="名称:">
          <Input type='text' v-model.trim="rowFormData['name']" placeholder="请输入名称" size="small">
          </Input>
        </FormItem>
        <FormItem label="key值:">
          <Input type='text' v-model.trim="rowFormData['key']" placeholder="请输入key值" size="small">
          </Input>
        </FormItem>
        <FormItem label="宽度:">
          <Input type='text' v-model.trim="rowFormData['width']" placeholder="请输入宽度" size="small">
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
      tableData: [],
      columns: [
        { title: '名称', key: 'name', align: 'center', tooltip: true, ellipsis: true },
        { title: 'key值', key: 'key', align: 'center', tooltip: true, ellipsis: true },
        { title: '宽度', key: 'width', align: 'center', tooltip: true, ellipsis: true },
        { title: '操作', slot: 'operator', align: 'center', tooltip: true, ellipsis: true, width: '80' }
      ]
    };
  },
  methods: {
    // 新增
    handleAddClick () {
      console.log('handleAddClick');
      this.rowFormData = {
        name: "",
        key: "",
        width: ""
      };
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
      console.log(this.formData, this.indexEditor, this.rowFormData);
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

.button-group .Button {
  padding: 0;
}
</style>
