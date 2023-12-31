export const widgetLinechart = {
    code: 'widget-linechart',
    type: 'chart',
    label: '折线图',
    icon: 'icontubiaozhexiantu',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '折线图',
            },
            {
                type: 'vue-color',
                label: '背景颜色',
                name: 'background',
                required: false,
                placeholder: '',
                value: ''
            }, {
                type: 'Slider',
                label: '滚动条显示百分比',
                name: 'dataZoomEnd',
                require: false,
                placeholder: '',
                value: 100,
            },
            [{
                    name: '折线设置',
                    list: [{
                            type: 'i-switch',
                            label: '标记点',
                            name: 'markPoint',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Slider',
                            label: '点大小',
                            name: 'pointSize',
                            required: false,
                            placeholder: '',
                            value: 10,
                        },
                        {
                            type: 'i-switch',
                            label: '平滑曲线',
                            name: 'smoothCurve',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'i-switch',
                            label: '面积堆积',
                            name: 'area',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Slider',
                            label: '面积厚度',
                            name: 'areaThickness',
                            required: false,
                            placeholder: '',
                            value: 5,
                        },
                        {
                            type: 'Slider',
                            label: '线条宽度',
                            name: 'lineWidth',
                            required: false,
                            placeholder: '',
                            value: 4,
                        },
                    ],
                },
                {
                    name: '标题设置',
                    list: [{
                            type: 'i-switch',
                            label: '标题',
                            name: 'isNoTitle',
                            required: false,
                            placeholder: '',
                            value: false
                        },
                        {
                            type: 'Input',
                            label: '标题',
                            name: 'titleText',
                            required: false,
                            placeholder: '',
                            value: '',
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
                            label: '字体字号',
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
                            value: 'center'
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
                            value: '#fff'
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
                            label: '字体字号',
                            name: 'subTextFontSize',
                            required: false,
                            placeholder: '',
                            value: 20
                        },
                    ],
                },
                {
                    name: '图例操作',
                    list: [{
                            type: 'i-switch',
                            label: '图例显示',
                            name: 'isShowLegend',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '图例名称',
                            name: 'legendName',
                            required: false,
                            placeholder: '',
                            value: ''
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
                            type: 'InputNumber',
                            label: '字体字号',
                            name: 'lengedFontSize',
                            required: false,
                            placeholder: '',
                            value: 12,
                        },
                        {
                            type: 'InputNumber',
                            label: '图例宽度',
                            name: 'lengedWidth',
                            required: false,
                            placeholder: '',
                            value: 12,
                        },
                        {
                            type: 'Select',
                            label: '横向位置',
                            name: 'lateralPosition',
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
                            value: 'center'
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
                            value: 'top'
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
                            value: 'horizontal'
                        },
                    ],
                },
                {
                    name: 'X轴设置',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'hideX',
                            required: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '坐标名',
                            name: 'xName',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '坐标名颜色',
                            name: 'nameColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '坐标字号',
                            name: 'nameFontSizeX',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'Xcolor',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '数值字号',
                            name: 'fontSizeX',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'Slider',
                            label: '数值角度',
                            name: 'textAngle',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'InputNumber',
                            label: '数值间隔',
                            name: 'textInterval',
                            required: false,
                            placeholder: '',
                            value: 1
                        },
                        {
                            type: 'i-switch',
                            label: '轴反转',
                            name: 'reversalX',
                            required: false,
                            placeholder: '',
                            value: false
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'i-switch',
                            label: '分割线显示',
                            name: 'isShowSplitLineX',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'vue-color',
                            label: '分割线颜色',
                            name: 'splitLineColorX',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        }, {
                            type: 'InputNumber',
                            label: '多轴间距',
                            name: 'spaceX',
                            required: false,
                            placeholder: '',
                            value: 20,
                        }
                    ],
                },
                {
                    name: 'Y轴设置',
                    list: [{
                            type: 'i-switch',
                            label: '显示',
                            name: 'isShowY',
                            require: false,
                            placeholder: '',
                            value: true,
                        },
                        {
                            type: 'Input',
                            label: '坐标名',
                            name: 'textNameY',
                            require: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '坐标名颜色',
                            name: 'nameColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '坐标字号',
                            name: 'namefontSizeY',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'vue-color',
                            label: '数值颜色',
                            name: 'colorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '数值字号',
                            name: 'fontSizeY',
                            required: false,
                            placeholder: '',
                            value: 14,
                        },
                        {
                            type: 'Slider',
                            label: '数值角度',
                            name: 'ytextAngle',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'i-switch',
                            label: '缩放',
                            name: 'scale',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'InputNumber',
                            label: '均分',
                            name: 'splitNumber',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'i-switch',
                            label: '轴反转',
                            name: 'reversalY',
                            required: false,
                            placeholder: '',
                            value: false
                        },
                        {
                            type: 'vue-color',
                            label: '轴颜色',
                            name: 'lineColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'i-switch',
                            label: '分割线显示',
                            name: 'isShowSplitLineY',
                            require: false,
                            placeholder: '',
                            value: false,
                        },
                        {
                            type: 'vue-color',
                            label: '分割线颜色',
                            name: 'splitLineColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        }
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
                            value: false
                        },
                        {
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'fontSize',
                            required: false,
                            placeholder: '',
                            value: 12
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'subTextColor',
                            required: false,
                            placeholder: '',
                            value: '#fff'
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
                            type: 'Input',
                            label: '字体大小',
                            name: 'fontSize',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'lineColor',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                    ],
                },
                {
                    name: '坐标轴边距设置',
                    list: [{
                            type: 'Slider',
                            label: '左边距(像素)',
                            name: 'marginLeft',
                            required: false,
                            placeholder: '',
                            value: 10,
                        },
                        {
                            type: 'Slider',
                            label: '顶边距(像素)',
                            name: 'marginTop',
                            required: false,
                            placeholder: '',
                            value: 50,
                        },
                        {
                            type: 'Slider',
                            label: '右边距(像素)',
                            name: 'marginRight',
                            required: false,
                            placeholder: '',
                            value: 40,
                        },
                        {
                            type: 'Slider',
                            label: '底边距(像素)',
                            name: 'marginBottom',
                            required: false,
                            placeholder: '',
                            value: 10,
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
                            color: '#1E90FF'
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
                        "axis": "苹果",
                        "data": 1000
                    },
                    {
                        "axis": "三星",
                        "data": 2229
                    },
                    {
                        "axis": "小米",
                        "data": 3879
                    },
                    {
                        "axis": "oppo",
                        "data": 2379
                    },
                    {
                        "axis": "vivo",
                        "data": 4079
                    },
                ],
            },
            {
                type: 'dycustComponents',
                label: '',
                name: 'dynamicData',
                required: false,
                placeholder: '',
                relactiveDom: 'dataType',
                chartType: 'widget-linechart',
                dictKey: 'LINE_PROPERTIES',
                relactiveDomValue: 'dynamicData',
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