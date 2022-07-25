
<!-- 条件属性 -->
<template>
  <Tabs size="small" v-if="type===3" class="tabPane3">
    <TabPane label="条件属性" name="first" size="small">
      <Form ref="rightForm" :model="rightForm" :label-width="60" style="padding: 0 0.5rem">
        <!-- 添加条件 -->
        <FormItem label="添加条件">
          <Button long @click="add">
            <Icon type="md-add" />
          </Button>
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data">
        <template #name="{ row }">
          <strong>{{ row.name }}</strong>
        </template>
        <template #action="{  index }">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
          <Button type="error" size="small" @click="remove(index)">Delete</Button>
        </template>
      </Table>
    </TabPane>

  </Tabs>

</template>
<script>

export default {
  components: {},
  name: "tabPane3",
  props: {
    formData: {
      type: Object,
      default: () => { },
    },
    type: {
      type: Number,
      default: 3
    }
  },
  watch: {
    formData: {
      handler () {
        console.log("this.formData", this.formData);
        this.rightForm = { ...this.formData };
      },
      deep: true,
      immediate: true
    },
  },
  data () {
    return {
      rightForm: {},
      data: [],
      columns: [
        {
          title: 'Name',
          slot: 'name'
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
    }
  },
  methods: {
    autoChangeFunc (val) {
      this.rightForm = { ...this.rightForm, ...val }
      this.$emit("autoChangeFunc", 'condition', this.rightForm);
    },
    //添加条件
    add () {
      const obj = { name: `条件属性${this.data.length + 1}`, children: [] };
      this.data.push(obj);
    }
  }
}
</script>
<style>
</style>
<style scoped lang = "less">
</style>
