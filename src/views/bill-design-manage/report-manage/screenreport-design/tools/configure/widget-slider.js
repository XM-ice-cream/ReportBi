/*
 * @Descripttion: 轮播图
 * @version: 
 * @Author: qianlishi
 * @Date: 2021-08-29 07:08:53
 * @LastEditors: qianlishi
 * @LastEditTime: 2021-09-28 14:19:30
 */
export const widgetSliders =  {
    code: 'widget-slider',
    type: 'html',
    label: '轮播图片',
    icon: 'slider',
    options: {
      // 配置
      setup: [
        {
          type: 'Input',
          label: '图层名称',
          name: 'layerName',
          required: false,
          placeholder: '',
        },
        {
          type: 'i-switch',
          label: '隐藏图层',
          name: 'hideLayer',
          required: false,
          placeholder: '',
        },
        {
          type: 'Select',
          label: '轮播方向',
          name: 'tabDirection',
          required: false,
          placeholder: '',
        },
        {
          type: 'Select',
          label: '选择器',
          name: 'tabSelector',
          required: false,
          placeholder: '',
        },
        {
          type: 'InputNumber',
          label: '轮播时间',
          name: 'tabTime',
          required: false,
          placeholder: '',
        },
      ],
      // 数据
      data: [],
      // 坐标
      position: [
        {
          type: 'InputNumber',
          label: '左边距',
          name: 'left',
          required: true,
          placeholder: '',
        },
        {
          type: 'InputNumber',
          label: '上边距',
          name: 'top',
          required: true,
          placeholder: '',
        },
        {
          type: 'InputNumber',
          label: '宽度',
          name: 'width',
          required: true,
          placeholder: '该容器在1920px大屏中的宽度',
        },
        {
          type: 'InputNumber',
          label: '高度',
          name: 'height',
          required: true,
          placeholder: '该容器在1080px大屏中的高度',
        },
      ],
    }
  }