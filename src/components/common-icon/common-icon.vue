<template>
  <Icon :type="iconName" :class="iconName" :color="iconColor" :size="iconSize"></Icon>
</template>

<script>
export default {
  name: 'CommonIcon',
  props: {
    type: {
      type: String,
      required: true
    },
    color: String,
    size: Number
  },
  computed: {
    iconName () {
      return this.type
    },
    iconSize () {
      return this.size || 12
    },
    iconColor () {
      return this.color || ''
    }
  }
}
</script>
