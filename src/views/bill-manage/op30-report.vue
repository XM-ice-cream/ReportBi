/* OP30看板 */
<template>
  <div class="page-style op30-report">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="340" trigger="manual">
            <Button type="primary" icon="ios-search" @click="poptipModal = !poptipModal">{{ $t("selectQuery") }}</Button>
            <div class="poptip-style-content" slot="content">
              <Form class="poptip-style-content" ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                <!-- 开始日期 -->
                <FormItem :label="$t('startTime')" prop="startTime" v-show="!req.isAuto">
                  <DatePicker transfer v-model="req.startTime" type="datetime" :options="$config.datetimeOptions" :placeholder="$t('pleaseSelect') + $t('startTime')"></DatePicker>
                </FormItem>
                <!-- 结束日期 -->
                <FormItem :label="$t('endTime')" prop="endTime">
                  <DatePicker transfer v-model="req.endTime" type="datetime" :options="$config.datetimeOptions" :placeholder="$t('pleaseSelect') + $t('endTime')"></DatePicker>
                </FormItem>
                <!-- 时间间隔(h) -->
                <FormItem :label="$t('dateSpace')" prop="autoRefreshTime" v-show="req.isAuto">
                  <InputNumber v-model="req.autoRefreshTime" :min="1" />
                </FormItem>
                <!-- 线体 -->
                <FormItem :label="$t('line')" prop="lineId">
                  <Select v-model="req.lineId" filterable clearable :placeholder="$t('pleaseSelect') + $t('line')" @on-select="lineSelect">
                    <Option v-for="(item, index) in lineList" :value="item.id" :key="index">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <!-- 制程 -->
                <FormItem :label="$t('processName')" prop="processId">
                  <treeselect style="width: 200px;" v-model="req.processId" :options="processList" :show-count="true" :disable-branch-nodes="true" transfer @input="processInput" @select="processSelect" :placeholder="$t('pleaseSelect') + $t('processName')" />
                </FormItem>
                <!-- 是否自动 -->
                <FormItem :label="$t('isAuto')">
                  <i-switch size="large" v-model="req.isAuto" :true-value="1" :false-value="0" @on-change="isAutoChange">
                    <span slot="open">{{ $t("auto") }}</span>
                    <span slot="close">{{ $t("reverseAuto") }}</span>
                  </i-switch>
                </FormItem>
                <div class="poptip-style-button">
                  <Button @click="resetClick">{{ $t("reset") }}</Button>
                  <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                </div>
              </Form>
            </div>
          </Poptip>
        </div>
        <!-- 图表 -->
        <div class="op30-charts">
          <!-- 柱状图 -->
          <div class="left-chart">
            <BarOp30 ref="barOp30" style="width: 900px;height: 400px;" :data="barData" index="BarOp30" />
          </div>
          <!-- 饼图 -->
          <div class="right-chart">
            <PieOp30 ref="pieOp30" style="width: 400px;height: 400px;" :data="pieData" index="PieOp30" />
          </div>
        </div>
        <!-- 页面表格 -->
        <Table border :height="tableHeight" :loading="tableLoading" :columns="columns" :data="data" highlight-row @on-current-change="currentClick">
          <template slot-scope="{row}" slot="yieldRate">
            <span>{{ row.yieldRate | percent }}</span>
          </template>
        </Table>
      </Card>
    </div>
  </div>
</template>

<script>
import { getlistReq, getcoutbymachineReq, getpagelistReq } from "@/api/bill-manage/op30-report";
import { getlisttreeReq } from "@/api/basis-info/zone-manage";
import { formatDate, treeLoop } from '@/libs/tools'
import PieOp30 from '@/components/echarts/pie-op30'
import BarOp30 from '@/components/echarts/bar-op30'

export default {
  name: "op30-report",
  components: { PieOp30, BarOp30 },
  data () {
    return {
      tableHeight: 200,
      tableLoading: false, // table加载动画
      poptipModal: false,
      op30Time: null, // 定时器
      data: [], // 表格数据
      columns: [
        {
          type: "index", width: 50, align: "center",
          indexMethod: (row) => {
            return (this.req.pageIndex - 1) * this.req.pageSize + row._index + 1;
          },
        },
        { title: this.$t("dateRange"), key: "dateRange", align: "center", minWidth: 300, },
        { title: this.$t("line"), key: "lineName", align: "center", minWidth: 140, },
        { title: this.$t("pn"), key: "partName", align: "center", minWidth: 140, },
        { title: this.$t("processName"), key: "curProcessName", align: "center", minWidth: 140, },
        { title: this.$t("passCount"), key: "passCount", align: "center", minWidth: 100, },
        { title: this.$t("defectCount"), key: "defectCount", align: "center", minWidth: 100, },
        { title: this.$t("yieldRate"), slot: "yieldRate", align: "center", minWidth: 100, },
      ],
      req: {
        systemFlag: this.$store.state.systemFlag,
        startTime: '', //开始日期
        endTime: '', //结束日期
        lineId: '', //线体
        lineName: '', //线体
        processId: null, //制程
        processName: '', //制程
        isAuto: 0, //刷新时间
        autoRefreshTime: 1, //刷新时间
        ...this.$config.pageConfig,
      },
      lineList: [], // 线体列表
      processList: [], // 制程列表
      pieData: {
        yieldRate: 0,
        badRate: 0,
      }, // 饼图数据
      barData: {
        xAxisData: [],
        defectCountData: [],
        passCountData: [],
        allCountData: [],
      }, // 柱状图数据
    };
  },
  activated () {
    this.getLineList()
    this.getProcessList()
    this.isAutoChange(this.isAuto)
  },
  deactivated () {
    this.poptipModal = false
    this.isAutoChange(0)
  },
  methods: {
    // 获取列表数据
    pageLoad () {
      // 开启自动
      if (this.req.isAuto && this.req.endTime) {
        this.req.startTime = new Date(new Date(this.req.endTime).getTime() - this.req.autoRefreshTime * 3600 * 1000)
      }
      if (!this.req.startTime) return this.$Msg.warning('选择开始日期')
      if (!this.req.endTime) return this.$Msg.warning('选择结束日期')
      if (!this.req.lineId) return this.$Msg.warning('请选择线体')
      if (!this.req.processId) return this.$Msg.warning('请选择制程')
      let params = {
        startTime: formatDate(this.req.startTime),
        endTime: formatDate(this.req.endTime),
        lineId: this.req.lineId,
        lineName: this.req.lineName,
        processId: this.req.processId,
        processName: this.req.processName,
      };
      // let params = {
      //   startTime: '2020-06-19 10:07:39',
      //   endTime: '2021-10-18 10:07:39',
      //   lineId: '178519531927642112',
      //   processId: '178502827382018048'
      // };
      // 获取表格数据
      getlistReq(params).then((res) => {
        if (res.code === 200) {
          this.data = res.result.map(o => {
            return { ...o, dateRange: `${params.startTime} ~ ${params.endTime}` }
          })
          // 饼图数据
          this.getPieData(this.data[0])
        }
      });
      // 柱状图数据
      this.getBarData(params)
    },
    // 获取饼图数据
    getPieData (opt = {}) {
      this.pieData.yieldRate = opt?.yieldRate * 100 || 50
      this.pieData.badRate = 100 - this.pieData.yieldRate
      this.$nextTick(() => this.$refs.pieOp30.initChart())
    },
    // 获取柱状图数据
    getBarData (params = {}) {
      getcoutbymachineReq(params).then(res => {
        const data = res.result || []
        this.barData.xAxisData = data.map(o => `${o?.machineId}(${o?.eqpRemark})`)
        this.barData.defectCountData = data.map(o => o.defectCount)
        this.barData.passCountData = data.map(o => o.allCount - o.defectCount)
        this.barData.allCountData = data.map(o => o.allCount)
        this.$nextTick(() => this.$refs.barOp30.initChart())
      })
    },
    // 获取线体数据
    getLineList () {
      const { orderField, ascending, pageSize, pageIndex, systemFlag } = this.req
      const obj = {
        orderField,
        ascending,
        pageSize,
        pageIndex,
        data: { enabled: 1, systemFlag, category: 4 }
      }
      getpagelistReq(obj).then(res => {
        if (res.code === 200) {
          this.lineList = res.result.data || {}
        }
      })
    },
    // 获取线体名称
    lineSelect (val) {
      this.req.lineName = val.label
    },
    // 获取制程数据
    getProcessList () {
      const obj = {
        systemFlag: this.req.systemFlag,
        id: "",
        parentId: "0",
        name: "",
        category: 0,
        enabled: -1,
      };
      getlisttreeReq(obj).then(res => {
        if (res.code === 200) {
          this.processList = []
          const arr = ['BE', 'Encap', 'SMT']
          const processData = res.result.filter(o => arr.includes(o.name))
          treeLoop(this.processList, processData, (node) => {
            node.label = node.name;
          });
        }
      })
    },
    // 制程选择操作
    processInput (value) {
      if (!value) {
        this.req.processId = null;
      }
    },
    // 制程选择操作
    processSelect (value) {
      this.req.processName = value.label
    },
    // 是否自动
    isAutoChange (value) {
      this.op30Time && clearInterval(this.op30Time)
      if (value) {
        this.op30Time = setInterval(() => {
          this.pageLoad()
        }, 60 * 1000)
      }
    },
    // 选择第几页
    currentClick (currentRow) {
      // 更新饼图数据
      this.getPieData(currentRow)
      // 更新柱状图图数据
      const dateRange = currentRow.dateRange.split(' ~ ')
      const params = {
        startTime: dateRange[0],
        endTime: dateRange[1],
        lineId: currentRow.lineId,
        lineName: currentRow.lineName,
        processId: currentRow.curProcessId,
        processName: currentRow.curProcessName,
        partId: currentRow.partId,
        partName: currentRow.partName,
      };
      this.getBarData(params)
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields()
    },
    // 点击搜索按钮触发
    searchClick () {
      this.poptipModal = false;
      this.pageLoad();
    },
  },
};
</script>
<style scoped lang="less">
.op30-charts {
  display: flex;
  justify-content: flex-start;
}
</style>
