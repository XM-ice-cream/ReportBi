<template>
  <div>
    <Input clearable v-model.trim="uploadImgUrl" size="small" @on-change="changeInput">
    <template slot="append">
      <!-- <i class="iconfont iconfolder-o"></i> -->
      <Icon type="md-image" class="icon-image" />
      <input type="file" class="file" ref="files" @change="getImages" />
    </template>
    </Input>
  </div>
</template>
<script>
import { uploadImageReq } from '@/api/bill-design-manage/report-manage.js'
export default {
  name: 'customUpload',
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: "",
      default: ""
    }
  },
  data () {
    return {
      fileList: [],
      uploadImgUrl: ""
    };
  },
  created () {
    this.uploadImgUrl = this.value;
  },
  methods: {
    getImages (el) {
      let file = el.target.files[0];
      let type = file.type.split("/")[0];
      if (type === "image") {
        this.upload(file);
      } else {
        this.$Message.warn("只能上次图片格式");
      }
    },
    upload (imgUrl) {
      let that = this;
      let formdata = new FormData();
      formdata.append("data", imgUrl);
      uploadImageReq(formdata).then(res => {
        if (res.code == 200) {
          that.uploadImgUrl = res.result.url;
          that.$emit("input", that.uploadImgUrl);
          that.$emit("change", that.uploadImgUrl);
        }
      });
    },
    changeInput (e) {
      if (e) {
        this.uploadImgUrl = e;
      } else {
        this.$refs.files.value = "";
        this.uploadImgUrl = "";
      }
      this.$emit("input", this.uploadImgUrl);
      this.$emit("change", this.uploadImgUrl);
    }
  }
};
</script>
<style lang="less" scoped>
.file {
  position: absolute;
  width: 100%;
  padding: 25%;
  right: 0;
  top: 0;
  opacity: 0;
}
.icon-image {
  font-size: 1.22rem;
  border: 1px solid #035c89;
  background: #072a4f;
  color: #17f5e0;
  /* width: 30px; */
  /* height: 27px; */
  border-radius: 10px;
  padding: 1.5px 5px;
  text-align: center;
}
/deep/.Input-group__append,
/deep/.Input-group__prepend {
  padding: 0 10px !important;
  overflow: hidden;
  position: relative;
}
.iconfont {
  font-size: 12px;
}
</style>
