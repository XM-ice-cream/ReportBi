<template>
  <Modal :title="dialogFormVisibleTitle" :mask-closable="false" :closable="false" v-model="visib" fullscreen :z-index='800'>
    <div class="layout">
      <Layout>
        <Sider hide-trigger>Sider</Sider>
        <Content>Content</Content>
      </Layout>
    </div>
    <div slot="footer" class="dialog-footer">
      <Button @click="closeDialog">取消</Button>
      <Button type="primary" @click="commit()">保存</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: "preview",
  components: {},
  props: {
    visib: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogFormVisibleTitle: '预览'
    }
  }
}
</script>