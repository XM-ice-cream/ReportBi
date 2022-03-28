/* SN 压力测试 看板 */
<template>
  <div class="page-style sn-pressure">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Poptip v-model="poptipModal" class="poptip-style" placement="right-start" width="340" trigger="manual">
            <Button type="primary" icon="ios-search" @click="poptipModal = !poptipModal">{{ $t("selectQuery") }}</Button>
            <div class="poptip-style-content" slot="content">
              <Form class="poptip-style-content" ref="searchReq" :model="req" :label-width="80" :label-colon="true" @submit.native.prevent>
                <!-- 工单ID -->
                <FormItem label="unitId" prop="unitId">
                  <Input v-model="req.unitId" :placeholder="$t('pleaseEnter') +'unitId'" @keyup.native='change' />
                </FormItem>
                <!-- 设备ID -->
                <FormItem label="设备ID" prop="equipmentId">
                  <Select v-model="req.equipmentId" :placeholder="$t('pleaseSelect') + '设备ID'">
                    <Option v-for="(item, i) in equipArrList" :value="item" :key="i">{{ item }}</Option>
                  </Select>
                </FormItem>
                <div class="poptip-style-button">
                  <Button @click="resetClick">{{ $t("reset") }}</Button>
                  <Button type="primary" @click="searchClick">{{ $t("query") }}</Button>
                </div>
              </Form>
            </div>
          </Poptip>
        </div>
        <!-- 柱状图 -->
        <div class="sn-pressure-charts">
          <linePress ref="linePress" :data="lineData" index="linePress" />
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { getpressuredata } from "@/api/bill-manage/sn-pressure";
import linePress from '@/components/echarts/line-snpressure'

export default {
  name: "sn-pressure",
  components: { linePress },
  data () {
    return {
      poptipModal: false,
      req: {
        unitId: '',
        equipmentId: ''
      },
      lineData: {
        yData: [],
        title: '',
        subTitle: '',
        sn: ''
      }, // 柱状图数据
      equipArrList: []//设备下拉框
    };
  },
  deactivated () {
    this.poptipModal = false
  },
  methods: {
    // 获取列表数据
    pageLoad () {
      this.data = [];
      let params = {
        unitId: this.req.unitId,
        equipmentId: this.req.equipmentId,
      };
      if (params.unitId) {
        // 获取表格数据
        getpressuredata(params).then((res) => {

          if (res.code === 200) {
            const data = res.result || []
            this.lineData.yData = data.pressureArr.map((o, oIndex) => [oIndex, Number(o)]);
            this.lineData.title = data.equipmentId;
            this.lineData.subTitle = data.stepName;
            this.lineData.sn = data.unitId;
            this.equipArrList = data.equipArr;
            this.$nextTick(() => this.$refs.linePress.initChart(this.lineData))
          }
        });
      } else {
        this.$Message.warning('请输入查询条件!');
      }

    },
    //设备ID list
    change () {
      this.equipArrList = [];
      this.req.equipmentId = '';
      let params = {
        unitId: this.req.unitId,
        equipmentId: '',
      };
      getpressuredata(params).then((res) => {
        if (res.code === 200) {
          const data = res.result || []
          this.equipArrList = data.equipArr;
        }
      });
    },

    // 点击搜索按钮触发
    searchClick () {
      this.poptipModal = false;
      this.pageLoad();
    },
    resetClick () {
      this.$refs.searchReq.resetFields();
    }
  },
  mounted () {
    this.pageLoad();
  }
};
</script>
<style scoped lang="less">
.sn-pressure {
  width: 100%;
  height: 100%;
  .sn-pressure-charts {
    width: 100%;
    height: 100%;
    background: #8cd7f333;
    border-radius: 10px;
    padding: 10px;
  }
}
</style>
