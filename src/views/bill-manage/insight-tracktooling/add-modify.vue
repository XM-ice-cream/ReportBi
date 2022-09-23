<template>
   <!-- 右侧抽屉 Form表单 -->
    <Drawer v-model="drawerFlag" :title="drawerTitle" width="500" :mask-closable="false" @on-close="cancelClick">
      <Form ref="submitData" :model="submitData" :label-width="90" :label-colon="true" @submit.native.prevent>
        <!-- 机种 -->
        <FormItem :label="$t('modelName')" prop="modelName">
            <Input v-model="submitData.modelName" :placeholder="$t('pleaseEnter') + $t('modelName')"/>
        </FormItem>
        <!-- 客户机种 -->
        <FormItem label="客户机种" prop="customerModelName">
            <Input v-model.trim="submitData.customerModelName" :placeholder="$t('pleaseEnter') + '客户机种'"  />
        </FormItem>
        <!-- MES站点 -->
        <FormItem label="MES站点" prop="stepName">
            <Input v-model.trim="submitData.stepName" :placeholder="$t('pleaseEnter') + 'MES站点'"  />
        </FormItem>
         <!-- 客户站点 -->
         <FormItem label="客户站点" prop="customerStepName">
            <Input v-model.trim="submitData.customerStepName" :placeholder="$t('pleaseEnter') + '客户站点'"  />
        </FormItem>
        <!-- 上传站点 -->
        <FormItem label="上传站点" prop="uploadStepName">
            <Input v-model.trim="submitData.uploadStepName" :placeholder="$t('pleaseEnter') + '上传站点'"  />
        </FormItem>
        <!-- 序号 -->
        <FormItem label="序号" prop="sortNumber">
            <InputNumber v-model.trim="submitData.sortNumber" :placeholder="$t('pleaseEnter') + '序号'"  />
        </FormItem>
        <!-- 按钮 -->
        <FormItem>
          <drawer-button :text="drawerTitle" @on-cancel="cancelClick" @on-ok="submitClick" @on-okAndClose="submitClick(true)"></drawer-button>
        </FormItem>
      </Form>
    </Drawer>
</template>

<script>
import { addReq,modifyReq } from "@/api/bill-manage/insight-ic";
export default {
  name: "insight-tracktooling-add-modify",
  props:{
    drawerFlag:{
        type:Boolean,
        default:false
    },
     isAdd:{
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
        //弹窗开启 及编辑时 赋值
        if(newVal && !this.isAdd){
            this.submitData = {...this.selectObj};
    }
  }
  },
  data () {
    return {
      submitData:{
        modelName: "",
        customerModelName: "",
        stepName: "",
        customerStepName: "",
        uploadStepName: "",
        sortNumber: "",
        id: ""
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
          const { modelName,customerModelName,stepName,customerStepName,uploadStepName,sortNumber,id} = this.submitData;
          const obj = {
            modelName,customerModelName,stepName,customerStepName,uploadStepName,sortNumber,id
          }
          const requestApi = this.isAdd?addReq:modifyReq;
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
     // 左侧抽屉取消
    cancelClick () {
      this.$emit("update:drawerFlag",false);
      this.$refs.submitData.resetFields();
    },
  },
};
</script>