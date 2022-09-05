/* Maverick 图表*/
<template>
  <div class="page-style">
    <!-- 页面表格 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <div slot="title">
          <Row>
            <i-col span="6">
              <Poptip v-model="searchPoptipModal" class="poptip-style" placement="right-start" width="400" trigger="manual" transfer>
                <Button type="primary" icon="ios-search" @click.stop="searchPoptipModal = !searchPoptipModal">
                  {{ $t("selectQuery") }}
                </Button>
                <div class="poptip-style-content" slot="content">
                  <Form ref="searchReq" :model="req" :label-width="50" :label-colon="true" :rules="ruleValidate" @submit.native.prevent @keyup.native.enter="searchClick">
                     <!-- 起始时间 -->
                    <FormItem :label="$t('startTime')" prop="startTime">
                        <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('startTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.startTime"></DatePicker>
                    </FormItem>
                    <!-- 结束时间 -->
                    <FormItem :label="$t('endTime')" prop="endTime">
                        <DatePicker transfer type="datetime" :placeholder="$t('pleaseSelect') + $t('endTime')" format="yyyy-MM-dd HH:mm:ss" :options="$config.datetimeOptions" v-model="req.endTime"></DatePicker>
                    </FormItem>
                   <!-- 线体 -->
                    <FormItem label="线体" prop="line">
                      <Select v-model.tirm="req.line" transfer :placeholder="$t('pleaseSelect') + '线体'" clearable @on-change="getStation">
                         <Option v-for="(item,index) in lineList" :key="index" :value="item">{{item}}</Option>
                      </Select>
                    </FormItem>                    
                    <!-- 站点 -->
                    <FormItem label="站点" prop="station">
                      <Select v-model.tirm="req.station" transfer :placeholder="$t('pleaseSelect') + '站点'" clearable @on-change="getModel">
                         <Option v-for="(item,index) in stationList" :key="index" :value="item">{{item}}</Option>
                      </Select>
                    </FormItem>
                    <!-- 机种 -->
                    <FormItem label="机种" prop="model">
                      <Select v-model.tirm="req.model" transfer :placeholder="$t('pleaseSelect') + '机种'" clearable>
                         <Option v-for="(item,index) in modelList" :key="index" :value="item">{{item}}</Option>
                      </Select>
                    </FormItem>
                  </Form>
                  <div class="poptip-style-button">
                    <Button @click="resetClick()">{{ $t("reset") }}</Button>
                    <Button type="primary" @click="pageLoad()">{{ $t("query") }}</Button>
                  </div>
                </div>
              </Poptip>
            </i-col>
          </Row>
        </div>
             <LineMaverick style="height:100%;width:100%" :data="lineData" ref="lineMaverick" index="1"/>
      </Card>  
    </div>
  </div>
</template>

<script>
import { getpagelistReq ,getLineReq,getStationReq,getModelReq} from "@/api/bill-manage/maverick-report.js";
import {  getButtonBoolean,formatDate } from "@/libs/tools";
import LineMaverick from "@/components/echarts/line-maverick.vue";
export default {
  name: "maverick-email-setting",
  components:{  LineMaverick },
  data () {
    return {
      searchPoptipModal: false,
      stationList:[],//站点
      modelList:[],//机种
      lineList:[],//线体
      lineData:{xData:[],legendData:["YR","YR Goal","SYL Target"],series:[]},//线体值
      req: {
        startTime:"",
        endTime:"",
        line: "",
        model: "",
        station:"",
      }, //查询数据
       // 验证实体
      ruleValidate: {
        line: [
          {
            required: true,
            message: this.$t("pleaseEnter") + '线体',
            trigger: "change",
          },
        ],
        model: [
          {
            required: true,
            message: this.$t("pleaseEnter") + '机种',
            trigger: "change",
          },
        ],
        station: [
          {
            required: true,
            message: this.$t("pleaseEnter") + '站点',
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.getLine();
    this.$nextTick(() => {
        this.$refs.lineMaverick.initChart();
    });

},
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) {
    this.searchPoptipModal = false;
    next();
  },
  methods: {
    // 获取分页列表数据
    pageLoad () {
        this.$refs.searchReq.validate((validate)=>{
            if(validate){
                let { startTime, endTime,line,model, station } = this.req;
                let obj = {
                        startTime: formatDate(startTime),
                        endTime: formatDate(endTime),
                        line,model, station
                };
                getpagelistReq(obj).then((res) => {
                    if (res.code === 200) {
                        this.lineData.xData = res.result.map((item,index)=>index)
                        this.lineData.series =[
                                {
                                    type: "line",
                                    name:"YR",
                                    data:   res.result.map(item1=>{return {value:item1.yield,createtime:formatDate(item1.createtime),station:item1.station,yielD_TARGET:item1.yielD_TARGET}})
                                },
                                {
                                    type: "line",
                                    name:"YR Goal",
                                    data:   res.result.map(item1=>item1.yielD_TARGET)
                                },
                                {
                                    type: "line",
                                    name:"SYL Target",
                                    data:   res.result.map(item1=>item1.yielD_TARGET)
                                }];
                        this.$nextTick(() => {
                            this.$refs.lineMaverick.initChart();
                        });
                    }
                    }).finally(()=>{ this.searchPoptipModal = false});
                }
        })
        
       
    },
    //获取线体
   async getLine(){
       await getLineReq().then(res=>{
            if(res.code===200){
                this.lineList = res.result||[];
            }
        })
    },
    // 

    //获取站点
    getStation(){
        getStationReq({line:this.req.line}).then(res=>{
            if(res.code===200){
                this.stationList = res.result||[];
            }
        })
    },
    //获取机种
    getModel(){
        getModelReq({line:this.req.line}).then(res=>{
            if(res.code===200){
                this.modelList = res.result ||[]
            }
        })
    },
    // 点击重置按钮触发
    resetClick () {
      this.$refs.searchReq.resetFields();
      this.searchPoptipModal = false;
      this.$nextTick(() => {
        this.searchPoptipModal = true;
      });
    }
  }
}
</script>
