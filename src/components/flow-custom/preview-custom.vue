<template>
  <div class="flow-custom">
    <!--  流程内容  -->
    <div class="flow-custom-content">
      {{list.title}}
      <!--  流程画布  -->
      <div :id="`${refName}flow-custom-preview`" ref="container" class="flow-custom-content-main"></div>
      <!--  右侧详情  -->
      <!--        <div class="flow-custom-content-panel" :class="{ panelHeight: !showMiniMap }"></div>-->
      <!--        <div :id="`${refName}mini-map-preview`"></div>-->
    </div>
    <AttrSet ref="attrSetRef" :selectElement="this.selectElement" :stationList="nameList" :nowStationList="nowStationList"
             :optList="{ id: list.id, name: list.name, graph: graph }" isPreview/>
  </div>
</template>

<script>
import AttrSet from "@/components/flow-custom/attr-set/attr-set";
import G6 from '@antv/g6'
import global from "@/components/flow-custom/libs/global";

export default {
  name: "preview-custom",
  components: {AttrSet},
  props: {
    // 流程配置
    options: {
      type: Object,
      default: () => {
        return {
          width: 300,
          height: 200,
        };
      },
    },
    // 当前流程数据
    list: {
      type: Object,
      default: () => {
      },
    },
    // 站点列表数据
    nameList: {
      type: Array,
      default: () => [],
    },
    // 自定义唯一标识
    refName: String,
  },
  data() {
    return {
      modalFlag: false,
      graph: null,
      grid: null,
      imageMinimap: null,
      panelWidth: 0,
      showGrid: true,
      showMiniMap: true,
      selectElement: null,
      model: null,
      initData: null,
      contextMenuList: [
        {types: ['node', 'edge'], name: 'attrSet'},
      ],
      nowStationList: [],
    };
  },
  methods: {
    // 初始化流程
    init() {
      let width = this.options.width;
      let height = this.options.height;
      // 初始化配置
      let newGlobal = {
      }
      // 创建画布
      this.graph = new G6.Graph({
        container: `${this.refName}flow-custom-preview`,
        width,
        height,
        ...global,
        ...newGlobal
      });
      // 全局点击事件
      this.graph.on("click", (e) => {
        if (e.item) {
          const clickNodes = this.graph.findAllByState("node", "click");
          clickNodes.forEach((cn) => {
            this.graph.setItemState(cn, "click", false);
            this.graph.refreshItem(cn);
          });
          const clickEdges = this.graph.findAllByState("edge", "click");
          clickEdges.forEach((ce) => {
            this.graph.setItemState(ce, "click", false);
            this.graph.refreshItem(ce);
          });
          const {
            item,
            item: {_cfg},
          } = e;
          this.graph.setItemState(item, "click", true);
          this.updateMiniImgUrl()
          this.selectElement = item;
          this.model = _cfg.model;
        }
      });

      //监听节点事件
      this.graph.on("node:mouseenter", (e) => {
        const item = e.item; // 获取鼠标进入的节点元素对象
        this.graph.setItemState(item, "hover", true);
      });
      this.graph.on("node:mouseleave", (e) => {
        const item = e.item;
        this.graph.setItemState(item, "hover", false);
      });
      this.graph.on("node:dblclick", (e) => {
        this.$emit("node-dblclick", e.item.getModel());
        this.modalCancel();
      });

      //监听边事件
      this.graph.on("edge:mouseenter", (e) => {
        const item = e.item; // 获取鼠标进入的节点元素对象
        this.graph.setItemState(item, "hover", true);
      });
      this.graph.on("edge:mouseleave", (e) => {
        const item = e.item;
        this.graph.setItemState(item, "hover", false);
      });
      this.graph.read(this.list);
      // 创建网格
      this.changeGridState(this.showGrid);
      // 创建缩略图
      // this.changeMiniMapState(this.showMiniMap);
      // 创建Tooltip
      this.getTooltipCom();
      // 创建右键弹窗
      this.getContextMenu();
    },
    // 是否展示网格
    changeGridState(val) {
      if (val) {
        this.grid = new G6.Grid(); // 创建网格
        this.graph.addPlugin(this.grid);
      } else this.graph.removePlugin(this.grid);
    },
    // 是否展示缩略图
    changeMiniMapState(val) {
      if (val) {
        this.imageMinimap = new G6.ImageMinimap({
          container: `${this.refName}mini-map-preview`,
          width: this.panelWidth,
          graphImg: ''
        }); // 创建缩略图
        this.graph.addPlugin(this.imageMinimap);
        this.updateMiniImgUrl()
      } else this.graph.removePlugin(this.imageMinimap);
    },
    // 更新缩略图图片
    updateMiniImgUrl() {
      this.graph.toFullDataURL(res => {
        this.imageMinimap.updateGraphImg(res)
      }, 'image/webp', {padding: 3, backgroundColor: '#fff'})
    },
    // Tooltip展示
    getTooltipCom() {
      if (this.tooltip) this.graph.removePlugin(this.tooltip);
      this.tooltip = new G6.Tooltip({
        itemTypes: ["node", "edge"],
        getContent: (e) => {
          return e.item.getModel().label;
        },
        shouldBegin: (e) => {
          return e.item.getModel().label !== undefined;
        },
      }); // ToolBar展示
      this.graph.addPlugin(this.tooltip);
    },
    // 右键弹窗是否展示
    getContextMenu() {
      const menu = new G6.Menu({
        itemTypes: ['node', 'edge'],
        getContent: (evt) => {
          const outDiv = document.createElement('div')
          outDiv.style.minWidth = '100px'
          let htmlVal = ``
          this.contextMenuList.forEach(o => {
            if (o.types.includes(evt.item._cfg.type)) {
              htmlVal += `<p data-name="${o.name}" style="padding: 3px 0;cursor: pointer;"
              onmouseenter="this.style.backgroundColor = '#ccc'"
              onmouseleave="this.style.backgroundColor = '#fff'">${this.$t(o.name)}</p>`

            }
          })
          outDiv.innerHTML = htmlVal
          return outDiv
        },
        handleMenuClick: (target, item) => {
          this.selectElement = item
          this.model = item.getModel()
          const name = target.getAttribute('data-name')
          if (name === 'delete') this.onDelete()
          if (name === 'attrSet') {
            this.nowStationList = this.graph.save().nodes.filter(o => o.labelId !== 'start' && o.labelId !== 'end')
            this.$refs.attrSetRef.modalFlag = true;
          }
        }
      });
      this.graph.addPlugin(menu);
    },
    // 点击弹窗取消按钮触发
    modalCancel() {
      this.graph.clear();
      this.graph.destroy();
    },
  },
}
</script>

<style scoped lang="less">
@color1: #5aaf72;
@color2: #cccccc;
@color3: #cccccc;
.flow-custom {
  position: relative;
  z-index: 4000;
  width: 100%;
  height: 100%;
  line-height: 1;

  &-bar {
    height: 30px;
    border-bottom: 1px solid @color2;
  }

  &-content {
    position: relative;
    width: 100%;
    height: 100%;

    &-main {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;

      .g6-tooltip {
        background-color: #ff0000;
      }
    }

    div[id$="mini-map-preview"] {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100px;
    }

    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
</style>
