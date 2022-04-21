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
import {
  errorType,
  getUploadImageUrl,
  compress,
  base64ToFile
} from "@/libs/tools";
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
        this.$Message.warn("只能上传图片格式");
      }
    },

    upload (file) {
      //获取图片地址
      getUploadImageUrl(file).then((imageUrl) => {
        //将图片进行压缩
        compress(imageUrl).then((res) => {
          let formData = new FormData();
          formData.append("data", base64ToFile(res));
          //   formData.append("fileName", file.name);
          for (let item in this.extraData) {
            formData.append(item, this.extraData[item]);
          }
          uploadImageReq(formData).then((res) => {
            if (res.code === 200) {
              this.uploadImgUrl = res.result.url;
              this.$emit("input", this.uploadImgUrl);
              this.$emit("change", this.uploadImgUrl);
            } else {
              let content = `${errorType(this, res)}<br> ${res.message}`;
              this.$Modal.error({
                title: this.$t("uploadAttachment") + this.$t("fail"),
                content: content,
              });
            }
          });
        });
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
