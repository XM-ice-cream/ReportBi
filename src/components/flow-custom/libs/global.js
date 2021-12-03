const nodeColor = '#19be6b';
const nodeLabelColor = '#fff';
// const nodeSelectColor = '#0000ff';
const edgeColor = '#999';
export default {
  defaultNode: {
    size: [100],
    style: {
      fill: nodeColor,
      fillOpacity: 0.5,
      stroke: nodeColor,
      radius: 6,
      cursor: 'pointer',
      lineWidth: 1,
    },
    labelCfg: {
      style: {
        fill: nodeLabelColor,
        cursor: 'pointer',
      }
    },
    linkPoints: {
      top: false,
      right: false,
      bottom: false,
      left: false,
      size: 10,
      lineWidth: 1,
      fill: '#fff',
      stroke: nodeColor,
    },
    anchorPoints: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  },
  defaultEdge: {
    type: 'line',
    style: {
      stroke: edgeColor,
      lineWidth: 1,
      endArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: edgeColor,
      },
      cursor: 'pointer',
    },
    labelCfg: {
      autoRotate: true,
    },
  },
  // 节点应用状态后的样式，默认仅提供 active 和 selected 用户可以自己扩展
  nodeStateStyles: {
    hover: {
      fillOpacity: 0.3,
    },
    click: {
      lineWidth: 2
    },
    select: {
      lineWidth: 3,
      fillOpacity: 0.6,
    },
  },
  edgeStateStyles: {
    hover: {
      lineWidth: 3,
    },
    click: {
      lineWidth: 3,
    }
  },
  modes: {
    default: ["drag-canvas", "zoom-canvas", 'drag-node', "hover-node", "hover-edge",],
    addEdge: ["hover-node", "hover-edge", "click-select",],
    brush: [
      {
        type: 'brush-select',
        trigger: 'drag',
        includeEdges: false,
      }
    ]
  },
  animate: true, // Boolean，切换布局时是否使用动画过度，默认为 false
  fitCenter: true, // Boolean，是否开启画布自适应。开启后图自动适配画布大小。默认为 false
  enabledStack: true, // 设置为true，启用 redo & undo 栈功能
  animateCfg: {
    duration: 500, // Number，一次动画的时长
    easing: 'linearEasing', // String，动画函数
  },
}