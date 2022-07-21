/*  SIP 包装箱号核验 */
<template>
  <div class="page-style">
    <!-- 页面输入下载条件 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style" id="sip-boxno-check">      
          <Form ref="submitReq" :model="req" :label-width="150" :label-colon="false" style="width: 80%;margin:0 atuo" @submit.native.prevent>
            <Row>
                <Col span="8">
                    <FormItem label='包装箱号' prop="cartonNo">
                        <label>{{req.cartonNo}}</label>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label='料号' prop="pn">
                        <label>{{req.pn}}</label>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label='vendorNO' prop="vendorNO">
                        <label>{{req.vendorNO}}</label>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label='QTY' prop="cartonQTY">
                         <label>{{req.cartonQTY}}</label>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label='配送地' prop="shipAddr">
                         <label> {{req.shipAddr}}</label>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label='UnitID' prop="unitID">
                        <Input type="text" ref="inputUnitId" v-model="req.unitID" clearable size="default" placeholder="请刷入UnitID" @on-enter="getBoxNoInfo"></Input>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label='内箱码' prop="inputBoxNo">
                         <Input type="text" v-model="req.inputBoxNo" :disabled = "!isInputNo" ref="inputBoxNo" clearable size="default" placeholder="请刷入内箱码" @on-enter="checkBoxNo"></Input>
                    </FormItem>
                </Col>
                 <Col span="24">
                    <FormItem label='外箱码' prop="inputCartonNo">
                         <Input type="text" v-model="req.inputCartonNo" :disabled = "!isInputNo" ref="inputCartonNo" clearable size="default" placeholder="请刷入外箱码" @on-enter="checkCartonNo"></Input>
                    </FormItem>
                </Col>                
                <Col span="24">
                    <FormItem>
                         <Button type="primary" @click="reset()" size="default">{{ $t("reset") }}</Button>
                    </FormItem>
                </Col>            
             </Row>
          </Form>
        <!-- 提交记录 -->
        <div v-if="tipMsg">
            <Alert :type="tipMsg.indexOf('NG')==-1?'success':'error'" show-icon style="font-size: 1.2rem;">
             {{tipMsg}}
            </Alert>
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
import { checkBoxNoReq } from "@/api/report-manager/sip-boxno-check";
import { inputSelectContent } from "@/libs/tools";
export default {
  name: "sip-boxno-check",
  data () {
    return {
      req: {
        unitID: "",
        pn: "",
        vendorNO: null,//厂商NO
        cartonNo: "",
        inputCartonNo:"",//输入的外箱条码
        boxNo: "",
        inputBoxNo:"", //输入的内箱条码
        shipAddr:"", //配送地
        cartonQTY: "", 
      },
      tipMsg:"",//提示信息
      isInputNo:false,//是否可输入箱号核对
    };
  },
  methods: {
    //获取信息
    getBoxNoInfo () {
          const { unitID} = this.req;
          const obj = { unitID };
          checkBoxNoReq(obj).then(res => {
            if (res.code === 200) {     
              if(!res.result){
                this.tipMsg = "NG 未查到此条码，请确认";
                this.isInputNo = false;//不可输入箱号核对
                this.req= {...this.req, pn: "",vendorNO: null,cartonNo: "",inputCartonNo:"",boxNo: "", inputBoxNo:"", shipAddr:"",cartonQTY: "",};
                return;
              };    
                     
             this.req = {...this.req,...res.result,inputBoxNo:""};
             this.tipMsg = "";
             this.isInputNo = true;//可输入箱号核对
             //输入框聚焦
             inputSelectContent(this.$refs.inputBoxNo);
             
            } 
          })
    },
    //核验内箱号
    checkBoxNo(){
        const { boxNo,inputBoxNo} = this.req;
        if(boxNo===inputBoxNo){
             //输入框聚焦
             inputSelectContent(this.$refs.inputCartonNo);
        }else{
            this.tipMsg = "NG 检查失败 与内箱条码不匹配!";
        }
    },
    // 核验外箱码
    checkCartonNo(){
        const { cartonNo,inputCartonNo} = this.req;
        if(cartonNo===inputCartonNo){
            this.tipMsg = "OK 检查成功";
        }else{
            this.tipMsg = "NG 检查失败 与外箱条码不匹配!";
        }
    },
    // 重置
    reset () {
      this.$refs.submitReq.resetFields();
       inputSelectContent(this.$refs.inputUnitId);
    }
  },
  mounted () {
       inputSelectContent(this.$refs.inputUnitId);
  },
}
</script>
<style lang="less" scoped>
#sip-boxno-check {
  .ivu-row {
    margin-left: 15%;
    margin-top: 8%;
    // text-align: center;
  }
  /deep/.ivu-form .ivu-FormItem-label {
    font-size: 21px;
  }

  /deep/ textarea.ivu-input,
  .ivu-input,
  .ivu-btn {
    font-size: 16px;
  }
  /deep/.ivu-FormItem-content {
    font-size: 18px;
  }
  /deep/.ivu-FormItem {
    margin-bottom: 25px;
  }
  label{
    padding-left: 1rem;
    background: #f5f7f9;
    border-radius: 3px;
    display: block;
    height: 25px;
  }
}
</style>
