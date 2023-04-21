import OkTips from '@/assets/tipsMusic/OK.mp3'
import NgTips from '@/assets/tipsMusic/NG.mp3'
import WarningTips from '@/assets/tipsMusic/warning.mp3'
import dayjs from "dayjs";
export default {
  // 配置显示在浏览器标签的title
  title: '白泽报表系统',
  // 是否使用国际化，默认为false
  // 如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
  // 用来在菜单中显示文字
  useI18n: true,
  // 默认打开的首页的路由name值，默认为home
  homeName: 'home',
  // 接口默认请求地址
  baseUrl: {
    // dev: 'http://10.32.44.33:8000',
    dev: 'http://10.32.42.30:8000', // window系统正式地址
    // dev: 'http://10.35.233.134:5700',//测试
    pro: 'http://10.32.44.33:8000', // 测试服务地址
    // pro: 'http://10.32.42.30:8000', // window系统正式地址
    // pro: 'http://10.171.11.89:8000', // 越南Linux系统正式地址
  },
  // 分页每页条数切换的配置
  pageSizeList: [5, 30, 50, 100],
  // 分页默认显示数
  pageSizeDefault: 30,
  // 分页配置
  pageConfig: {
    pageSize: 30, // 每页显示数
    pageIndex: 1, // 当前页
    orderField: 'CREATEDATE', // 排序字段
    ascending: false, // 排序类型true升序 false降序
    total: 0, //  总条数
    totalPage: 0 //  总页数
  },
  // 需要加载的插件
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  systemFlag: ['baize'],
  tipsVoice: {
    OkTips,
    NgTips,
    WarningTips
  },
  // 不需要路由权限页面
  nameList: ['oee', 'oeepie'],
  // 首页公共报表
  controlList: [{
      title: 'usbControl',
      to: 'usb'
    },
    {
      title: 'antivirus',
      to: 'antivirus'
    },
    {
      title: 'steelControl',
      to: 'steel'
    },
    {
      title: 'gasControl',
      to: 'gas'
    },
    {
      title: 'twMaterialReportControl',
      to: 'twmaterialreport'
    },
    {
      title: 'oee',
      to: 'oee'
    },
    {
      title: 'oeepie',
      to: 'oeepie'
    },
    {
      title: 'thb',
      to: 'thb-mongo'
    },
    {
      title: 'stove-tm',
      to: 'stove-tm'
    },
    {
      title: 'stove-tm-spc',
      to: 'stove-tm-spc'
    },
    {
      title: 'stove-tm-rhi',
      to: 'stove-tm-rhi'
    },
    {
      title: 'e-sensor-board',
      to: 'e-sensor-board'
    },
    {
      title: 'quality-check-material',
      to: 'quality-check-material'
    },
  ],
  // reflow报表菜单
  reflowList: [{
      title: 'stove-tm',
      to: 'stove-tm'
    },
    {
      title: 'stove-tm-spc',
      to: 'stove-tm-spc'
    },
    {
      title: 'stove-tm-rhi',
      to: 'stove-tm-rhi'
    },
    {
      title: 'e-sensor-board',
      to: 'e-sensor-board'
    },
  ],
  // 全局表格配置
  tableConfig: {
    border: false, //全局表格边框是否展示
    highlightRow: true, //全局表格高亮是否开启
    loading: true, //全局表格加载是否开启
    height: 200, //全局表格初始高度

  },
  datetimeOptions: {
    shortcuts: [{
        text: "今天",
        value() {
          return new Date();
        },
      },
      {
        text: "一周前",
        value() {
          const date = new Date();
          date.setTime(dayjs(date).subtract(1, "week"));
          return date;
        },
      },
      {
        text: "一月前",
        value() {
          const date = new Date();
          date.setTime(dayjs(date).subtract(1, "month"));
          return date;
        },
      },
      {
        text: "半年前",
        value() {
          const date = new Date();
          date.setTime(dayjs(date).subtract(6, "month"));
          return date;
        },
      },
    ],
  },
  _setLoginOutTimeValue: 3600 * 12, // 秒, 自动登出时间
  _setTimeValue: 3600 * 4, // 秒, 刷新token等的间隔时间
  _setCheckTimeValue: 10, // 秒, 设置全局定时器的刷新频率
  tipTime: 10, // 秒, 全局提示时间
}