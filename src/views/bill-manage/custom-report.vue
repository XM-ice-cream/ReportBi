/* 自定义报表 */
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="500" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :rules="ruleValidate" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
                    <FormItem :label="$t('database')" prop="databaseId">
                      <Select transfer v-model="req.databaseId" clearable :placeholder="$t('pleaseSelect') + $t('database')">
                        <Option v-for="(item, i) in databaseData" :value="item.id" :key="i">
                          {{ item.name }}
                        </Option>
                      </Select>
                    </FormItem>
                    <!-- sql -->
                    <FormItem :label="$t('customSQL')" prop="sql">
                      <v-selectpage class="select-page-style" key-field="id" show-field="name" :data="customSQLPageListUrl" v-model="req.sql" @values="sqlOnChange" :placeholder="$t('pleaseSelect') + $t('customSQL')" :result-format="
                          (res) => {
                            return {
                              totalRow: res.total,
                              list: res.data || [],
                            };
                          }
                        ">
                      </v-selectpage>
                    </FormItem>
                    <FormItem :label="item.title" :prop="'parameters.' + [item.parameterName]" :rules="{
                        required: true,
                        type:
                          item.type === 'number'
                            ? 'number'
                            : item.type === 'datetime'
                            ? 'date'
                            : 'string',
                        message: $t('pleaseEnter') + item.title,
                        trigger: 'change',
                      }" v-for="(item, index) in parameterJson" :key="index">
                      <Input v-if="item.type === 'array'" v-model="req.parameters[item.parameterName]" type="textarea" :rows="3" :placeholder="'每行一个' + item.title" />

                      <Input v-if="item.type === 'string'" v-model="req.parameters[item.parameterName]" :placeholder="$t('pleaseEnter') + item.title" />
                      <InputNumber v-if="item.type === 'number'" v-model="req.parameters[item.parameterName]" :placeholder="$t('pleaseEnter') + item.title"></InputNumber>

                      <DatePicker v-if="item.type === 'datetime'" transfer v-model="req.parameters[item.parameterName]" type="datetime" format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('pleaseEnter') + item.title" style="width:100%"></DatePicker>
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="exportClick()">{{ $t("export") }}</Button>
                    <Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
            <i-col span="18">
              <button-custom :btnData="btnData"></button-custom>
            </i-col>
          </Row>
        </div>
        <Table :border="tableConfig.border" :highlight-row="tableConfig.highlightRow" :height="tableConfig.height" :loading="tableConfig.loading" :columns="columns" :data="data"></Table>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import {
  executepagequeryReq,
  exportReq,
  customSQLPageListUrl,
} from "@/api/system-manager/custom-export-sql";
import { getlistReq } from "@/api/system-manager/database-manager";
import { getButtonBoolean, commaSplitString, formatDate, exportFile } from "@/libs/tools";
import dayjs from "dayjs";
export default {
  name: "custom-report",
  data () {
    return {
      customSQLPageListUrl: customSQLPageListUrl(),
      parameterJson: [],
      searchPoptipModal: false,
      noRepeatRefresh: true, //刷新数据的时候不重复刷新pageLoad
      tableConfig: { ...this.$config.tableConfig }, // table配置
      data: [], // 表格数据
      btnData: [],
      databaseData: [], //数据库数据
      req: {
        parameters: {},
        databaseId: "",
        sql: "",
        sqlName: "",
        exportSqlId: "",
        ...this.$config.pageConfig,
      }, //查询数据
      columns: [], // 表格数据
      // 验证实体
      ruleValidate: {
        sql: [
          {
            required: true,
            message: this.$t("pleaseSelect") + this.$t("customSQL"),
            trigger: "change",
          },
        ],
      },
    };
  },
  activated () {
    this.pageLoad();
    this.autoSize();
    window.addEventListener('resize', () => this.autoSize());
    getButtonBoolean(this, this.btnData);
    this.getDatabaseData();
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 获取当前登录用户权限下的所有数据
    getDatabaseData () {
      this.databaseData = [];
      const obj = {
        userId: this.$store.state.id,
        systemFlag: this.$store.state.systemFlag,
      };
      getlistReq(obj).then((res) => {
        if (res.code === 200) {
          this.databaseData = res.result ? res.result : [];
        }
      });
    },
    sqlOnChange (data) {
      this.$refs.searchReq.validateField("sql");
      let { parameterJson, id, name } = (data && data[0]) || {};
      let parameters = {};
      this.parameterJson = parameterJson ? JSON.parse(parameterJson) : [];
      this.parameterJson.map((item) => {
        parameters[item.parameterName] = null;
      });
      this.req = {
        ...this.req,
        exportSqlId: id,
        sqlName: name,
        parameters,
      };
    },
    // 格式化时间
    dateTimeFormat (time) {
      return time && dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    },
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
      this.data = [];
      this.tableConfig.loading = false;
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          this.tableConfig.loading = true;
          let obj = {
            orderField: this.req.orderField, // 排序字段
            ascending: this.req.ascending, // 是否升序
            pageSize: this.req.pageSize, // 分页大小
            pageIndex: this.req.pageIndex, // 当前页码
            data: {
              databaseId: this.req.databaseId,
              exportSqlId: this.req.exportSqlId,
              parameters: {},
            },
          };

          this.parameterJson.map((item) => {
            let queryValue = this.req.parameters[item.parameterName];
            if (item.type === "array" && queryValue) {
              obj.data.parameters[item.parameterName] = commaSplitString(queryValue);
            } else if (item.type === "datetime") {
              obj.data.parameters[item.parameterName] = this.dateTimeFormat(queryValue);
            } else {
              obj.data.parameters[item.parameterName] = queryValue;
            }
          });
          executepagequeryReq(obj)
            .then((res) => {
              this.tableConfig.loading = false;
              if (res.code === 200) {
                let { data, pageSize, pageIndex, total, totalPage } = res.result;
                this.data = data.data || [];
                this.columns = data.columns || [];
                if (this.columns.length) {
                  this.columns.unshift({
                    type: "index",
                    width: 50,
                    align: "center",
                    fixed: "left",
                    indexMethod: (row) => {
                      return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
                    },
                  });
                }
                this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
                this.searchPoptipModal = false;
              }
            })
            .catch(() => (this.tableConfig.loading = false));
        }
      });
    },
    // 导出
    exportClick () {
      this.$refs.searchReq.validate((validate) => {
        if (validate) {
          let obj = {
            databaseId: this.req.databaseId,
            exportSqlId: this.req.exportSqlId,
            parameters: {},
          };

          this.parameterJson.map((item) => {
            let queryValue = this.req.parameters[item.parameterName];
            if (item.type === "array" && queryValue) {
              obj.parameters[item.parameterName] = commaSplitString(queryValue);
            } else if (item.type === "datetime") {
              obj.parameters[item.parameterName] = this.dateTimeFormat(queryValue);
            } else {
              obj.parameters[item.parameterName] = queryValue;
            }
          });

          exportReq(obj).then((res) => {
            let blob = new Blob([res], { type: "application/vnd.ms-excel" });
            const fileName = `${this.req.sqlName}${formatDate(new Date())}.xlsx`; // 自定义文件名
            exportFile(blob, fileName);
          });
        }
      });
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
    },
    // 自动改变表格高度
    autoSize () {
      this.tableConfig.height = document.body.clientHeight - 120 - 60;
    },
    // 选择第几页
    pageChange (index) {
      this.req.pageIndex = index;
      this.pageLoad();
    },
    // 选择一页有条数据
    pageSizeChange (index) {
      this.req.pageIndex = 1;
      this.req.pageSize = index;
      this.pageLoad();
    },
  },
};
</script>
