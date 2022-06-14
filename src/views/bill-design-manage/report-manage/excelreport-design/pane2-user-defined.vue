/* 单元格元素自定义按钮 */
<template>
  <div class="pane2-user-defined">
    <!-- 左侧抽屉 -->
    <Drawer v-model="drawerFlag" title="自定义分组" width="750" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitReq" :model="rightForm" :label-width="110" :label-colon="true" @submit.native.prevent>
        <!-- 自定义分组类型：条件，公式分组 -->
        <FormItem label="自定义分组" prop="userDefinedType">
          <Select v-model="rightForm.userDefinedType" size="small" transfer class="showtype">
            <Option value="condition">条件分组</Option>
            <Option value="formula">公式分组</Option>
          </Select>
        </FormItem>
        <!-- 普通条件类型 -->
        <template v-if="rightForm.userDefinedType==='condition'">
          <FormItem label="类型" prop="type">
            <RadioGroup v-model="rightForm.type" type="button" button-style="solid">
              <Radio label="ordinary">普通</Radio>
              <Radio label="formula">公式</Radio>
            </RadioGroup>
          </FormItem>
          <!-- 添加 -->
          <FormItem class="addbtn">
            <Button type="success" class="row-button" @click="addRowClick(0,'ordinary')" v-if="!tableData.length&&rightForm.type==='ordinary'">
              <Icon type="md-add" />
            </Button>
            <Button type="success" class="row-button" @click="addRowClick(0,'formula')" v-if="!tableData2.length&&rightForm.type==='formula'">
              <Icon type="md-add" />
            </Button>
          </FormItem>
          <!-- 普通的表格 -->
          <Table :columns="columns" :data="tableData" :height="tableConfig.height" :border="tableConfig.border" disabled-hover draggable @on-drag-drop="changeRow" v-if="rightForm.type==='ordinary'">
            <!-- 可选列 -->
            <template slot-scope="{ row,index }" slot="selectItem">
              <Select v-model="tableData[index].selectItem" size="small" transfer>
                <Option v-for="item in selectList.selectItemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </template>
            <!-- 操作符 -->
            <template slot-scope="{ row,index }" slot="operator">
              <Select v-model="tableData[index].operator" size="small" transfer>
                <Option v-for="item in selectList.operatorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </template>
            <!-- 类型 -->
            <template slot-scope="{ row,index }" slot="type">
              <Select v-model="tableData[index].type" size="small" transfer>
                <Option v-for="item in selectList.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </template>
            <!-- 内容 -->
            <template slot-scope="{ row,index }" slot="content">
              <Input v-model="tableData[index].content" v-if="['string','Function','cell'].includes(tableData[index].type)" />
              <InputNumber v-model="tableData[index].content" v-if="tableData[index].type==='int'" />
              <DatePicker transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="tableData[index].content" v-if="tableData[index].type==='date'"></DatePicker>
              <Checkbox v-model="tableData[index].content" v-if="tableData[index].type==='boolean'"></Checkbox>
              <Select v-model="tableData[index].content" size="small" transfer v-if="tableData[index].type==='dataItem'">
                <Option v-for="item in selectList.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </template>
            <!-- 关系 -->
            <template slot-scope="{ row,index }" slot="relation">
              <RadioGroup v-model="tableData[index].relation">
                <Radio label="add">与</Radio>
                <Radio label="or">或</Radio>
              </RadioGroup>
            </template>
            <template slot-scope="{ row,index }" slot="operation">
              <Button type="success" class="row-button" @click="addRowClick(index,'ordinary')">
                <Icon type="md-add" />
              </Button>
              &nbsp;
              <Button type="error" ghost class="row-button" @click="deleteClick(index,'ordinary')">
                <Icon type="md-close" />
              </Button>
            </template>
          </Table>
          <!-- 公式的表格 -->
          <Table :columns="columns2" :data="tableData2" :height="tableConfig.height" :border="tableConfig.border" disabled-hover draggable @on-drag-drop="changeRow" v-if="rightForm.type==='formula'">
            <!-- 公式 -->
            <template slot-scope="{ row,index }" slot="formula">
              <Input v-model="tableData2[index].formula" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
            </template>
            <!-- 定义 -->
            <template slot-scope="{ row,index }" slot="defined">
              <Button type="primary" class="row-button" @click="addRowClick(index)">
                定义
              </Button>
            </template>
            <!-- 关系 -->
            <template slot-scope="{ row,index }" slot="relation">
              <RadioGroup v-model="tableData2[index].relation">
                <Radio label="add">与</Radio>
                <Radio label="or">或</Radio>
              </RadioGroup>
            </template>
            <template slot-scope="{ row,index }" slot="operation">
              <Button type="success" class="row-button" @click="addRowClick(index,'formula')">
                <Icon type="md-add" />
              </Button>
              &nbsp;
              <Button type="error" ghost class="row-button" @click="deleteClick(index,'formula')">
                <Icon type="md-close" />
              </Button>
            </template>
          </Table>

          <Timeline class="timeline">
            <TimelineItem color="green">
              <template #dot>
                <Icon type="ios-pricetags" />
              </template>
              <span>关系列</span>
            </TimelineItem>
            <TimelineItem v-for="(item,index) in connectDate" :key="index">
              <!-- 普通： and (列名.类型) 等于 '123' -->
              <!-- 公式：and 123 -->
              <p class="time">
                {{item.selectItem?(item.relation+' ('+item.selectItem+') '+item.operator+''+item.content):(item.relation+' '+item.formula )}}</p>
            </TimelineItem>
          </Timeline>
        </template>
        <!-- 公式分组 -->
        <template v-else>

        </template>

      </Form>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "pane2-user-defined",
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => { },
    },
  },
  watch: {
    formData: {
      handler () {
        console.log("this.formData", this.formData);
        this.rightForm = { ...this.formData };
      },
      deep: true,
      immediate: true
    },
  },
  computed: {
    connectDate () {
      const temp = this.tableData.concat(this.tableData2);
      return temp;
    }
  },
  data () {
    return {
      rightForm: {},
      tableConfig: { ...this.$config.tableConfig }, // table配置
      drawerFlag: false,
      columns: [
        { title: "可选列", slot: "selectItem", minWidth: 100, align: "center" },
        { title: "操作符", slot: "operator", minWidth: 100, align: "center" },
        { title: "类型", slot: "type", minWidth: 100, align: "center" },
        { title: "内容", slot: "content", minWidth: 150, align: "center" },
        { title: "关系", slot: "relation", width: 100, align: "center" },
        { title: "操作", slot: "operation", width: 80, align: "center" },

      ],
      columns2: [
        { title: "公式", slot: "formula", minWidth: 100, align: "center" },
        { title: "", slot: "defined", width: 50, align: "center" },
        { title: "关系", slot: "relation", width: 100, align: "center" },
        { title: "操作", slot: "operation", width: 80, align: "center" },

      ],
      tableData: [
        { selectItem: "apple", operator: "=", type: "string", content: "", relation: "add" },
      ],
      tableData2: [
        { formula: "sum(123)", relation: "add" },
      ],
      selectList: {
        //可选列集合
        selectItemList: [
          { label: "苹果", value: "apple" },
          { label: "梨", value: "pear" },
          { label: "香蕉", value: "banana" }
        ],
        operatorList: [
          { label: "等于", value: "=" },
          { label: "不等于", value: "!=" },
          { label: "大于", value: ">" },
          { label: "大于或等于", value: ">=" },
          { label: "小于", value: "<" },
          { label: "小于或等于", value: "<=" },
          { label: "开头是", value: "startWith" },
          { label: "开头不是", value: "!startWith" },
        ],
        typeList: [
          { label: "字符串", value: "string" },
          { label: "数字", value: "int" },
          { label: "日期", value: "date" },
          { label: "布尔型", value: "boolean" },
          { label: "公式", value: "Function" },
          { label: "参数", value: "params" },
          { label: "单元格", value: "cell" },
          { label: "数据列", value: "dataItem" },
        ]
      }
    };
  },
  watch: {
    drawerFlag (newValue) {
      if (newValue) {
        if (this.drawerTitle) {
          this.title = this.drawerTitle;
          this.autoSize();
          window.addEventListener('resize', () => {
            this.autoSize();
          })
        }
      }
    },
  },
  mounted () { },
  methods: {
    // 新增
    getColumnsList () {
      this.columns = []
      this.columns = this.data.map(val => ({
        title: val.columnName,
        key: val.columnName,
        required: val.isRequired,
      }))
      this.columns.push({
        title: this.$t("operation"), slot: "operation", width: 130, align: "center"
      },
        {
          fixed: "left",
          title: this.$t("sort"),
          width: 50,
          key: "sort",
          align: "center",
          render: (h, params) => {
            return h("span", {
            }, params.index + 1)
          }
        }
      )
    },
    //编辑
    getEditColumnsList () {
      this.columns = this.data.map(val => ({
        title: val.title,
        key: val.key,
        required: val.required,
      }))
      this.columns.push({
        title: this.$t("operation"), slot: "operation", width: 130, align: "center"
      },
        {
          fixed: "left",
          title: this.$t("sort"),
          width: 50,
          key: "sort",
          align: "center",
          render: (h, params) => {
            return h("span", {
            }, params.index + 1)
          }
        }
      )
    },
    // 新增下一列
    addRowClick (index, type) {
      let rowObj = {}
      if (type === "ordinary") {
        rowObj = { selectItem: "", operator: "=", type: "string", content: "", relation: "" };
        this.tableData.splice(index + 1, 0, rowObj);
        return;
      } else {
        rowObj = { formula: "", relation: "" };
        this.tableData2.splice(index + 1, 0, rowObj);
        return;
      }


    },
    // 删除
    deleteClick (index, type) {
      if (type === "ordinary") {
        this.tableData.splice(index, 1);
      } else {
        this.tableData2.splice(index, 1);
      }

    },
    // 拖动排序
    changeRow (oldIndex, newIndex) {
      oldIndex = parseInt(oldIndex)
      newIndex = parseInt(newIndex)
      if (this.rightForm.type === "ordinary") {
        let oldData = this.tableData[oldIndex]
        this.tableData.splice(oldIndex, 1, this.tableData[newIndex])
        this.tableData.splice(newIndex, 1, oldData)
      } else {
        let oldData = this.tableData2[oldIndex]
        this.tableData2.splice(oldIndex, 1, this.tableData2[newIndex])
        this.tableData2.splice(newIndex, 1, oldData)
      }

    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 200;
      console.log(this.tableConfig.height);
    },
    // 左侧抽屉取消
    cancelClick () {
      this.drawerFlag = false;
    },
  },
};
</script>
<style>
.timeline .ivu-timeline-item-head {
  background-color: #fff0;
  font-size: 1rem;
}
</style>
<style scoped lang="less">
/deep/.ivu-form-item .row-button {
  min-width: 50px;
  background: transparent;
  color: #27ce88;
}
.addbtn {
  text-align: right;
}
/deep/.ivu-table-wrapper {
  margin-bottom: 1rem;
}
.timeline {
  min-height: 27rem;
  max-height: 10rem;
  padding: 1rem;
  background: #27ce882e;
  border-radius: 1rem;
  overflow: auto;
}
</style>
