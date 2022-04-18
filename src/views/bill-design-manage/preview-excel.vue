/* Excel 预览 */
<template>
  <div class="page-style preview-excel">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div class="previewCard">
          <div class="cardCell">
            <span class="title">
              <span class="circle">
                <Icon type="ios-albums" />
              </span>
              大屏报表测试
              <span class='title-dot'>
                <Button>
                  <Icon type="md-eye" />预览
                </Button>
                <Button>
                  <Icon type="md-create" />编辑
                </Button>
              </span>
            </span>
            <div class="content">
              <span class="dot">预览</span>
              <span class="dot">编辑</span>
            </div>
          </div>
        </div>
        <page-custom :total="req.total" :totalPage="req.totalPage" :pageIndex="req.pageIndex" :page-size="req.pageSize" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
      </Card>
    </div>
  </div>
</template>

<script>
import { getpagelistReq } from "@/api/bill-design-manage/data-set.js";
import { getButtonBoolean, renderIsEnabled } from "@/libs/tools";


export default {
  components: {},
  name: "previewExcel",
  data () {
    return {
      data: [], // 结果集
      selectObj: null,//表格选中
      req: {
        ...this.$config.pageConfig,
      }, //查询数据

    };
  },
  activated () {
    this.pageLoad();
    getButtonBoolean(this, this.btnData);
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
      this.tableConfig.loading = true;
      const { sourceCode, setCode, setName } = this.req;
      let obj = {
        orderField: "setCode", // 排序字段
        ascending: true, // 是否升序
        pageSize: this.req.pageSize, // 分页大小
        pageIndex: this.req.pageIndex, // 当前页码
        data: {
          sourceCode,
          setCode,
          setName
        },
      };
      getpagelistReq(obj).then((res) => {
        this.tableConfig.loading = false;
        if (res.code === 200) {
          let { data, pageSize, pageIndex, total, totalPage } = res.result;
          this.data = data || [];
          this.req = { ...this.req, pageSize, pageIndex, total, totalPage };
        }
      }).catch(() => (this.tableConfig.loading = false));
      this.searchPoptipModal = false;
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
  height: 100%;
}
</style>
<style scoped lang='less'>
.previewCard {
  height: calc(100% - 40px);
  .cardCell {
    width: 23rem;
    height: 12rem;
    /* background: #ccc; */
    /* border: 1px solid #e9e9e9; */
    /* box-shadow: 3px 0px 14px #dfd0d085; */
    padding: 0.3rem;
    margin: 0.4rem;
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
      border-bottom: 1px solid #cccccc8f;
      .circle {
        width: 3rem;
        height: 3rem;
        line-height: 3rem;
        background: #b6c7e9;
        /* padding: 0.3rem; */
        display: inline-block;
        text-align: center;
        border-radius: 50%;
        i {
          font-size: 1.72rem;
          color: #fff;
        }
      }
      .title-dot {
        display: inline-block;
        float: right;
        line-height: 3rem;
        button {
          border: none;
          //   background: #ccc;
          margin-right: 0.6rem;
          padding: 0.2rem;
        }
        i {
          width: 2rem;
          //   margin-right: 0.5rem;
          height: 100%;
          font-size: 1.12rem;
          //   padding: 0.3rem;
          //   color: #3771f5;
        }
        i:hover {
          color: #3771f5;
          font-size: 1.22rem;
        }
      }
    }
    .content {
      width: 100%;
      height: 2rem;
      /* text-align: center; */
      line-height: 2rem;
      position: absolute;
      /* margin-bottom: 0px; */
      bottom: 1.3rem;
      padding: 0.3rem;
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