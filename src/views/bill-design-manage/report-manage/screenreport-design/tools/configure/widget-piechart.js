export const widgetPiechart = {
    code: 'widget-piechart',
    type: 'chart',
    label: '饼图',
    icon: 'iconicon_tubiao_bingtu',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '饼图',
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'background',
                required: false,
                placeholder: '',
                value: ''
            },
            {
                type: 'Select',
                label: '饼图样式',
                name: 'piechartStyle',
                required: false,
                placeholder: '',
                selectOptions: [{
                        code: 'shixin',
                        name: '实心饼图'
                    },
                    {
                        code: 'kongxin',
                        name: '空心饼图'
                    },
                ],
                value: 'shixin'
            },
            [{
                    name: '标题设置',
                    list: [{
                            type: 'i-switch',
                            label: '标题',
                            name: 'isNoTitle',
                            required: false,
                            placeholder: '',
                            value: true
                        },
                        {
                            type: 'Input',
                            label: '标题',
                            name: 'titleText',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'textColor',
                            required: false,
                            placeholder: '',
                            value: '#fff'
                        },
                        {
                            type: 'Select',
                            label: '字体粗细',
                            name: 'textFontWeight',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'normal',
                                    name: '正常'
                                },
                                {
                                    code: 'bold',
                                    name: '粗体'
                                },
                                {
                                    code: 'bolder',
                                    name: '特粗体'
                                },
                                {
                                    code: 'lighter',
                                    name: '细体'
                                }
                            ],
                            value: 'normal'
                        },
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'textFontSize',
                            required: false,
                            placeholder: '',
                            value: 20
                        },
                        {
                            type: 'Select',
                            label: '字体位置',
                            name: 'textAlign',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'center',
                                    name: '居中'
                                },
                                {
                                    code: 'left',
                                    name: '左对齐'
                                },
                                {
                                    code: 'right',
                                    name: '右对齐'
                                },
                            ],
                            value: 'left'
                        },
                        {
                            type: 'Input',
                            label: '副标题',
                            name: 'subText',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'subTextColor',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'Select',
                            label: '字体粗细',
                            name: 'subTextFontWeight',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'normal',
                                    name: '正常'
                                },
                                {
                                    code: 'bold',
                                    name: '粗体'
                                },
                                {
                                    code: 'bolder',
                                    name: '特粗体'
                                },
                                {
                                    code: 'lighter',
                                    name: '细体'
                                }
                            ],
                            value: 'normal'
                        },
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'subTextFontSize',
                            required: false,
                            placeholder: '',
                            value: 12
                        },
                    ],
                },
                {
                    name: '数值设定',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'isShow',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: '数值',
                            name: 'numberValue',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: '百分比',
                            name: 'percentage',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'fontSize',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'subTextColor',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'Select',
                            label: '字体粗细',
                            name: 'fontWeight',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'normal',
                                    name: '正常'
                                },
                                {
                                    code: 'bold',
                                    name: '粗体'
                                },
                                {
                                    code: 'bolder',
                                    name: '特粗体'
                                },
                                {
                                    code: 'lighter',
                                    name: '细体'
                                }
                            ],
                            value: 'normal'
                        },
                    ],
                },
                {
                    name: '提示语设置',
                    list: [{
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'fontSize',
                            required: false,
                            placeholder: '',
                            value: 12
                        },
                        {
                            type: 'vue-color',
                            label: '网格线颜色',
                            name: 'lineColor',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                    ],
                },
                {
                    name: '图例操作',
                    list: [{
                            type: 'i-switch',
                            label: '图例',
                            name: 'isShowLegend',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'lengedColor',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'Input',
                            label: '字体大小',
                            name: 'lengedFontSize',
                            required: false,
                            placeholder: '',
                            value: 16,
                        },
                        {
                            type: 'InputNumber',
                            label: '图例宽度',
                            name: 'lengedWidth',
                            required: false,
                            placeholder: '',
                            value: 15,
                        },
                        {
                            type: 'Select',
                            label: '横向位置',
                            name: 'lateralPosition',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'left',
                                    name: '左对齐'
                                },
                                {
                                    code: 'right',
                                    name: '右对齐'
                                },
                            ],
                            value: ''
                        },
                        {
                            type: 'Select',
                            label: '纵向位置',
                            name: 'longitudinalPosition',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'top',
                                    name: '顶部'
                                },
                                {
                                    code: 'bottom',
                                    name: '底部'
                                },
                            ],
                            value: ''
                        },
                        {
                            type: 'Select',
                            label: '布局前置',
                            name: 'layoutFront',
                            required: false,
                            placeholder: '',
                            selectOptions: [{
                                    code: 'vertical',
                                    name: '竖排'
                                },
                                {
                                    code: 'horizontal',
                                    name: '横排'
                                },
                            ],
                            value: ''
                        },
                    ],
                },
                {
                    name: '自定义配色',
                    list: [{
                        type: 'customColor',
                        label: '',
                        name: 'customColor',
                        required: false,
                        value: [{
                            color: '#0CD2E6'
                        }, {
                            color: '#00BFA5'
                        }, {
                            color: '#FFC722'
                        }, {
                            color: '#886EFF'
                        }, {
                            color: '#008DEC'
                        }],
                    }, ],
                },
            ],
        ],
        // 数据
        data: [{
                type: 'RadioGroup',
                label: '数据类型',
                name: 'dataType',
                require: false,
                placeholder: '',
                selectValue: true,
                selectOptions: [{
                        code: 'staticData',
                        name: '静态数据',
                    },
                    {
                        code: 'dynamicData',
                        name: '动态数据',
                    },
                ],
                value: 'staticData',
            },
            {
                type: 'InputNumber',
                label: '刷新时间(毫秒)',
                name: 'refreshTime',
                relactiveDom: 'dataType',
                relactiveDomValue: 'dynamicData',
                value: 5000
            },
            {
                type: 'Button',
                label: '静态数据',
                name: 'staticData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                relactiveDomValue: 'staticData',
                value: [{
                    "value": 1048,
                    "name": "搜索引擎"
                }, {
                    "value": 735,
                    "name": "直接访问"
                }, {
                    "value": 580,
                    "name": "邮件营销"
                }, {
                    "value": 484,
                    "name": "联盟广告"
                }, {
                    "value": 300,
                    "name": "视频广告"
                }]
            },
            {
                type: 'dycustComponents',
                label: '',
                name: 'dynamicData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                chartType: 'widget-piechart',
                relactiveDomValue: 'dynamicData',
                dictKey: 'PIE_PROPERTIES',
                value: '',
            },
        ],
        // 坐标
        position: [{
                type: 'InputNumber',
                label: '左边距',
                name: 'left',
                required: false,
                placeholder: '',
                value: 0,
            },
            {
                type: 'InputNumber',
                label: '上边距',
                name: 'top',
                required: false,
                placeholder: '',
                value: 0,
            },
            {
                type: 'InputNumber',
                label: '宽度',
                name: 'width',
                required: false,
                placeholder: '该容器在1920px大屏中的宽度',
                value: 400,
            },
            {
                type: 'InputNumber',
                label: '高度',
                name: 'height',
                required: false,
                placeholder: '该容器在1080px大屏中的高度',
                value: 200,
            },
        ],
    }
}