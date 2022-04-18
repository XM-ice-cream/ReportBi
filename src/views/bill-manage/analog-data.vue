/* 模拟数据 */
<template>
  <div class="page-style">
    <!-- 页面输入下载条件 -->
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style" id="analogData">
        <Row>
          <Form ref="submitReq" :model="req" :label-width="150" :label-colon="false" :rules="ruleValidate" style="width: 70rem;">
            <FormItem label='参照SN' prop="originalSn">
              <Input type="text" v-model="req.originalSn" clearable size="default"></Input>
            </FormItem>
            <FormItem label='参照Panel' prop="originalPanel">
              <Input type="text" v-model="req.originalPanel" clearable size="default"></Input>
            </FormItem>
            <FormItem label='替换SN' prop="currentSn">
              <Input type="text" v-model="req.currentSn" clearable size="default"></Input>
            </FormItem>
            <FormItem label='替换Panel' prop="currentPanel">
              <Input type="text" v-model="req.currentPanel" clearable size="default"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="reset()" size="default">{{ $t("reset") }}</Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('unitinfo')" size="default">添加过站</Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('serin')" size="default">添加Serin</Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('kns')" size="default">添加KNS</Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('tooling')" size="default">添加Tooling</Button> &nbsp;&nbsp;
            </FormItem>
          </Form>
        </Row>
        <!-- 提交记录 -->
        <div v-if="reqList.length">
          <template v-for="(item,index) in reqList">
            <Alert type="success" show-icon :key="index">
              {{item.originalSn}}-{{item.originalPanel}}-{{item.currentSn}}-{{item.currentPanel}}
            </Alert>
          </template>
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
import { addUnitinfoTravel, addSerinData, addKnsData, addToolingData } from "@/api/bill-manage/analog-data";
import { formatDate, exportFile } from "@/libs/tools";

export default {
  name: "analogData",
  data () {
    return {
      req: {
        originalSn: "",
        originalPanel: "",
        currentSn: "",
        currentPanel: ""
      }, //查询数据
      // 验证实体
      ruleValidate: {
        originalSn: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("originalSn"),
            trigger: "blur",
          },
        ],
        originalPanel: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("originalPanel"),
            trigger: "blur",
          },
        ],
        currentSn: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("currentSn"),
            trigger: "blur",
          },
        ],
        currentPanel: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("currentPanel"),
            trigger: "blur",
          },
        ]
      },
      reqList: []
    };
  },
  methods: {
    //提交
    submit (flag) {
      const requestApi = this.apiData(flag);
      this.$refs.submitReq.validate(validate => {
        if (validate) {
          requestApi({ ...this.req }).then(res => {
            if (res.code === 200) {
              this.reqList.push({ ...this.req })
              this.$Message.success('提交成功！');
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      })


    },

    apiData (flag) {
      const temp = {
        'unitinfo': addUnitinfoTravel,
        'serin': addSerinData,
        'kns': addKnsData,
        'tooling': addToolingData
      }
      return temp[flag]
    },

    // 重置
    reset () {
      this.$refs.submitReq.resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
#analogData {
  .ivu-row {
    margin-left: 15%;
    margin-top: 8%;
    text-align: center;
  }
  /deep/.ivu-form .ivu-FormItem-label {
    font-size: 21px;
  }
  /deep/.ivu-btn-primary {
    width: 100px;
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
}
</style>
