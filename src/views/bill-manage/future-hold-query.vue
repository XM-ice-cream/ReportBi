/* 计划HOLD查询 */
<template>
  <div class="page-style">
    <div class="comment">
      <Card :bordered="false" dis-hover class="card-style">
        <Form ref="submitReq" :model="req" :label-width="150" :label-colon="false" :rules="ruleValidate">
          <Row>
            <i-col span="24" style="margin-top:120px;text-align: center">
              <div class="state-content">
                <i v-show="state === 'ok'" class="iconfont icon-smile" style="font-size: 160px;color:#3ae946;"></i>
                <i v-show="state === 'ng'" class="iconfont icon-cry" style="font-size: 160px;color:#f0663d;"></i>
              </div>
            </i-col>
            <i-col span="14" style="margin:50px auto 0 auto;">
              <FormItem :label="$t('bigBoardCode')" prop="barcode">
                <Input ref="barcode" size="large" v-model.trim="req.barcode" @keyup.native.enter="searchClick" :placeholder="$t('pleaseEnter') + $t('bigBoardCode')" />
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import { getisfutureholdReq } from "@/api/bill-manage/future-hold-query";
import { inputSelectContent } from "@/libs/tools";
import { playSound } from "@/libs/tools";

export default {
  name: "future-hold-query",
  data () {
    return {
      state: "",
      req: {
        barcode: "",
      }, //查询数据
      // 验证实体
      ruleValidate: {
        barcode: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("bigBoardCode"),
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 查询
    searchClick () {
      this.state = "";
      this.$refs.submitReq.validate((validate) => {
        if (validate) {
          getisfutureholdReq({ panelno: this.req.barcode }).then((res) => {
            if (res.code === 200) {
              if (res.message === "OK") {
                this.state = "ng";
                playSound(this.$config.tipsVoice.NgTips);
              } else if (res.message === "NG") {
                this.state = "ok";
              }
            }
          });
          inputSelectContent(this.$refs.barcode);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-FormItem-label {
  line-height: 32px;
  font-size: 24px;
}
.state-content {
  margin: 0 auto;
  width: 250px;
  height: 250px;
  line-height: 250px;
}
</style>
