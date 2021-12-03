<template>
  <div class="tool-bar">
    <div class="icon-node">
      <i v-for="(item, i) in list" :key="i" :class="item.iconClass" draggable
         @dragstart="handleDragstart" @dragend="handleDragEnd($event, item)" :title="item.label"/>
    </div>
    <div class="icon-node">
      <i class="iconfont icon-mouse-pointer" :class="{isActive: isClick === 'default'}" title="默认" @click="setMode('default')"/>
      <i class="iconfont icon-line-arrow" :class="{isActive: isClick === 'addEdge'}" title="直线" @click="setMode('addEdge')"/>
      <i class="iconfont icon-menu" :class="{isActive: isClick === 'brush'}" title="选中排版" @click="setMode('brush')"/>
    </div>
    <div class="icon-node">
      <i class="iconfont icon-delete" title="删除" @click="deleteNode"/>
      <i class="iconfont icon-download" title="导出图片" @click="downImage"/>
      <i class="iconfont icon-apps" v-show="isClick === 'brush'" title="节点对齐" @click="formatRow"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tool-bar",
    data() {
      return {
        isClick: 'default',
        list: [
          {
            id: "start",
            label: "开始",
            type: "rect",
            nodeType: "startNode",
            iconClass: 'iconfont icon-kaishi',
          },
          {
            id: "end",
            label: "结束",
            type: "rect",
            nodeType: "endNode",
            iconClass: 'iconfont icon-jieshu1',
          },
        ]
      }
    },
    mounted() {
    },
    methods: {
      handleDragstart(e) {
        this.$emit('handleDragstart', e)
      },
      handleDragEnd(e, item) {
        this.$emit('handleDragEnd', e, item)
      },
      //设置模式
      setMode(val) {
        this.isClick = val
        this.$emit('setMode', val)
      },
      //删除节点
      deleteNode() {
        this.$emit('on-delete')
      },
      //保存节点
      downImage() {
        this.$emit('on-download')
      },
      //格式化排列
      formatRow() {
        this.$emit('on-format-row')
      },
    }
  }
</script>

<style scoped lang="less">
  @color: #19be6b;
  .border {
    border: 1px solid @color;
  }

  .tool-bar {
    background-color: #fff;

    .icon-node {
      display: inline-block;
      padding: 5px;
      border-right: 1px solid #999;

      &:last-child {
        border-right: none;
      }

      & > i {
        font-size: 20px;
        vertical-align: middle;
        padding: 2px;
        margin: 0 3px;
        border: 1px solid #f7f7f7;
        border-radius: 5px;

        &:hover {
          color: @color;
          cursor: pointer;
        }
      }

      .isActive {
        .border;
        color: @color;
      }
    }
  }
</style>