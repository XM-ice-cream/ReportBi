/* 强制重置密码 */
<template>
  <Modal class="reset-form" draggable v-model="modal" title="修改密码" footer-hide>
    <Form ref="req" :model="req" :rules="ruleValidate" :label-width="100" :label-colon="false">
      <p class="tips">为了您的账户安全，请先进行修改密码，要求至少包含数字、大小写字母三种类型</p>
      <FormItem :label="$t('oldPwd')" prop="oldPwd"><Input type="password" v-model.trim="req.oldPwd"/></FormItem>
      <FormItem :label="$t('newPwd')" prop="newPwd"><Input type="password" v-model.trim="req.newPwd"/></FormItem>
      <FormItem>
        <pwd-strength :pwd="req.newPwd"></pwd-strength>
      </FormItem>
      <FormItem :label="$t('surePwd')" prop="surePwd"><Input type="password" v-model.trim="req.surePwd"/></FormItem>
      <p style="text-align: center">
        <Button type="primary" size="default" @click="updateClick">{{ $t("updatePwd") }}</Button>
      </p>
    </Form>
  </Modal>
</template>

<script>
import {updatepasswordReq} from "@/api/organize-manager/user-manager";
import {errorType} from "@/libs/tools";
import {encryptDes, sha1_to_base64} from "@/libs/des";
import {mapActions} from "vuex";
import {sessionRead, userLocalInfo} from "@/libs/utils";
import PwdStrength from "@/components/pwd-strength";

export default {
  name: "resetPassword",
  components: {PwdStrength},
  data() {
    return {
      modal: false,
      req: {
        id: "",
        token: "",
        oldPwd: "",
        newPwd: "",
        surePwd: "",
      },
      ruleValidate: {
        oldPwd: [
          {
            required: true,
            message: this.$t("pleaseEnter") + this.$t("oldPwd"),
            trigger: "change",
          },
        ],
        newPwd: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let errText = this.$t("pleaseEnter") + this.$t("newPwd");
              this.validatePassCheck(rule, value, callback, errText);
            },
            trigger: "change",
          },
        ],
        surePwd: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let errText = this.$t("pleaseEnter") + this.$t("surePwd");
              this.validatePassCheck(rule, value, callback, errText);
            },

            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    modal(newValue) {
      if (!newValue) {
        this.$refs.req.resetFields();
      } else {
        this.req.id = this.$store.state.id;
        this.req.token = userLocalInfo().token;
        this.handleLogOut(); //退出登陆
      }
    },
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    validatePassCheck(rule, value, callback, errText) {
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
    // 点击修改密码按钮触发
    updateClick() {
      this.$refs.req.validate((validate) => {
        if (validate) {
          if (this.req.newPwd !== this.req.surePwd) {
            this.$Msg.warning(this.$t("surePwdError"));
          } else {
            const obj = {
              id: this.req.id,
              tokenStr: this.req.token,
              oldPassword: sha1_to_base64(
                  encryptDes(this.req.oldPwd.trim(), "bi", "lxeP@ssx")
              ),
              newPassword: sha1_to_base64(
                  encryptDes(this.req.newPwd.trim(), "bi", "lxeP@ssx")
              ),
            };
            updatepasswordReq(obj).then((res) => {
              if (res.code === 200) {
                this.$Message.success(this.$t("success"));
                this.modal = false;
                const payload = {
                  userName: sessionRead('userName'),
                  password: this.req.newPwd.trim()
                }
                this.$emit('update-pwd-success', payload)
              } else this.$Msg.error(errorType(this, Number(res.result)));
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less">
.reset-form {
  .ivu-modal-content {
    background-color: #384f6dde;
  }

  .tips {
    color: #eee;
    padding-left: 10px;
    padding-bottom:25px;
  }

  .ivu-modal-header p,
  .ivu-modal-header-inner {
    color: #75a4ff;
    font-size: 16px;
  }

  .ivu-form-item {
    margin-bottom: 22px;
  }

  .ivu-form .ivu-form-item-label {
    color: #fff;
    font-size: 14px;
  }
  .ivu-modal-content .ivu-input {
    background-color: transparent;
    color: #fff;
    border: none;
    border-bottom: 1px solid #7798d7bf;
    font-size: 16px;
  }
  .ivu-modal-content .ivu-input:focus {
    box-shadow: none;
  }
  .pwd-strength-text {
    color: #fff;
  }
  .ivu-modal-close .ivu-icon-ios-close:hover {
    color:#fff;
  }
}
</style>
<style scoped lang="less">
@import "./login.less";
</style>
