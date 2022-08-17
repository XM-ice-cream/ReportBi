<template>
   <!-- 右侧抽屉 Form表单 -->
    <Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitData" :label-width="90" :label-colon="true" @submit.native.prevent>
         <!-- jobName -->
        <FormItem label="jobName" prop="jobname">
            <Input v-model.trim="submitData.jobname" :placeholder="$t('pleaseEnter') + 'jobname'"  />
        </FormItem>
        <!-- 线体 -->
        <FormItem label="线体" prop="lineName">
            <Input v-model.trim="submitData.linename" :placeholder="$t('pleaseEnter') + '线体'"  />
        </FormItem>
        <!-- Refdes -->
        <FormItem label="Refdes" prop="refdes">
            <Input v-model.trim="submitData.refdes" :placeholder="$t('pleaseEnter') + 'Refdes'"  />
        </FormItem>
        <!-- 按钮 -->
        <FormItem>
          <drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
        </FormItem>
      </Form>
    </Drawer>
</template>

<script>
import { addReq,modifyReq } from "@/api/bill-manage/nxt-config";
export default {
  name: "nxt-add-modify",
  props:{
    drawerFlag:{
        type:Boolean,
        default:false
    },
    selectObj:{
        type:Object,
        default:()=>null
    },
    drawerTitle:{
        type:String,
        default:"新增"
    }
  },
  watch:{
    drawerFlag(newVal){
        if(newVal){
            this.submitData = {...this.selectObj};
    }
  }
  },
  data () {
    return {
      drawerTitle:"新增",
      submitData:{
        id:"",
        jobname: "",
        linename: "",
        refdes: "",
      }
    };
  },
  activated () {
  },
  methods: {
    //提交
    submitClick (isClose = false) {      
      this.$refs.submitData.validate((validate) => {
        if (validate) {
          const { jobname,linename,refdes,id} = this.submitData;
          const obj = {
             jobname,linename,refdes,id
          }
          const requestApi = id?modifyReq:addReq;
          requestApi(obj).then((res) => {
            if (res.code === 200) {
              this.$Message.success(`${this.drawerTitle}${this.$t("success")}`);
             this.$emit("pageLoad");
              if (isClose) this.cancelClick();
            } else this.$Msg.error(`${this.drawerTitle}${this.$t("fail")},${res.message}`);
          });
        }
      });
    },
     // 点击新增按钮触发
    addClick () {
      this.selectObj = null;
      this.drawerFlag = true;
      this.drawerTitle = this.$t("add");
    },
     // 点击编辑按钮触发
    editClick () {
      if (this.selectObj) {
        let {
          jobname,linename,refdes,id
        } = this.selectObj;
        this.submitData = {
           jobname,linename,refdes,id
        };
        this.drawerFlag = true;
        this.drawerTitle = this.$t("edit");
      } else this.$Msg.warning(this.$t("oneData"));
    },
     // 左侧抽屉取消
    cancelClick () {
      this.$emit("update:drawerFlag",false)
    },
  },
};
</script>