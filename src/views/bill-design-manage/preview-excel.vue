/* Excel 预览 */
<template>
  <div class="page-style preview-excel">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Form ref="searchReq" :model="req" inline :label-width="80" :label-colon="true" @submit.native.prevent @keyup.native.enter="searchClick">
            <!-- 类型 -->
            <FormItem :label="$t('reportType')" prop="reportType">
              <RadioGroup v-model="req.reportType" type="button" button-style="solid" @on-change='searchClick'>
                <Radio label="excel">Excel</Radio>
                <Radio label="largescreen">大屏</Radio>
              </RadioGroup>
            </FormItem>
            <!-- 报表名称 -->
            <FormItem :label="$t('reportName')" prop="reportName">
              <Input v-model="req.reportName" clearable :placeholder="$t('pleaseEnter') + $t('reportName')" @on-search="searchClick" />
            </FormItem>
            <!-- 报表编码 -->
            <FormItem :label="$t('reportCode')" prop="reportCode">
              <Input v-model="req.reportCode" clearable :placeholder="$t('pleaseEnter') + $t('reportCode')" @on-search="searchClick" />
            </FormItem>
            <!-- 按钮 -->
            <Button type="primary" @click="searchClick()">{{ $t("query") }}</Button>
          </Form>
        </div>
        <!-- 预览Card -->
        <div class="previewCard">
          <template v-for="(item,index) in data">
            <div class="cardCell" :key="index">
              <span class="title">
                <span class="circle">
                  <Icon type="ios-albums" />
                </span>
                <span class="name" :title="item.reportName">
                  {{item.reportName}}
                </span>
                <span class='title-dot'>
                  <Button @click="preview(item.reportCode)">
                    <Icon type="md-eye" />预览
                  </Button>
                  <!-- <Button @click="design(item.reportCode)">
                    <Icon type="md-create" />设计
                  </Button> -->
                </span>
              </span>
              <div class="content">
                <div>
                  报表类型: <span class="value" style="color: #41ce27;">
                    <template v-if="item.reportType==='excel'">Excel报表</template>
                    <template v-else>大屏报表</template>
                  </span>
                </div>
                <div>
                  报表编码: <span class="value type" :title="item.reportCode">
                    {{item.reportCode}}
                  </span>
                </div>
                <div>
                  创建时间: <span class="value" :title="formatDate(item.createDate)">
                    {{formatDate(item.createDate)}}
                  </span>
                </div>
                <div>
                  修改时间: <span class="value" :title="formatDate(item.createDate)">{{formatDate(item.createDate)}}</span>
                </div>
              </div>
            </div>
          </template>

        </div>
        <page-custom :elapsedMilliseconds="req.elapsedMilliseconds" :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/libs/tools";
import { getpagelistReq } from "@/api/bill-design-manage/report-manage.js";
export default {
  components: {},
  name: "previewExcel",
  data () {
    return {
      data: [], // 结果集
      selectObj: null,//表格选中
      formatDate: formatDate,
      req: {
        reportName: '',
        reportCode: '',
        reportType: 'excel',
        ...this.$config.pageConfig,
      }, //查询数据

    };
  },
  mounted () {
    this.pageLoad();
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 点击搜索按钮触发
    searchClick () {
      this.req.pageIndex = 1;
      this.pageLoad();
    },
    // 获取分页列表数据
    pageLoad () {
      this.data = [];
      //   this.tableConfig.loading = true;
      let obj = {
        orderField: "reportType", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          reportType: this.req.reportType,
          reportName: this.req.reportName,
          reportCode: this.req.reportCode,
        },
      };
      getpagelistReq(obj).then((res) => {
        // this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage, elapsedMilliseconds: res.elapsedMilliseconds };
        }
      }).catch();
    },
    //设计
    design (reportCode) {
      const href = this.skipUrl(this.req.reportType + 'Design', reportCode);
      window.open(href, '_blank');
    },
    // 预览
    preview (reportCode) {
      const href = this.skipUrl(this.req.reportType + 'Preview', reportCode);
      window.open(href, '_blank');
    },
    //跳转路径
    skipUrl (key, reportCode) {
      const obj = {
        excelPreview: '/bill-design-manage/excelreport-preview',
        largescreenPreview: '/bill-design-manage/screenreport-preview',
        excelDesign: '/bill-design-manage/excelreport-design',
        largescreenDesign: '/bill-design-manage/screenreport-design'
      }
      const { href } = this.$router.resolve({
        path: obj[key],
        query: { reportCode }
      });
      return href;
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
<style>
.preview-excel .card-style .ivu-card-body {
  height: calc(100% - 50px);
}
</style>
<style scoped lang='less'>
.previewCard {
  height: calc(100% - 40px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow-y: scroll;
  overflow-x: hidden;
  align-content: flex-start;
  .cardCell {
    width: 24rem;
    /* background: #ccc; */
    border: 1px solid #e0e6f1;
    box-shadow: 3px 5px 7px #d0dbf194;
    padding: 0.3rem;
    margin: 0.6rem 0.95rem;
    position: relative;
    background: #f0f5ff;
    border-radius: 12px;
    .title {
      display: inline-block;
      padding: 0.1rem;
      margin: 0.2rem;
      /* margin-left: 0.2rem; */
      padding-bottom: 0.9rem;
      /* border: 2px solid #8adbcc; */
      /* border-radius: 3px; */
      /* border-left: none; */
      font-size: 0.92rem;
      color: #3a3b3ae0;
      font-weight: 600;
      width: 100%;
      //   border-bottom: 1px solid #cccccc8f;
      //圆圈
      .circle {
        width: 3rem;
        height: 3rem;
        line-height: 3rem;
        background: #b6c7e9;
        /* padding: 0.3rem; */
        display: inline-block;
        text-align: center;
        border-radius: 50%;
        margin-right: 0.5rem;
        i {
          font-size: 1.72rem;
          color: #fff;
        }
      }
      //标题名
      .name {
        width: 8rem;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      //操作--预览与编辑
      .title-dot {
        display: inline-block;
        float: right;
        line-height: 3rem;
        button {
          border: none;
          //   background: #ccc;
          margin-right: 0.6rem;
          padding: 0.2rem;
          border-radius: 4px;
        }
        i {
          width: 2rem;
          //   margin-right: 0.5rem;
          height: 100%;
          font-size: 1.12rem;
          //   padding: 0.3rem;
          //   color: #3771f5;
        }
      }
    }
    .content {
      width: 100%;
      /* text-align: center; */
      line-height: 1.7rem;
      /* position: absolute; */
      /* margin-bottom: 0px; */
      /* bottom: 1.3rem; */
      padding: 0.2rem 1rem;
      margin-right: 0.5rem;
      .type {
        background: #5fafb3;
        color: #fff;
      }
      .value {
        display: inline-block;
        width: 8rem;
        text-align: center;
        border-radius: 10px;
        float: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 0.5rem;
      }
      .dot {
        display: inline-block;
        width: 45%;
        /* border: 1px solid #ccc; */
        text-align: center;
        float: left;
        color: #4c83ff;
      }
    }
  }
}
</style>