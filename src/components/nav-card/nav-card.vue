<template>
  <Card :shadow="shadow" class="nav-card-wrapper nav-content" :padding="10" :bordered="false">
    <p :title="navName">
      <Icon :custom="iconName" :color="iconColor" :size="iconSize"></Icon>
      <span>{{ navName }}</span>
    </p>
  </Card>
</template>

<script>
export default {
  name: 'NavCard',
  props: {
    shadow: {type: Boolean, default: false},
    iconName: {type: String, default: ''},
    iconColor: {type: String, default: ''},
    iconSize: {type: Number, default: 36},
    navName: {type: String, default: ''}
  },
  computed: {}
}
</script>

<style scoped lang="less">
.nav-card-wrapper {
  text-align: center;
  cursor: pointer;
  background-color: #f8f8f8;
  margin-bottom: 10px;

  p {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    font-weight: bold;
    text-align: left;

    &:hover {
      color: #1890ff;
    }
  }

  i {
    vertical-align: middle;
    padding: 0 8px 0 0;
  }

  span {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 105px;
    padding-top: 1px;
    vertical-align: middle;
  }
}
</style>
