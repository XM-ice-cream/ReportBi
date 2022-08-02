/* 单元格元素过滤数据 */
<template>
  <div class="condition-setting" v-if="drawerFlag">
    <!-- 表格 -->
    <Table :columns="columns" :data="tableData" :height="70" :border="tableConfig.border" disabled-hover>
      <!-- 可选列 -->
      <template slot-scope="{ index }" slot="selectItem" v-if="type">
        <Select v-model="tableData[index].selectItem" size="small" transfer filterable>
          <Option v-for="item in selectItemList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </template>
      <!-- 操作符 -->
      <template slot-scope="{ index }" slot="operator">
        <Select v-model="tableData[index].operator" size="small" transfer>
          <Option v-for="item in selectList.operatorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
      <!-- 类型 -->
      <template slot-scope="{ index }" slot="type">
        <Select v-model="tableData[index].type" size="small" transfer @on-change="tableData[index].content=''">
          <Option v-for="item in selectList.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
      <!-- 内容 -->
      <template slot-scope="{ index }" slot="content">
        <Input v-model="tableData[index].content" v-if="['string','Function','cell'].includes(tableData[index].type)" />
        <InputNumber v-model="tableData[index].content" v-if="tableData[index].type==='int'" />
        <DatePicker transfer type="datetime" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="tableData[index].content" v-if="tableData[index].type==='date'"></DatePicker>
        <Checkbox v-model="tableData[index].content" v-if="tableData[index].type==='boolean'"></Checkbox>
        <Select v-model="tableData[index].content" size="small" transfer v-if="tableData[index].type==='dataItem'">
          <Option v-for="item in selectList.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
      <!-- 关系 -->
      <template slot-scope="{ index }" slot="relation">
        <RadioGroup v-model="tableData[index].relation">
          <Radio label="and">与</Radio>
          <Radio label="or">或</Radio>
        </RadioGroup>
      </template>
      <template slot-scope="{ index }" slot="operation">
        <Button type="success" class="row-button" @click="addRow(index)">
          <Icon type="md-add" />
        </Button>
      </template>
    </Table>
    <!-- 添加括号/去除括号 -->
    <div class="addbtn">
      <Button type="success" class="row-button" @click="bracketAdd" :disabled='checkList.length<2'>
        添加括号
      </Button>
      &nbsp;&nbsp;
      <Button type="success" class="row-button" @click="bracketDelete" :disabled="!checkList.every(item=>item.children)">
        去除括号
      </Button>
    </div>
    <!-- 树状图 -->
    <Tree :data="data" show-checkbox multiple @on-check-change='checkChange' check-strictly @on-contextmenu="handleContextMenu">
      <template #contextMenu>
        <DropdownItem @click.native="handleContextMenuDelete" style="color: #ed4014">删除</DropdownItem>
      </template>
    </Tree>
    <!-- </Form> -->
  </div>
</template>

<script>
import { formatDate } from "@/libs/tools";

export default {
  name: "condition-setting",
  components: {},
  props: {
    type: {
      type: String,
      default: ""
    },
    drawerFlag: {
      type: Boolean,
      default: false,
    },
    selectItemList: {
      type: Array,
      default: () => [],
    },
    rightForm: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    "data.length": {
      handler () {
        this.$emit("updateData", this.data)
      },
      deep: true,
      immediate: true,
    },
    drawerFlag (newVal) {
      if (newVal) {
        if (!this.type) {
          this.columns = this.columns.filter(item => item.slot !== "selectItem");
        }
        if (this.rightForm) {
          this.data = [...this.rightForm];
        }
      } else {
        this.cancelClick();
      }
    }
  },
  computed: {
  },
  data () {
    return {
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [],//树状图
      checkList: [],//树状图选中
      contextData: [],
      columns: [
        { title: "可选列", slot: "selectItem", width: 100, align: "center" },
        { title: "操作符", slot: "operator", width: 110, align: "center" },
        { title: "类型", slot: "type", width: 80, align: "center" },
        { title: "内容", slot: "content", minWidth: 150, align: "center" },
        { title: "关系", slot: "relation", width: 100, align: "center" },
        { title: "操作", slot: "operation", width: 80, align: "center" },

      ],
      tableData: [{ selectItem: "", operator: "=", content: "", relation: "and", type: "string" }],
      selectList: {
        //可选列集合
        operatorList: [
          { label: "等于", value: "=" },
          { label: "不等于", value: "!=" },
          { label: "大于", value: ">" },
          { label: "大于或等于", value: ">=" },
          { label: "小于", value: "<" },
          { label: "小于或等于", value: "<=" },
          { label: "开头是", value: "startWith" },
          { label: "开头不是", value: "!startWith" },
          { label: "包含", value: "include" },
          { label: "不包含", value: "!include" },
          { label: "包含于", value: "include in" },
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
  mounted () { },
  methods: {
    // 新增下一列
    async addRow () {
      let { selectItem, operator, content, relation, type } = this.tableData[0];
      if (type === "date") content = formatDate(content);

      const curContent = this.type ? `( ${selectItem} ) ${operator} ${content}` : `${operator} ${content}`;
      // 是否存在值
      const isExit = await this.getValue(this.data, curContent);
      if (isExit) {
        this.$Message.error("数据已存在！！");
        return;
      }

      //处理数据为js逻辑表达式
      let logic = this.getLogic(type, selectItem, operator, content);

      //添加值 第一笔不显示and/or
      const obj = this.data.length > 0 ? { title: `${relation} ${curContent}`, contextmenu: true, logic: `${relation} ${logic}` } : { title: `${curContent}`, contextmenu: true, logic };
      this.data.push(obj);;
    },
    //处理数据为js逻辑表达式
    getLogic (type, selectItem, operator, content) {
      let logic = "";
      const val = type === "string" ? `"${content}"` : (type === "date" ? `new Date("${content}")` : content);
      const item = type === "date" ? `new Date(( ${selectItem} ))` : `( ${selectItem} )`;
      //开头不是
      if (operator === "!startWith") {
        logic = `${item}.indexOf(${val}) !==0`;
      }
      //开头是
      if (operator === "startWith") {
        logic = `${item}.indexOf(${val}) ===0`;
      }
      // 等于
      if (operator === "=") {
        logic = `${item}===${val}`;
      }
      // 不等于
      if (operator === "!=") {
        logic = `${item}!==${val}`;
      }
      // 大于
      if (operator === ">") {
        logic = `${item} > ${val}`;
      }
      // 大于或等于
      if (operator === ">=") {
        logic = `${item} >= ${val}`;
      }
      // 小于
      if (operator === "<") {
        logic = `${item} < ${val}`;
      }
      // 小于或等于
      if (operator === "<=") {
        logic = `${item} <= ${val}`;
      }
      //包含
      if (operator === "include") {
        logic = `${item}.indexOf(${val}) !==-1`;
      }
      //不包含
      if (operator === "!include") {
        logic = `${item}.indexOf(${val}) ===-1`;
      }
      //包含于
      if (operator === "include in") {
        logic = `${val}.indexOf(${item}) !==-1`;
      }
      console.log(logic);
      return logic;
    },
    //递归判断值是否存在
    getValue (data, e) {
      return data.some((item) => {
        const title = item.title.replace(/^and|^or/g, "");
        if (title === e) {
          return true;
        } else if (item.children) {
          this.getValue(item.children, e)
        }
      })

    },
    //括号的添加
    async bracketAdd () {
      let callback = ({ data, index }) => {
        let title = "";
        this.checkList.map((item, index) => {
          item.checked = false
          if (index == 0) {
            const reg = /^and|^or/g;
            title = `${item.title.match(reg) || ""} (`;
            let index = item.title.indexOf("(");
            item.title = item.title.replace(reg, "");
            title += item.title.substring(
              item.title.indexOf("(", index)
            )
          } else {
            title += ' ' + item.title
          }
        })
        title += ' )';
        let obj = { title, expand: true, children: this.checkList, checked: false, disableCheckbox: false, contextmenu: true };
        data[index] = { ...data[index], ...obj };
      };
      let callback1 = ({ data, index }) => {
        data.splice(index, 1)
      };
      await this.checkList.map((item, index) => {
        if (index > 0) {
          this.getActionData(this.data, item, callback1)
        }
      })
      await this.getActionData(this.data, this.checkList[0], callback)
      this.checkList = [];

      await this.getActionData(this.data, this.checkList[0], callback);

      this.data = JSON.parse(JSON.stringify(this.data));

    },
    // 括号的删除
    async bracketDelete () {
      let callback = ({ data, index }) => {
        if (this.checkList) {
          this.checkList.map((item, iIndex) => {
            item?.children?.forEach((cItem, cIndex) => {
              if (cIndex == 0) {
                const reg = /^and|^or/g;
                data[index + cIndex] = { ...cItem, checked: false, disableCheckbox: false, title: `${item.title.match(reg) || ""} ${cItem.title}` };
              } else {
                // 指定位置插入数据
                data.splice(index + cIndex, 0, { ...cItem, checked: false, disableCheckbox: false })
              }
            })
          })
        }

      };

      await this.getActionData(this.data, this.checkList[0], callback);

      this.checkList = [];

      await this.getActionData(this.data, this.checkList[0], callback);

      this.data = JSON.parse(JSON.stringify(this.data));
    },
    //递归获取操作的数据后执行 callback 操作
    getActionData (data, e, callback) {
      data.some((item, index) => {
        if (item.nodeKey == 0) { item.title = item.title.replace(/^and|^or/g, "") }
        if (item?.title === e?.title) {
          callback({ data, item, index });
          return true;
        } else if (item.children) {
          this.getActionData(item.children, e, callback);
        }
      });
    },
    // 树节点 checkBox
    checkChange (row) {
      this.checkList = row.map(item => { return { ...item, disableCheckbox: true } })
    },
    // 树状图 当前节点点击右键时触发
    handleContextMenu (data) {
      this.contextData = data;
    },
    // 树状图删除
    handleContextMenuDelete () {
      this.data.splice(this.contextData.nodeKey, 1);
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = 20;
    },
    // 左侧抽屉取消
    cancelClick () {
      this.drawerFlag = false;
      this.tableData = [{ selectItem: "", operator: "=", type: "string", content: "", relation: "and" }];
      this.data = [];
    },
  },
};
</script>
<style>
</style>
<style scoped lang="less">
/deep/.ivu-form-item .row-button {
  min-width: 50px;
  background: #27ce88;
  margin-right: 0.3rem;
}
.addbtn {
  text-align: right;
  margin-bottom: 0.6rem;
}
/deep/.ivu-table-wrapper {
  margin-bottom: 1rem;
}
/deep/.ivu-tree {
  height: 500px;
  background: #e6fbf2;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 3rem;
  overflow: auto;
}
</style>
