<!-- 忘记密码 -->
<template>
  <div>
    <Modal class="forget-form" v-model="modalFlag" width="690px" draggable scrollable :mask="false"
           :mask-closable="false" title="忘记密码" @on-close="cancelClick">
      <div>
        <Form class="card-style-form" :label-width="100" :label-colon="false" @submit.native.prevent
              :rules="ruleValidate" ref="homeform" :model="submitData" autocomplete="off">
          <FormItem label="姓名" prop="name">
            <Input class="card-style-form-input" v-model="submitData.name" placeholder=""/>
          </FormItem>
          <FormItem label="身份证" prop="idCard">
            <Input class="card-style-form-input" v-model="submitData.idCard" placeholder=""/>
          </FormItem>
          <FormItem label="工号" prop="account">
            <Input class="card-style-form-input" v-model="submitData.account" placeholder=""/>
          </FormItem>
          <FormItem label="新密码" prop="password">
            <Input class="card-style-form-input" v-model="submitData.password" placeholder=""/>
          </FormItem>
          <FormItem>
            <pawd-strength :pawd="submitData.password"></pawd-strength>
          </FormItem>
          <FormItem label="确认密码" prop="newpassword">
            <Input class="card-style-form-input" v-model="submitData.newpassword" placeholder=""/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submitClick">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {resetpasswordReq} from './forget-form';
import {errorType} from "@/libs/tools";
import {encryptDes, sha1_to_base64} from '@/libs/des';
import PawdStrength from "./pawd-strength";

export default {
  name: "forget-form",
  components: {PawdStrength},
  data() {
    return {
      modalFlag: false,
      submitData: {
        name: "",
        password: "",
        account: "",
        idCard: "",
        newpassword: "",
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("accountName"),
            trigger: "change",
          },
        ],
        account: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("accountId"),
            trigger: "change",
          },
        ],
        idCard: [
          {
            required: true,
            message: this.$t("pleaseEnter") + "身份证",

            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let errText = this.$t("pleaseEnter") + this.$t("password");
              this.validatetrueCheck(rule, value, callback, errText);
            },
            trigger: "change",
          },
        ],
        newpassword: [
          {
            required: true,
            message: this.$t("pleaseEnter") + "新密码",
            trigger: "change",
          },
        ],

      }

    };

  },
  methods: {
    validatetrueCheck(rule, value, callback, errText) {
      if (value === "") {
        callback(new Error(errText));
      } else {
        // 包含大小写字母、数字
        const reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d!#@*&.]{8,}$/
        if (reg.test(value) && value.length >= 8) {
          callback();
        } else {
          callback(new Error("请输入正确的密码规则"));
        }
      }
    },
    //取消
    cancelClick() {
      this.modalFlag = false;
      this.$refs.homeform.resetFields(); //清除表单红色提示
    },
    //提交
    submitClick() {
      this.$refs.homeform.validate((validate) => {
        if (validate) {
          let obj = {
            name: this.submitData.name,
            account: this.submitData.account,
            idCard: this.submitData.idCard,
            password: sha1_to_base64(encryptDes(this.submitData.password, 'baize#66', 'lxeP@ssx')),
            newpassword: sha1_to_base64(encryptDes(this.submitData.newpassword, 'baize#66', 'lxeP@ssx'))
          };
          if (this.submitData.password !== this.submitData.newpassword) {
            this.$Msg.error('两次输入的密码不一致,请重新输入。')
          } else {
            resetpasswordReq(obj).then((res) => {
              if (res.code === 200) {
                this.$Message.success(`${this.$t("success")}`);
                this.cancelClick();
              } else this.$Msg.error(`${this.$t("fail")},${errorType(this, res)}`);
            });
          }
        }
      });
    }
  },
};

</script>
<style lang="less">
.forget-form {
  .ivu-modal-content {
    background-color: #384f6dde;
  }

  .ivu-modal-content.ivu-input {
    height: 30px;
    padding: 4px 7px;
    border: none;
    color: #fff;
    background-color: rgba(31, 41, 60);
    border-radius: 0;
  }

  .ivu-card {
    background-color: #324763de;
  }

  .ivu-modal-header p,
  .ivu-modal-header-inner {
    color:#75a4ff;
    padding-left: 25px;
    font-size: 20px;
    margin-top: 5px;
  }
  .ivu-form-item {
    margin-bottom: 6px;
  }
  .ivu-form .ivu-form-item-label {
    color: white;
    font-size: 16px;
    padding: 10px 12px 10px 0 !important;
    margin-top: 16px;
  }

  .ivu-modal-content .ivu-input {
    background-color: transparent;
    width: 502px;
    color: #fff;
    border: none;
    border-bottom: 1px solid #7798d7bf;
    font-size: 16px;
  }
  .ivu-modal-content .ivu-input:focus {
    box-shadow: none;
  }
  .ivu-form-item-content {
    margin-left: 10px;
  }

  .ivu-modal-body {
    line-height: 1.5;
    padding: 9px 10px;
    font-size: 33px
  }

  .ivu-input-small {
    height: 33px;
  }

  .ivu-input-with-prefix {
    padding-bottom: 2px
  }

  .ivu-modal-content .ivu-input:-webkit-autofill,
  .ivu-modal-content .ivu-input:-webkit-autofill:hover,
  .ivu-modal-content .ivu-input:-webkit-autofill:focus,
  .ivu-modal-content .ivu-input:-webkit-autofill:active {
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;

  }

  .card-style-form-input {
    margin-left: -70px;
  }

  .card-style-form-pwd-strength {
    margin-left: 20px;
  }

  .ivu-form-item-error-tip {
    margin-left: -50px
  }

  .pwd-strength-bar {
    margin-left: 14px;
  }

  .pwd-strength-text {
    color: #fff;
  }

}
.forget-form .ivu-modal-close .ivu-icon-ios-close:hover {
  color:#fff;
}
</style>
