/* Serin RowData */
<template>
  <div class="page-style">
    <!-- 页面输入下载条件 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style" id="serinRowData">
        <Row>
          <Form ref="submitReq" :model="req" :label-width="150" :label-colon="false" :rules="ruleValidate" style="width: 70rem;">
            <FormItem :label='$t("stationType")' prop="stationType">
              <Input type="text" v-model="req.stationType" clearable size="default"></Input>
            </FormItem>
            <FormItem :label='$t("barCode")' prop="barcode">
              <Input type="textarea" v-model="req.barcode" size="default" :autosize="{minRows:15,maxRows: 15}" placeholder="请以逗号或回车分隔" clearable></Input>
            </FormItem>
            <!-- 制程 -->
            <FormItem>
              <Button type="primary" @click="reset()" size="default">{{ $t("reset") }}</Button> &nbsp;&nbsp;
              <Button type="primary" @click="exportClick()" size="default">{{ $t("export") }}</Button>
            </FormItem>
          </Form>
        </Row>
      </Card>
    </div>
  </div>
</template>

<script>
import { exportReq } from "@/api/bill-manage/serin-rowdata-report";
import { formatDate, exportFile } from "@/libs/tools";

export default {
  name: "SerinRowData",
  data () {
    return {
      req: {
        stationType: "",
        barcode: ""
      }, //查询数据
      // 验证实体
      ruleValidate: {
        stationType: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("stationType"),
            trigger: "blur",
          },
        ],
        barcode: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("barCode"),
            trigger: "blur",
          },
        ]
      }
    };
  },
  methods: {
    // 导出
    exportClick () {
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          let { stationType, barcode } = this.req;
          // 回车转逗号分割
          if (barcode.indexOf('\n')) barcode = barcode.replace(/\n/g, ',')
          const obj = {
            barcode,
            stationType: stationType.toUpperCase()
          }
          exportReq(obj).then((res) => {
            let blob = new Blob([res], { type: "application/vnd.ms-excel" });
            const fileName = `${this.$t("SerinRowData")}${formatDate(new Date())}.xlsx`; // 自定义文件名
            exportFile(blob, fileName);
          });
        }
      })
    },
    // 重置
    reset () {
      this.$refs.submitReq.resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
#serinRowData {
  .ivu-row {
    margin-left: 15%;
    margin-top: 8%;
    text-align: center;
  }
  /deep/.ivu-form .ivu-form-item-label {
    font-size: 21px;
  }
  /deep/.ivu-btn-primary {
    width: 100px;
  }
  /deep/ textarea.ivu-input,
  .ivu-input,
  .ivu-btn {
    font-size: 19px;
  }
  /deep/.ivu-form-item-content {
    font-size: 18px;
  }
  /deep/.ivu-form-item {
    margin-bottom: 25px;
  }
}
</style>
