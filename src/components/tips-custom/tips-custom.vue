<template>
  <List border v-show="tipsList.length > 0" class="page-style-list">
    <ListItem v-for="(item, i) in tipsList" :key="i">
      <Alert class="page-style-alert" show-icon :type="item.type">{{  item.text }}</Alert>
    </ListItem>
  </List>
</template>
<script>
  export default {
    name: 'TipsCustom',
    props: {
      /**
       * @description 要展示的提示展示列表
       */
      tipsList: {
        type: Array,
        default: () => []
      },
    },
  }
</script>
