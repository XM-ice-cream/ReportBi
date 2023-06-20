<template>
  <div class="pwd-strength">
    <div class="pwd-strength-bar">
      <span class="color" :class="{red: pawdStrength > 0}"></span>
      <span class="color" :class="{orange: pawdStrength > 1}"></span>
      <span class="color" :class="{green: pawdStrength > 2}"></span>
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
  name: "pawd-strength",
  props: {
    pawd: {
      type: String,
      default: "",
    },

  },
  computed: {
    pawdStrength() {
      let count = 0
      if (new RegExp(/[a-z]+/g).test(this.pawd)) count += 1
      if (new RegExp(/[A-Z]+/g).test(this.pawd)) count += 1
      if (new RegExp(/[0-9]+/g).test(this.pawd)) count += 1
      return count
    }
  },
};
</script>

<style scoped lang="less">
.pwd-strength-bar {
  width: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 30px;
  // padding-left: 350px;
  margin-left: 90px;
  margin-top:18px;


  .color {
    width: 32%;
    height: 60%;
  }

  .red {
    background-color: rgb(199, 72, 72);
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  }

  .orange {
    background-color: rgb(232, 187, 104);
  }

  .green {
    background-color: #7ceb7c;
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
  margin-left:0px;
}
</style>
