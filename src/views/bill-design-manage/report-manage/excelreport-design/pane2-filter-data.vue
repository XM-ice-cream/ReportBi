/* 单元格元素过滤数据 */
<template>
  <div class="pane2-filter-data">
    <!-- 左侧抽屉 -->
    <Drawer v-model="drawerFlag" :title="drawerTitle" width="750" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitReq" :model="rightForm" :label-width="110" :label-colon="true" @submit.native.prevent>
        <!-- 自定义分组类型：条件，公式分组 -->
        <FormItem label="父格条件" prop="isFather">
          <Checkbox v-model="rightForm.isFather" size="small">将父格作为过滤条件（适用于父子格来自于同一个数据集）</Checkbox>
        </FormItem>
        <!-- 添加按钮 -->
        <FormItem class="addbtn">
          <Button type="success" class="row-button" @click="addRow(0)" v-if="!tableData.length">
            <Icon type="md-add" />
          </Button>
        </FormItem>
        <!-- 普通的表格 -->
        <Table :columns="columns" :data="tableData" :height="tableConfig.height" :border="tableConfig.border" disabled-hover>
          <!-- 可选列 -->
          <template slot-scope="{ index }" slot="selectItem">
            <Select v-model="tableData[index].selectItem" size="small" transfer>
              <Option v-for="item in selectList.selectItemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
            <Select v-model="tableData[index].type" size="small" transfer>
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
        <FormItem class="addbtn">
          <Button type="success" class="row-button" @click="bracketAdd" :disabled='checkList.length<2'>
            添加括号
          </Button>
          <Button type="success" class="row-button" @click="bracketDelete" :disabled="!checkList.every(item=>item.children)">
            去除括号
          </Button>
        </FormItem>
         <!-- 树状图 -->
        <Tree :data="data" show-checkbox multiple @on-check-change='checkChange' check-strictly @on-contextmenu="handleContextMenu">
            <template #contextMenu>
               <DropdownItem @click.native="handleContextMenuDelete" style="color: #ed4014">删除</DropdownItem>
            </template>
        </Tree>
        
        <!-- 按钮 -->
        <FormItem>
          <drawer-button :text="drawerTitle" class="tree" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
        </FormItem>

      </Form>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "pane2-filter-data",
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
  },
  data () {
    return {
      rightForm: {},
      tableConfig: { ...this.$config.tableConfig }, // table配置
      drawerFlag: false,
      drawerTitle:"过滤数据",
      data: [],//树状图
      checkList: [],//树状图选中
      contextData:[],
      columns: [
        { title: "可选列", slot: "selectItem", minWidth: 100, align: "center" },
        { title: "操作符", slot: "operator", minWidth: 100, align: "center" },
        { title: "类型", slot: "type", minWidth: 100, align: "center" },
        { title: "内容", slot: "content", minWidth: 150, align: "center" },
        { title: "关系", slot: "relation", width: 100, align: "center" },
        { title: "操作", slot: "operation", width: 80, align: "center" },

      ],
      tableData: [
        { selectItem: "apple", operator: "=", type: "string", content: "", relation: "and" },
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
    //更新数据
    submitClick(){
        this.rightForm.filterData = "";
        this.data.forEach(item=>{
            this.rightForm.filterData+=`${item.title} `;
        })
       this.$emit("autoChangeFunc", this.rightForm);
    },
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
    async addRow () {
      const { selectItem, operator, content, relation } = this.tableData[0];

      const curContent = `( ${selectItem} ) ${operator} ${content}`;

      // 是否存在值
      const isExit =await this.getValue(this.data,curContent);
      if(isExit) {
          this.$Message.error("数据已存在！！");
          return;
      }
      //添加值 第一笔不显示and/or
      const obj =this.data.length>0? { title: `${relation}${curContent}`, contextmenu: true } :{title: `${curContent}`, contextmenu: true};
      this.data.push(obj);;
      console.log(this.data);
    },
    //递归判断值是否存在
    getValue(data,e){
       return data.some((item)=>{
            const title = item.title.replace(/^and|^or/g,"");
             if(title === e){
                 return true;
             }else if(item.children){
                 this.getValue(item.children,e)
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
            title = `${item.title.match(reg)||""} (`;
            let index = item.title.indexOf("(");
            item.title = item.title.replace(reg,"");
            title += item.title.substring(
              item.title.indexOf("(", index)
            )
          } else {
            title += ' ' + item.title
          }
        })
        title += ' )';
        let obj = { title, expand: true, children: this.checkList, checked: false ,disableCheckbox:false, contextmenu: true};
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
          if(this.checkList){
            this.checkList.map((item,iIndex) => {
             item?.children?.forEach((cItem,cIndex)=>{ 
                 if(cIndex==0){
                     const reg = /^and|^or/g;
                     data[index+cIndex] = {...cItem,checked : false,disableCheckbox:false,title:`${item.title.match(reg)} ${cItem.title}`};
                 }else{
                    data.splice(index+cIndex,0,{...cItem,checked : false,disableCheckbox:false})
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
        if(item. nodeKey==0){ item.title = item.title.replace(/^and|^or/g,"") }
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
      this.checkList = row.map(item=>{return {...item,disableCheckbox:true}})
    },
    // 树状图 当前节点点击右键时触发
     handleContextMenu (data) {
        this.contextData = data;
    },
    // 树状图删除
    handleContextMenuDelete () {
      this.data.splice( this.contextData.nodeKey, 1);
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = 100;
    },
    // 左侧抽屉取消
    cancelClick () {
      this.drawerFlag = false;
      this.tableData = [{ selectItem: "apple", operator: "=", type: "string", content: "", relation: "add" }];
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
}
/deep/.ivu-table-wrapper {
  margin-bottom: 1rem;
}
/deep/.ivu-tree {
    height: 500px;
    background:#e6fbf2;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 3rem;
    overflow: auto;
}
</style>
