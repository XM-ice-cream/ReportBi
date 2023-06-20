<template>
  <div class="pwd-strength">
    <div class="pwd-strength-bar">
      <span class="color" :class="{red: pwdStrength > 0}"></span>
      <span class="color" :class="{orange: pwdStrength > 1}"></span>
      <span class="color" :class="{green: pwdStrength > 2}"></span>
    </div>
    <div class="pwd-strength-text">
      <span>弱</span>
      <span>中</span>
      <span>强</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "pwd-strength",
  props: {
    // 图片地址
    pwd: {
      type: String,
      default: "",
    },
  },
  computed: {
    pwdStrength() {
      let count = 0
      if (new RegExp(/[a-z]+/g).test(this.pwd)) count += 1
      if (new RegExp(/[A-Z]+/g).test(this.pwd)) count += 1
      if (new RegExp(/[0-9]+/g).test(this.pwd)) count += 1
      return count
    }
  }
};
</script>

<style scoped lang="less">
.pwd-strength-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 30px;

  .color {
    width: 32%;
    height: 60%;
  }

  .red {
    background-color: red;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  }

  .orange {
    background-color: orange;
  }

  .green {
    background-color: #17f817;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
}

.pwd-strength-text {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 16px;
  margin-top: 2px;
}
</style>
