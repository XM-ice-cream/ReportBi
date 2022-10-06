<template>
   <!-- 数据集管理弹框--表格 -->
    <Modal title="数据集管理" v-model="outerVisible" class="tableModal">
      <div class="tableTabs">
        <Tabs>
          <TabPane label="数据集" :index="1" name="数据集">
            <Form :label-width="150" :label-colon="true" inline @keyup.enter.native="queryAllDataSet">
              <FormItem label="数据集名称">
                <Input type="text" v-model="req.setName" cleabler />
              </FormItem>
              <FormItem label="数据集编码">
                <Input type="text" v-model="req.setCode" cleabler />
              </FormItem>
              <FormItem label="数据源编码">
                <Input type="text" v-model="req.sourceCode" cleabler />
              </FormItem>
            </Form>
            <!-- 数据集表格 -->
            <div class="dataset-table">
              <ul>
                <draggable v-model="setParamListC" :group="{name:'dataset',pull:'clone'}">
                  <li :key="index" v-for="(item,index) in setParamListC">{{item.setName}}</li>
                </draggable>
              </ul>
              <Spin size="large" class="loading" v-if="setParamListC.length==0"></Spin>
              <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
            </div>
            <!-- 数据集拖拽显示的列 -->
            <div class="dataset-draggable">
              <draggable :group="{name:'dataset'}" class="dataset-item" v-model="dataBaseList" chosenClass="item">
                <div v-for="(item,index) in dataBaseList" :key="index">{{item.setName}}</div>
              </draggable>
            </div>
          </TabPane>
          <TabPane label="对应关系" :index="2" name="对应关系" v-if="dataSetDataList.length>0">
            <template v-for="(item,index) in dataSetDataList" >
              <Form :label-width="80" :label-colon="true"  inline>
                <FormItem label="数据集1">
                  <Select v-model="dataSetDataList[index].setName" clearable filterable transfer @on-change="setCodeChange(index)">
                    <Option v-for="(dataBaseItem, dataBaseIndex) in dataBaseList" :value="dataBaseItem.setName" :key="dataBaseIndex">
                      {{dataBaseItem.setName}}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="类型" :label-width="50">
                  <Select v-model="dataSetDataList[index].type" clearable filterable transfer>
                    <Option v-for="(item, i) in typeList" :value="item.detailName" :key="i">
                      {{ item.detailName }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="数据集2">
                  <Input v-model="dataSetDataList[index].setName2" />
                </FormItem>
                <!-- <span style="display:none">{{index = index +2}}</span> -->
              </Form>
            </template>
          </TabPane>
          <TabPane label="关联参数" :index="3" name="关联参数" v-if="dataSetDataList.length>0">
            <template v-for="(item,itemIndex) in dataSetDataList" >
              <table  style="width: 100%;" class="connection-table">
                <tr>
                  <th>{{item.setName}}</th>
                  <th>操作符</th>
                  <th>{{item.setName2}}</th>
                  <th></th>
                </tr>
                <tr v-for="(fieldItem,fieldIndex) in item.field" :key="fieldIndex">
                  <td>
                    <Select v-model="dataSetDataList[itemIndex].field[fieldIndex].field1" clearable filterable transfer>
                      <Option v-for="(item, i) in item.setCodeList" :value="item" :key="i">{{item}}</Option>
                    </Select>
                  </td>
                  <td>
                    <Select v-model="dataSetDataList[itemIndex].field[fieldIndex].operator" clearable filterable transfer>
                      <Option v-for="(item, i) in selectList" :value="item.detailName" :key="i">
                        {{ item.detailName }}
                      </Option>
                    </Select>
                  </td>
                  <td>
                    <Select v-model="dataSetDataList[itemIndex].field[fieldIndex].field2" clearable filterable transfer>
                      <Option v-for="(item, i) in item.setCode2List" :value="item" :key="i">{{item}}</Option>
                    </Select>
                  </td>
                  <td>
                    <Button type="primary" @click.native="addData(itemIndex)" :key="itemIndex+fieldIndex+'B'"> 添加</Button>
                    &nbsp;&nbsp;
                    <Button type="error" @click.native="deleteData(itemIndex,fieldIndex)" :key="itemIndex+fieldIndex+'D'"> 删除</Button>
                  </td>
                </tr>
              </table>
            </template>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button @click="outerVisible = false">取 消</Button>
        <Button type="primary" @click="checkDataSet">确定 </Button>
      </div>
    </Modal>
</template>
<script>
import { getpagelistReq,getDeatilByIdReq } from "@/api/bill-design-manage/data-set.js";
import { getlistReq as getDataItemReq } from '@/api/system-manager/data-item'
import draggable from "vuedraggable";
 export default {
     name:"dataset-manage",
    components: { draggable},
     data(){
         return {
            outerVisible: false,
            tableConfig: { ...this.$config.tableConfig }, // table配置
             req: {
                sourceCode: "", setCode: "", setName: "",
                ...this.$config.pageConfig,
            },
             dataBaseList: [],//选中数据集列
             dataSetDataList: [],//选中数据集结果集
             dataSetData: [],//数据集
             selectList: [],//操作符下拉
             typeList: [],//连接类型下拉
         }
     },
    computed: {
        setParamListC: {
        get () {
            return [...new Set(this.dataSetData)]
        },
        set () { }
        },
    },
    watch: {
        dataBaseList () {
        this.dataSetDataList = [];
        this.dataBaseList.forEach((item, index) => {
            if (index + 1 !== this.dataBaseList.length) {
            const { setName, setCode } = this.dataBaseList[index + 1];
            Promise.all([this.detail(item.setCode), this.detail(setCode)]).then(res => {
                const obj = {
                setCode: item.setCode,
                setName: item.setName,
                setName2: setName,
                setCode2: setCode,
                setCodeList: res[0].setParamList,
                setCode2List: res[1].setParamList,
                field: !(item?.field || 0) ? [{ field1: "", field2: "", operator: "=" }] : item.field
                }
                this.dataSetDataList[index] = { ...obj };
                this.$nextTick(() => {
                this.dataSetDataList = JSON.parse(JSON.stringify(this.dataSetDataList));
                })
            })
            }
        })

        },
    },
     methods: {
            //查看所有数据集
        queryAllDataSet () {
            this.outerVisible = true;
            const { sourceCode, setCode, setName } = this.req;
            let obj = {
                orderField: "setCode", // 排序字段
                ascending: true, // 是否升序
                pageSize: this.req.pageSize, // 分页大小
                pageIndex: this.req.pageIndex, // 当前页码
                data: { sourceCode, setCode, setName },
            };
            getpagelistReq(obj).then(res => {
                if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.dataSetData = data || [];
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
                }
            })
        },
        //拖拽选择的数据集
        addData (index) {
            this.dataSetDataList[index].field.push({ field1: "", field2: "", operator: "=" });
            this.$forceUpdate();
        },
        //删除数据集
        deleteData (index, fieldIndex) {
            //至少要有一个关联数据
            //   if (this.dataSetDataList[index].field.length == 1) {
            //     this.$Message.error("至少有一个关联字段，不可删除！");
            //     return;
            //   }
            //删除指定索引数据集字段
            this.dataSetDataList[index].field.splice(fieldIndex, 1)
        },
        //修改setCode,setCodeList
        setCodeChange (index) {
            //获取setName 对应的setCode
            const setCode = this.dataBaseList.filter(item => item.setName === this.dataSetDataList[index].setName)[0].setCode;
            this.dataSetDataList[index].setCode = setCode;
            //修改setCode 对应的字段集合
            this.detail(setCode).then(res => {
                this.dataSetDataList[index].setCodeList = res.setParamList;
                this.$nextTick(() => {
                this.dataSetDataList = JSON.parse(JSON.stringify(this.dataSetDataList));
                })
            })
        },
        
        //选择选中的数据集
        async checkDataSet () {
            this.outerVisible = false;
            if (this.dataBaseList.length > 1) {
                this.$Message.warning("一次最多选择一个数据集");
                this.outerVisible = true;
            } else {
                const setCode = this.dataBaseList[0].setCode;
                let data = await this.detail(setCode);
                // this.dataSet.push(data);
                this.$parent.dataSet.push(data);
            }
        },
        async detail (setCode) {
            const obj = { setCode: setCode };
            return await getDeatilByIdReq(obj).then((res) => {
                if (res.code === 200) {
                const data = res.result;
                return data;
                }
            });
        },
        // 获取业务数据
        async getDataItemData () {
           this.selectList = await this.getDataItemDetailList("dataSetSymbol"); // 操作符
           this.typeList = await this.getDataItemDetailList("dataSetRelationship"); // 获取站点数据
        },
        
        // 获取数据字典数据
        async getDataItemDetailList (itemCode) {
            let arr = [];
            await getDataItemReq({ itemCode, enabled: 1 }).then((res) => {
                if (res.code === 200) {
                arr = res.result || [];
                }
            });
            return arr;
        },
            // 选择第几页
        pageChange (index) {
            this.req.pageIndex = index;
            this.queryAllDataSet();
        },
        // 选择一页有条数据
        pageSizeChange (index) {
            this.req.pageIndex = 1;
            this.req.pageSize = index;
            this.queryAllDataSet();
        },
        
        
     }
 }
</script>
<style lang = "less" scoped>
 .tableModal {
  /deep/ .ivu-modal {
    width: 60% !important;
  }
  /deep/.ivu-tabs .ivu-tabs-tabpane {
    overflow: auto;
  }
  .tableTabs {
    min-height: 500px;
    margin-bottom: 0.5rem;
    height: 500px;
    overflow-y: auto;
    .ivu-tabs {
      height: 100%;
    }
    /deep/ .ivu-tabs .ivu-tabs-content-animated {
      height: calc(100% - 2.5rem);
    }
    .dataset-table,
    .dataset-draggable {
      width: 50%;
      display: inline-block;
      float: left;
      height: 90%;
      ul {
        height: calc(100% - 2rem);
        overflow-y: auto;
        li {
          background: #32dd951f;
          padding: 0.5rem;
          width: 90%;
          margin: 0 auto;
          //   color: #1ec0d1;
          margin-bottom: 0.3rem;
        }
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 20%;
      }
    }
  }
  .dataset-item {
    height: 100%;
    background: #32dd951f;
    border-radius: 10px;
    margin-left: 1.5rem;
    div {
      padding: 0.3rem 0.5rem;
      text-align: center;
      line-height: 2rem;
      border: 1px solid #27ce88;
      border-radius: 1rem;
      display: inline-block;
      margin: 0.5rem;
    }
  }
  .connection-table {
    margin: 1rem 0;
    tr {
      margin: 1rem 0;
    }
  }
  tr .ivu-select {
    padding: 0.5rem;
  }
}
</style>