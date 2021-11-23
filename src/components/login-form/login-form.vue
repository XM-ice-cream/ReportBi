<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <i-input
        v-model="form.userName"
        size="default"
        :placeholder="`${$t('pleaseEnter')}${$t('userName')}`"
      >
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </i-input>
    </FormItem>
    <FormItem prop="password">
      <i-input
        type="password"
        v-model="form.password"
        size="default"
        :placeholder="`${$t('pleaseEnter')}${$t('password')}`"
      >
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </i-input>
    </FormItem>
    <FormItem prop="db">
      <Select class="query_more_select" v-model="form.db" @on-change="dbChange">
        <div slot="prefix" style="width:20px;text-align: center;">
          <i class="iconfont icon-net" />
        </div>
        <!-- prefix="iconfont icon-net" -->
        <!-- <Avatar src="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" slot="prefix" size="small" /> -->
        <Option v-for="(item, index) in dbList" :value="item.value" :key="index"
          >{{ item.name }}
        </Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" size="default" type="primary" long :loading="loginLoading" class="login-button">{{
        $t("login")
      }}</Button>
    </FormItem>
  </Form>
</template>
<script>
import { sessionRead } from "@/libs/utils";
// 先引入axios
import axios from "axios";
// import bg from '@/assets/images/login-bg2.jpg'
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      },
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      },
    },
    loginLoading: Boolean,
  },
  data() {
    return {
      // bg:bg,
      form: {
        userName: sessionRead("userName") || this.$store.state.account,
        password: "",
        db: "",
      },
      dbList: [],
    };
  },
  watch: {
    // "form.db"(newValue) {
    //   let dbSelectItem = this.dbList.find((o) => o.value === newValue) || {};
    //   let loginDom = document.getElementsByClassName("login");
    //   if (dbSelectItem.logo) {
    //     loginDom[0].style.backgroundImage = `url(${dbSelectItem.logo})`;
    //   } else {
    //     loginDom[0].style.backgroundImage = `url(${bg})`;
    //   }
    // },
  },
  created() {

    // 请求存储基础接口地址的json文件,获取保存的接口基础地址
    axios.get("./url.json?"+new Date().getTime()).then((res) => {
      this.dbList = res.data;
      let configip = window.localStorage.getItem("configip");
      let dbSelectItem = this.dbList.find((o) => o.value === configip) || {};
      if (dbSelectItem.value) {
        this.form.db = dbSelectItem.value;
        //报表ip
        window.localStorage.setItem("reportip", dbSelectItem.reportip || dbSelectItem.value);
      } else {
        //如果本地缓存的 configip 不在配置文件里 默认取配置文件第一条
        this.form.db = this.dbList[0].value;
        window.localStorage.setItem("configip", this.dbList[0].value);
        window.localStorage.setItem("reportip", this.dbList[0].reportip); //报表ip
      }
    });
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
      };
    },
  },
  methods: {
    dbChange(e) {
      window.localStorage.setItem("configip", e);
      let dbSelectItem = this.dbList.find((o) => o.value === e) || {};
      window.localStorage.setItem("reportip", dbSelectItem.reportip || e); //报表ip
    },
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit("on-success-valid", {
            userName: this.form.userName,
            password: this.form.password,
          });
        }
      });
    },
  },
};
</script>
<style lang="less">
  .login-button {
    background: #92a0f3;
    border: none;
    border-radius: 20px;
  }
  .login-button:hover {
    background-color: #399bff;
    border: none;
  }
</style>
