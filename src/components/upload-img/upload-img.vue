/* 导入图片 */
<template>
  <div>
    <!-- 左侧抽屉 -->
    <Drawer
      v-model="drawerFlag"
      :title="drawerTitle"
      width="650"
      :mask-closable="false"
      @on-close="cancelClick"
    >
      <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
        <template>
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name,index)"></Icon>
          </div>
          <Icon type="md-close-circle" class="remove" @click.native="handleRemove(item)"></Icon>
        </template>
      </div>
      <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :format="['jpg','jpeg','png']"
              :max-size="maxSize"
              :before-upload="handleBeforeUpload"
              :multiple="multiple"
              type="drag"
              action=""
              style="display: inline-block;width:140px;">
        <div style="width:140px;height:140px;line-height: 214px;">
          <Icon type="ios-add" size="140" style="color:#d7d7d7"></Icon>
        </div>
      </Upload>
      <div class="upload-img-button">
        <Button @click="cancelClick">{{$t('cancel')}}</Button>
        <Button type="primary" @click="okClick">{{$t('ok')}}</Button>
      </div>
      <Modal draggable   :title="drawerTitle" v-model="visible" width="800" :footer-hide="true">
        <Carousel loop v-if="visible" class="upload-img-carousel" v-model="carouselIndex">
          <CarouselItem v-for="(item,index) in uploadList" :key="index">
            <img :src="item.url" style="width: 100%">
          </CarouselItem>
        </Carousel>
      </Modal>
    </Drawer>
  </div>
</template>

<script>

export default {
  name: "upload-img",
  components: {  },
  props: {
    // 上传文件最大限制
    maxSize: {
      type: Number,
      default: 6144,
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: true,
    },
    // 上传文件类型
    uploadFormat: {
      type: Array,
      default: () => ['png', 'jpg'],
    },
  },
  data() {
    return {
      drawerTitle: this.$t("uploadImage"),
      drawerFlag: false,
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      carouselIndex:'' //走马灯索引
    };
  },
  computed: {
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    handleView (name,index) {
      this.imgName = name;
      this.carouselIndex = index
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    //返回是否 是上传的文件类型
    isAssetTypeAnImage(ext) {
      return this.uploadFormat.includes(ext.toLowerCase());
    },
    handleBeforeUpload (file) {
      const check = this.$refs.upload.fileList.length < 5;
      if (!check) {
        this.$Msg.warning(
                `${this.$t("maxImgTotalFive")}`
        );
        return false;
      }
      // 判断文件大小
      if(file.size / 1024 > this.maxSize) {
        this.$Msg.warning(`${file.name}。${this.$t("uploadMaxSize")}${this.maxSize / 1024}M`);
        return false;
      }
      //获取后缀
      let ext = file.name
              .split(".")
              .pop()
              .toLowerCase();
      if (this.isAssetTypeAnImage(ext)) {
        this.$emit("fileUpload", file);
      } else {
        this.$Msg.warning(
                `${file.name}。${this.$t("uploadFormError")}.${this.uploadFormat.join(",.")}`
        );
      }
      return false;
    },
    // 左侧抽屉取消
    cancelClick() {
      this.uploadList = []
      this.defaultList = []
      this.drawerFlag = false;
    },
    okClick() {
      this.$parent.saveImgReq()
    }
  },
};
</script>

<style>
  .demo-upload-list{
    display: inline-block;
    width: 140px;
    height: 140px;
    text-align: center;
    line-height: 140px;
    border: 1px dashed #d7d7d7;
    /*overflow: hidden;*/
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 10px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  .remove {
    position: absolute;
    top: -10px;
    right: -14px;
    color: #7fc693;
    font-size: 25px;
    cursor: pointer;
    margin: 0 2px;
    z-index: 10;
  }
  .upload-img-carousel {
    width: 765px;
    height: 765px;
  }
</style>
<style scoped lang="less">
  .upload-img-button {
    position: absolute;
    bottom:50px;
    left:50%;
    transform: translateX(-50%);
    button {
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
