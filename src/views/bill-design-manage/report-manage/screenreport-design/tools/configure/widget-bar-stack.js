export const widgetBarStack = {
    code: 'widgetBarStackChart',
    type: 'chart',
    label: '柱状堆叠图',
    icon: 'iconbianzu23',
    options: {
        // 配置
        setup: [{
                type: 'Input',
                label: '图层名称',
                name: 'layerName',
                required: false,
                placeholder: '',
                value: '柱状堆叠图',
            },
            {
                type: 'i-switch',
                label: '竖展示',
                name: 'verticalShow',
                required: false,
                placeholder: '',
                value: false,
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
                label: '堆叠样式',
                name: 'stackStyle',
                required: false,
                placeholder: '',
                selectOptions: [{
                        code: 'leftRight',
                        name: '左右堆叠'
                    },
                    {
                        code: 'upDown',
                        name: '上下堆叠'
                    },
                ],
                value: 'leftRight'
            },
            [{
                    name: '柱体设置',
                    list: [{
                            type: 'Slider',
                            label: '最大宽度',
                            name: 'maxWidth',
                            required: false,
                            placeholder: '',
                            value: 20,
                        },
                        {
                            type: 'Slider',
                            label: '圆角',
                            name: 'radius',
                            require: false,
                            placeholder: '',
                            value: 5,
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
                            value: true,
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
                            value: '#FFD700'
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
                            value: 'rgba(30, 144, 255, 1)'
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
                            placeholder: '多值以' | '隔开',
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
                            label: 'X轴别名',
                            name: 'xName',
                            required: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '别名颜色',
                            name: 'xNameColor',
                            required: false,
                            placeholder: '',
                            value: '#fff'
                        },
                        {
                            type: 'InputNumber',
                            label: '别名字号',
                            name: 'xNameFontSize',
                            required: false,
                            placeholder: '',
                            value: 14
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
                            type: 'Slider',
                            label: '文字角度',
                            name: 'textAngleX',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'InputNumber',
                            label: '文字间隔',
                            name: 'textInterval',
                            required: false,
                            placeholder: '',
                            value: 1
                        },
                        {
                            type: 'vue-color',
                            label: '文字颜色',
                            name: 'Xcolor',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '文字字号',
                            name: 'fontSizeX',
                            required: false,
                            placeholder: '',
                            value: 14,
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
                            label: 'Y轴别名',
                            name: 'textNameY',
                            require: false,
                            placeholder: '',
                            value: ''
                        },
                        {
                            type: 'vue-color',
                            label: '别名颜色',
                            name: 'NameColorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '别名字号',
                            name: 'NameFontSizeY',
                            required: false,
                            placeholder: '',
                            value: 14,
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
                            type: 'Slider',
                            label: '文字角度',
                            name: 'textAngleY',
                            required: false,
                            placeholder: '',
                            value: 0
                        },
                        {
                            type: 'vue-color',
                            label: '文字颜色',
                            name: 'colorY',
                            required: false,
                            placeholder: '',
                            value: '#fff',
                        },
                        {
                            type: 'InputNumber',
                            label: '文字字号',
                            name: 'fontSizeY',
                            required: false,
                            placeholder: '',
                            value: 14,
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
                        }, {
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
                            value: 14
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
                            type: 'InputNumber',
                            label: '字体大小',
                            name: 'tipsFontSize',
                            required: false,
                            placeholder: '',
                            value: 16
                        },
                        {
                            type: 'vue-color',
                            label: '字体颜色',
                            name: 'lineColor',
                            required: false,
                            placeholder: '',
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
                    }, {
                        type: 'Slider',
                        label: '顶边距(像素)',
                        name: 'marginTop',
                        required: false,
                        placeholder: '',
                        value: 50,
                    }, {
                        type: 'Slider',
                        label: '右边距(像素)',
                        name: 'marginRight',
                        required: false,
                        placeholder: '',
                        value: 40,
                    }, {
                        type: 'Slider',
                        label: '底边距(像素)',
                        name: 'marginBottom',
                        required: false,
                        placeholder: '',
                        value: 10,
                    }, ],
                },
                {
                    name: '自定义配色',
                    list: [{
                        type: 'customColor',
                        label: '',
                        name: 'customColor',
                        required: false,
                        value: [{
                            color: '#ff7f50'
                        }, {
                            color: '#87cefa'
                        }, {
                            color: '#da70d6'
                        }, {
                            color: '#32cd32'
                        }, {
                            color: '#6495ed'
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
                        "axis": "2021-07-25",
                        "name": "A",
                        "data": "12"
                    },
                    {
                        "axis": "2021-07-25",
                        "name": "B",
                        "data": "20"
                    },
                    {
                        "axis": "2021-07-26",
                        "name": "B",
                        "data": "5"
                    },
                    {
                        "axis": "2021-07-27",
                        "name": "A",
                        "data": "15"
                    },
                    {
                        "axis": "2021-07-27",
                        "name": "B",
                        "data": "30"
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
                relactiveDomValue: 'dynamicData',
                chartType: 'widget-stackchart',
                dictKey: 'STACK_PROPERTIES',
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
                value: 500,
            },
            {
                type: 'InputNumber',
                label: '高度',
                name: 'height',
                required: false,
                placeholder: '该容器在1080px大屏中的高度',
                value: 250,
            },
        ],
    }
}