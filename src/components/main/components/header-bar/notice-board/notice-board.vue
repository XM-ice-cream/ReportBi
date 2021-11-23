<template>
  <span class="notice-tip" :style="{width:titleWidth+'px'}">
    <div id="notice">
      <div id="innotice">
        <marquee behavior="scroll" :style="{color:color}" :scrollamount="5" :scrolldelay="2" onMouseOut="start()" onMouseOver="stop()">
          {{content}}
        </marquee>
      </div>
    </div>
  </span>
</template>
<script>
export default {
  name: 'noticeBoard',
  props: {
    titleWidth: {
      type: Number,
      default: 200
    },
    content: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#515a6e'
    }
  },
  data () {
    return {
      contents: "",
      fontColor: '#515a6e'
    }
  }
}
</script>
<style scoped lang="less">
.notice-tip {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  background-color: #fffff7;
}
#notice {
  overflow: hidden;
}

#innotice {
  float: left;
  width: 100%;
  height: 40px;
  margin-top: 0px;
  font-size: 0.12rem;
  margin-left: 21px;
  letter-spacing: 1px;
  /deep/ p {
    text-align: center;
  }
}
</style>
