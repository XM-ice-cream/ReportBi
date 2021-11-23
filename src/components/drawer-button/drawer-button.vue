<template>
  <div class="drawer-button">
    <Button @click="cancelClick">{{$t('cancel')}}</Button>
    <Button type="primary" @click="okClick">{{text || $t('ok')}}</Button>
    <Button type="primary" @click="okAndClose">{{`${text || $t('ok')}${$t('andClose')}`}}</Button>
  </div>
</template>

<script>
  export default {
    name: "drawer-button",
    props: {
      text: {
        type: String,
        default: ''
      },
    },
    methods: {
      // 取消按钮事件
      cancelClick() {
        this.$emit('on-cancel')
      },
      // 确定按钮事件
      okClick() {
        this.$emit('on-ok')
      },
      // 确定或修改按钮事件
      okAndClose() {
        this.$emit('on-okAndClose')
      }
    }
  }
</script>

<style scoped lang="less">
  .drawer-button {
    button {
      margin-right: 5px;
      &:first-child {
        padding: 5px 16px;
        color: #5fb878;
        border: 1px solid #5fb878;
        border-radius: 0;
      }
      &:nth-child(2),&:last-child {
        padding: 5px 16px;
        color:#fff;
        border:1px solid #5fb878;
        background-color:#5fb878;
        border-radius: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }

  }
</style>
