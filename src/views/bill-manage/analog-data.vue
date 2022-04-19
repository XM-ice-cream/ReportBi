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
              <Button type="primary" @click="submit('unitinfo')" size="default" :loading="loading.unitinfo">
                <span v-if="!loading.unitinfo">添加过站</span>
                <span v-else>正在提交，请等待...</span>
              </Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('serin')" size="default" :loading="loading.serin">
                <span v-if="!loading.serin">添加Serin</span>
                <span v-else>正在提交，请等待...</span>
              </Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('kns')" size="default" :loading="loading.kns">
                <span v-if="!loading.kns">添加KNS</span>
                <span v-else>正在提交，请等待...</span>
              </Button> &nbsp;&nbsp;
              <Button type="primary" @click="submit('tooling')" size="default" :loading="loading.tooling">
                <span v-if="!loading.tooling"> 添加Tooling</span>
                <span v-else>正在提交，请等待...</span>
              </Button> &nbsp;&nbsp;
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
      //加载中
      loading: {
        unitinfo: false,
        serin: false,
        kns: false,
        tooling: false
      },
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
          this.loading[flag] = true;
          requestApi({ ...this.req }).then(res => {
            this.loading[flag] = false;
            if (res.code === 200) {
              this.reqList.push({ ...this.req })
              this.$Message.success('提交成功！');
            } else {
              this.$Message.error(res.message)
            }
          }).catch(() => {
            this.loading[flag] = false;
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
