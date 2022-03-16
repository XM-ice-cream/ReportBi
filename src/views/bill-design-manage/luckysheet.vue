<template>
  <div class="hello">
    <div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:100%;height:90%;left: 0px;top: 50px;"></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {

    }

  },
  mounted () {
    $(function () {
      luckysheet.create({
        container: 'luckysheet', // 设定DOM容器的id
        title: 'Luckysheet Demo', // 设定表格名称
        lang: 'zh', // 设定表格语言
        plugins: ['chart'],
        data: [
          {
            "name": "Cell", //工作表名称
            "color": "", //工作表颜色
            "index": 0, //工作表索引
            "status": 1, //激活状态
            "order": 0, //工作表的下标
            "hide": 0,//是否隐藏
            "row": 36, //行数
            "column": 18, //列数
            "defaultRowHeight": 19, //自定义行高
            "defaultColWidth": 73, //自定义列宽
            "celldata": [], //初始化使用的单元格数据
            "config": {
              "merge": {}, //合并单元格
              "rowlen": {}, //表格行高
              "columnlen": {}, //表格列宽
              "rowhidden": {}, //隐藏行
              "colhidden": {}, //隐藏列
              "borderInfo": {}, //边框
              "authority": {}, //工作表保护

            },
            "scrollLeft": 0, //左右滚动条位置
            "scrollTop": 315, //上下滚动条位置
            "luckysheet_select_save": [], //选中的区域
            "calcChain": [],//公式链
            "isPivotTable": false,//是否数据透视表
            "pivotTable": {},//数据透视表设置
            "filter_select": {},//筛选范围
            "filter": null,//筛选配置
            "luckysheet_alternateformat_save": [], //交替颜色
            "luckysheet_alternateformat_save_modelCustom": [], //自定义交替颜色	
            "luckysheet_conditionformat_save": {},//条件格式
            "frozen": {}, //冻结行列配置
            "chart": [], //图表配置
            "zoomRatio": 1, // 缩放比例
            "image": [], //图片
            "showGridLines": 1, //是否显示网格线
            "dataVerification": {} //数据验证配置
          },
          {
            "name": "Sheet2",
            "color": "",
            "index": 1,
            "status": 0,
            "order": 1,
            "celldata": [],
            "config": {}
          },
          {
            "name": "Sheet3",
            "color": "",
            "index": 2,
            "status": 0,
            "order": 2,
            "celldata": [],
            "config": {},
          }
        ]
      });
    });
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
