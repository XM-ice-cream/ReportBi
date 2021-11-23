// 通用工具类方法
import watermark from "watermark-dom";
import {hasChild} from "./utils";

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return;
  let i = -1;
  let len = arr.length;
  while (++i < len) {
    let item = arr[i];
    fn(item, i, arr);
  }
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some((_) => arr.indexOf(_) > -1);
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1 = {}, obj2 = {}) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */ else return !keysArr1.some((key) => obj1[key] !== obj2[key]);
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @description 字符串左边不足补0
 * @param {String|Number} str 数字或者字符串类型的数字
 * @param {Number} num 要保留的位数
 */
export const padLeftZero = (str = "", num = 2) => String(str).padStart(num, '0')

/**
 * @description 日期格式化
 * @param {Date,String,Number} dateStr 日期
 * @param {*} fmt 格式化样式 yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (dateStr, fmt = "yyyy-MM-dd hh:mm:ss") => {
  if (!dateStr) return "";
  let date = new Date(dateStr);
  let o = {
    "y+": date.getFullYear(),
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + "";
      fmt = fmt.replace(RegExp.$1, str.length > 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
};

/**
 * @description 初始化前n天到今天的日期取值
 * @param n 往前去的天数 number类型
 * @param {*} fmt 格式化样式 yyyy-MM-dd hh:mm:ss
 * @returns {(string|*)[]}
 */
export const initDate = (n = 0, fmt) => {
  let dateObj = new Date();
  let startTime = dateObj.getTime() - n * 24 * 3600 * 1000;
  let endTime = dateObj.getTime();
  return [formatDate(new Date(startTime, fmt)), formatDate(new Date(endTime), fmt)];
};

/**
 * 获取从现在开始之后多少秒的时间戳
 * @param num 秒
 * @return {number} 时间戳
 */
export const getNowToDate = (num = 0) => {
  return new Date().getTime() + num * 1000;
};

/**
 * @description 获取按钮是否显示
 * @param {Object} that 传入的Vue对象
 * @param {Array} btnArr 返回的数组
 */
export const getButtonBoolean = (that, btnArr) => {
  that.$store
    .dispatch("handleGetPageButtonList", that.$config)
    .then((res) => {
      let data = res.result.data ? res.result.data : [];
      btnArr.length = 0;
      data.forEach((item) => {
        if (item.icon !== "null") btnArr.push(item);
      });
    })
    .catch((err) => {
      that.$Msg.error(`${err.status} ${err.statusText}`);
    });
};

/**
 * 添加水印
 * @param name 水印名称
 */
export const watermarkFn = (name = "") => {
  watermark.load({
    watermark_txt: name || "精益生产", // 水印的内容
    watermark_x: 140, // 水印起始位置x轴坐标
    watermark_y: 80, // 水印起始位置Y轴坐标
    watermark_rows: 5, // 水印行数
    watermark_cols: 5, // 水印列数
    watermark_x_space: 190, // 水印x轴间隔
    watermark_y_space: 75, // 水印y轴间隔
    watermark_font: "华文彩云", // 水印字体
    watermark_color: "black", // 水印字体颜色
    watermark_fontsize: "25px", // 水印字体大小
    watermark_alpha: 0.1, // 水印透明度，要求设置在大于等于0.005
    watermark_width: 100, // 水印宽度
    watermark_height: 100, // 水印长度
    watermark_angle: 40, // 水印倾斜度数
  });
};

/**
 * 限制字符串最大长度
 * @param str 被检测的字符串超出
 * @param num 默认最大长度36
 * @return {boolean} 返回的判断 true
 */
export const stringLengthExceed = (str = "", num = 36) => {
  return str.length <= num;
};

/**
 * 楼层线体级别判断
 * @param vm vue实例 this
 * @param category 判断的级别
 * @return {string} 级别信息
 */
export const floorLineType = (vm, category) => {
  const obj = {
    1: vm.$t("zone"),
    2: vm.$t("area"),
    3: vm.$t("floor"),
    4: vm.$t("line"),
  }
  return obj[category];
};

/**
 * 区段类型
 * @param vm vue实例 this
 * @param category 判断的级别
 * @return {string} 级别信息
 */
export const categoryType = (vm, category) => {
  const obj = {
    0: vm.$t("zone"),
    1: vm.$t("process"),
  }
  return obj[category];
};

/**
 * 获取楼层线体图标判断
 * @param category 判断的级别
 * @return {string} 图标信息
 */
export const getZoneIcon = (category) => {
  const obj = {
    1: 'iconfont icon-company',
    2: 'iconfont icon-area',
    3: 'iconfont icon-buffer',
    4: 'iconfont icon-menu',
  }
  return obj[category];
};

/**
 * 接口错误返回判断
 * @param vm vue实例 this
 * @param res 错误返回信息
 * @return {string} 错误信息
 */
export const errorType = (vm, res) => {
  let errorValue = "";
  if (!isNaN(res.errorCode) && res.errorCode > 0) {
    if (res.errorCode === 500) errorValue = res.message;
    else {
      let str = `${res.errorCode}`;
      const msg = vm.$t(`err${str.includes(".") ? str.replace(".", "_") : str}`);
      errorValue = res.message ? `${msg}(${res.message})` : msg;
    }
  } else {
    const msg = vm.$t(`err_${Math.abs(res.errorCode)}`);
    errorValue = res.message ? `${msg}(${res.message})` : msg;
  }
  if (res.status === 200) {
    vm.$store
      .dispatch("handleErrorRecord", {
        ...res,
        errorCodeMsg: errorValue,
      })
      .then(() => {
      });
  }
  return errorValue;
};

/**
 * 获取树组件有效数据
 * @param list 获取的最新数据
 * @param arr 已授权的数据
 * @param data 全部数据
 */
export const getTreeEffectiveData = (list, arr, data) => {
  for (let item of data) {
    if (hasChild(item)) {
      let itemArr = arr.find((o) => item.id === o.parentId);
      if (itemArr && itemArr.children.length === item.children.length) {
        if (hasChild(item)) getTreeEffectiveData(list, arr, item.children);
        else list.push(itemArr);
      } else getTreeEffectiveData(list, arr, item.children);
    } else {
      const listItem = arr.find((x) => x.id === item.id);
      if (listItem) list.push(listItem);
    }
  }
};

/**
 * 树型数据递归添加字段
 * @param list 获取的最新数据
 * @param data 全部数据
 * @param callback 回调函数
 */
export const treeLoop = (list, data, callback) => {
  for (let item of data) {
    let node = {
      ...item,
    };
    delete node.children;
    callback(node, item);
    if (hasChild(item)) {
      node.children = [];
      treeLoop(node.children, item.children, callback);
    }
    list.push(node);
  }
};

/**
 * 将树型数据转为列表数据
 * @param list 获取的最新数据
 * @param data 全部数据
 */
export const initTreeList = (list, data) => {
  for (let item of data) {
    if (hasChild(item)) initTreeList(list, item.children);
    list.push(item);
  }
};

/**
 * 将平级数组换为树型数组
 **/
export const listToTree = (list) => {
  return list.filter((e) => {
    let newArr = list.filter((ele) => {
      if (ele.id === e.parentId) {
        if (!hasChild(ele)) ele.children = [];
        ele.children.push(e);
        return ele;
      }
    });
    return newArr.length === 0;
  });
};

/**
 * 发出提示音
 * @param url 提示音的音频文件地址
 */
export const playSound = (url) => {
  let newAudio = new Audio(url);
  newAudio.src = url;
  newAudio.play().then(() => {
  });
};

/**
 * Input组件内容全选
 * @param refsName
 */
export const inputSelectContent = (refsName) => {
  refsName.$el.children[1] ? refsName.$el.children[1].select() : refsName.$el.children[0].select();
};

/**
 * 清除表单组件已有的值
 * @param item Object
 * @returns {null}
 */
export const clearFormValue = (item) => {
  const obj = {
    input: '',
    number: 0,
    radio: item.children[0].name,
    check: [],
    select: item.multiple ? [] : "",
  }
  return obj[item.type];
};

/**
 * 兼容edge浏览器下载文件
 * @param blob 二进制文件流
 * @param fileName 下载好的文件名
 */
export const exportFile = (blob, fileName) => {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // 创建URL
    link.download = fileName;
    document.body.appendChild(link);
    link.style.display = "none";
    link.click(); // 下载文件
    URL.revokeObjectURL(link.href); // 释放内存
    document.body.removeChild(link);
  }
};

/**
 * html5 FormData分片上传大文件
 * @param {Array} files    :文件对象数组
 * @param {Object} options :配置对象
 */
export const h5FormData = function (files, options) {
  //获取FormData对象
  let getFormData = function (i, size, shardSize, shardCount, file, name) {
    //计算每一片的起始与结束位置
    let start = i * shardSize,
      end = Math.min(size, start + shardSize);
    //构造一个表单，FormData是HTML5新增的
    let form = new FormData();
    form.append("fileData", file.slice(start, end)); //slice方法用于切出文件的一部分
    form.append("name", options.videoName); //文件名
    form.append("assetsType", "video"); //文件类型
    form.append("directory", "static"); //文件类型
    form.append("fileTotal", shardCount); //总片数
    form.append("fileIndex", i + 1); //当前是第几片
    form.append("fileName", `${options.fileName}_${name}`); //文件唯一名称
    form.append("typeId", options.typeId); //文件类型
    form.append("remark", options.remark); //描述
    // 最后一条要穿的字段
    if (shardCount === i + 1) {
      form.append("playSize", "100"); //音频时长
      form.append("coverImage", options.imageFiles[0]); //封面图
    }
    return form;
  };
  //循环文件列表
  for (let i = 0; i < files.length; i++) {
    let file = files[i], //文件对象
      name = file.name, //文件名
      size = file.size, //总大小
      succeed = 0, //上传成功数量
      shardSize = 2 * 1024 * 1024, //以2MB为一个分片
      shardCount = Math.ceil(size / shardSize); //总片数
    //ajax提交后台
    if (typeof options.callback == "function")
      options.callback(file, name, size, succeed, shardSize, shardCount, getFormData);
  }
};

/**
 * 前端生成 uuid
 * @param len 生成uuid的长度
 * @param radix 生成uuid的基数
 * @returns {string}
 */
export const uuid = (len, radix) => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r = 0;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
};

//获取音频时长
export const getVideoDuration = function (file, callback) {
  let url = URL.createObjectURL(file);
  let audioElement = new Audio(url);
  audioElement.addEventListener("loadedmetadata", function () {
    let duration = audioElement.duration;
    callback && callback(duration);
  });
};

/**
 * 语音播报
 * text – 要合成的文字内容，字符串
 * lang – 使用的语言，字符串， 例如：“zh-cn”
 * voiceURI – 指定希望使用的声音和服务，字符串
 * volume – 声音的音量，区间范围是0到1，默认是1
 * rate – 语速，数值，默认值是1，范围是0.1到10，表示语速的倍数，例如2表示正常语速的两倍。
 * pitch – 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
 * closeSpeakTime – 表示关闭语音播报的时间，值为毫秒数，为0时不关闭。默认值为0
 */
export const speak = ({
                        text = "",
                        pitch = 2,
                        lang = "zh-CN",
                        rate = 1,
                        volume = 1,
                        closeSpeakTime = 0,
                      }) => {
  const msg = Object.assign(new SpeechSynthesisUtterance(), {
    text,
    lang,
    volume,
    rate,
    pitch,
  });
  speechSynthesis.speak(msg);
  // 关闭语音
  if (closeSpeakTime) {
    setTimeout(() => {
      speechSynthesis.cancel(msg);
    }, closeSpeakTime);
  }
};
//重置 operationType 字符串
export const formatOperationType = (type) => {
  let operationTypeString = {
    0: "[出库]正常可用",
    1001: "进库房",
    1002: "进保养",
    1003: "出保养",
    1004: "出库",
  };
  return operationTypeString[type] || "";
};

//重置 厂商客户管理类型 字符串
export const customerVendorType = (type) => {
  let customerVendorTypeString = {
    0: "供应商",
    1: "厂商",
    2: "客户",
  };
  return customerVendorTypeString[type] || "";
};

// 判断是否为手机号
export const isTel = (rule, value, callback) => {
  let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value && !reg.test(value)) {
    callback(new Error("请输入正确的电话号码"));
  } else {
    callback();
  }
};

//重置设备管理类型字符串
export const eqpCategory = (type) => {
  let eqpCategoryString = {
    0: "区域",
    1: "大类",
    2: "设备",
  };
  return eqpCategoryString[type] || "";
};

// 判断位号和用量是否一致
export const isLocationAndQtyOk = (rule, value, callback, vm) => {
  let qty = vm.submitData.qty || 0;
  let location = vm.submitData.location || "";
  let isSubmit = getLocation(location).length === qty;
  if (isSubmit) {
    callback();
  } else {
    callback(new Error(vm.$t("ebomAvlLocation")));
  }
};

// 格式化位号
export const getLocation = (str = "") => {
  return str
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o);
};

// 重置日期格式
export const renderDate = (h, params, fmt = "yyyy-MM-dd hh:mm:ss") => {
  let date = params.row[params.column.key];
  return h("div", formatDate(date, fmt) || null);
};
// 是否有效 返回一个span标签
export const renderIsEnabled = (h, params) => {
  let type = params.row[params.column.key];
  return h(
    "span",
    {
      style: {
        color: "#fff",
        backgroundColor: type === 1 ? "#ff9900" : "#ccc",
        padding: "1px 10px",
        margin: "3px 0",
        borderRadius: "3px",
        cursor: "default",
      },
    },
    type === 1 ? window.$Vue.$t("yes") : window.$Vue.$t("no")
  );
};

export const renderIsPictures = (h, params) => {
  let type = params.row[params.column.key];
  return h(
    "span",
    {
      style: {
        color: "#fff",
        backgroundColor: type && type.length > 0 ? "#ff9900" : "#ccc",
        padding: "1px 10px",
        margin: "3px 0",
        borderRadius: "3px",
        cursor: "default",
      },
    },
    type && type.length > 0 ? window.$Vue.$t("yes") : window.$Vue.$t("no")
  );
};

// 判断状态类表格字段 返回一个render函数span标签
export const renderState = (h, color, name, callback) => {
  const isCallback = callback && Object.prototype.toString.call(callback) === "[object Function]";
  return h(
    "span",
    {
      style: {
        color: "#fff",
        backgroundColor: color,
        padding: "1px 10px",
        margin: "3px 0",
        borderRadius: "3px",
        cursor: isCallback ? "pointer" : "default",
      },
      on: {
        click(e) {
          if (isCallback) callback(e);
        },
      },
    },
    name
  );
};

// 判断状态类表格字段 返回一个render函数span标签
export const renderColorSpan = (h, color, value) => {
  return h(
    "span",
    {
      style: {
        color: color,
      },
    },
    value
  );
};

/**
 * 检查数组 data 里是否包含对象 node 数据 id为关键字 流程组件判断画布是否存在当前站数据
 * @param node
 * @param data
 * @return true 包含 false 不包含
 */
export const isAddNode = (node, data) => {
  let val = data.filter((o) => o.labelId === node.id).length > 0;
  return val;
};

// 重置是否打印
export const renderPrinted = (h, params) => {
  let date = params.row[params.column.key];
  let printedString = {
    0: "未打印",
    1: "已打印",
  };
  return h("div", printedString[date] || null);
};

// 是否打印成功
export const renderPrintStatus = (h, params) => {
  let date = params.row[params.column.key];
  let printedString = {
    0: "打印失败",
    1: "打印成功",
  };
  return h("div", printedString[date] || null);
};

/**
 * 深度克隆对象
 * @param origin 被克隆的对象
 * @param target 目标对象，可以不写
 * @return object 返回克隆好的对象
 */
export const deepClone = (origin, target) => {
  target = target || {};
  let toStr = Object.prototype.toString;
  let hasOwnPro = Object.prototype.hasOwnProperty;
  let arrStr = "[object Array]";
  for (let prop in origin) {
    if (hasOwnPro.call(origin, prop)) {
      if (typeof origin[prop] == "object" && origin[prop] !== null) {
        target[prop] = toStr.call(origin[prop]) === arrStr ? [] : {};
        deepClone(origin[prop], target[prop]);
      } else target[prop] = origin[prop];
    }
  }
  return target;
};

//判断是否为八位数日期格式
export const isDateFormat = (rule, value, callback) => {
  let reg = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)/;
  if (value && !reg.test(value)) {
    callback(new Error("格式错误"));
  } else {
    callback();
  }
};

// 重置设备名称类别
export const rendereqpCategory = (h, params) => {
  let date = params.row[params.column.key];
  let renderString = {
    1: window.$Vue.$t("equipment"),
    2: window.$Vue.$t("brand"),
    3: window.$Vue.$t("modelNum"),
    4: window.$Vue.$t("vendor"),
  };
  return h("div", renderString[date] || null);
};

/**
 * 获取设备名称图标判断
 * @param category 判断的级别
 * @return {string} 图标信息
 */
export const getEqpNameIcon = (category) => {
  let renderString = {
    1: "iconfont icon-apps",
    2: "icon-buffer",
  };
  return renderString[category] || "";
};

// 验证输入正整数和小数点位数
export const formatNumber = (value, decimalNum) => {
  let str = "^\\d+(?:\\.\\d{0," + decimalNum + "})?";
  let reg = new RegExp(str);
  value = value.toString().match(reg);
  if (value && value[0]) {
    return Number(value[0]);
  } else {
    return null;
  }
};

// 防止快速点击
let timer = 0;
export const preventQuickClicks = (callback, timeVal = 500) => {
  if (timer) clearInterval(timer);
  timer = setTimeout(() => {
    if (callback && Object.prototype.toString.call(callback) === "[object Function]") callback();
  }, timeVal);
};

//回车触发tab
export const enterTriggerTab = (evt) => {
  //document.all可以判断浏览器是否是IE，是页面内所有元素的一个集合
  let isie = document.all ? true : false;
  let key;
  let srcobj;
  // if the agent is an IE browser, it's easy to do this.
  if (isie) {
    key = event.keyCode;
    srcobj = event.srcElement; //event.srcElement，触发这个事件的源对象
  } else {
    key = evt.which;
    srcobj = evt.target; //target是Firefox下的属性
  }
  if (
    key === 13 &&
    srcobj.type !== "button" &&
    srcobj.type !== "submit" &&
    srcobj.type !== "reset" &&
    srcobj.type !== "textarea" &&
    srcobj.type !== ""
  ) {
    if (isie) event.keyCode = 9;
    //设置按键为tab键
    else {
      let el = getNextElement(evt.target);
      if (
        el.type !== "hidden" //nothing to do here.
      ) ;
      else while (el.type === "hidden") el = getNextElement(el);
      if (!el) return false;
      else {
        el.focus();
        el.select(); //选中当前行数据
      }
    }
  }
};
//得到回车下一个元素
export const getNextElement = (field) => {
  let form = field.form;
  for (var e = 0; e < form.elements.length; e++) {
    if (field === form.elements[e]) break;
  }
  return form.elements[++e % form.elements.length];
};

/**
 * 剪贴板功能
 * @param content 要复制的内容
 * @param callback 回调函数
 */
export const copyToClip = (content, callback) => {
  let aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  typeof callback === "function" && callback();
};

//表单验证当前字段的值是否和其他值相等 data数据源
export const isEqual = (rule, value, callback, data = []) => {
  if (value && data.includes(value)) {
    callback(new Error("当前值与其它值有重复"));
  } else {
    callback();
  }
};

/**
 * 表单内该值是否需要校验
 * @param isTrue 是否为true
 * @param msg 提示信息
 */
export const isCheckInForm = (rule, value, callback, {isTrue = true, msg = ""}) => {
  let valueCheck = true;
  if (rule.type === "string") {
    valueCheck = !value;
  } else if (rule.type === "array") {
    valueCheck = value.length === 0;
  } else if (rule.type === "date") {
    valueCheck = !(value instanceof Date);
  } else if (rule.type === "number") {
    valueCheck = value === null;
  }
  if (isTrue && valueCheck) {
    callback(new Error(msg));
  } else {
    callback();
  }
};

/**
 * 累加器
 * @param data 要累加的数据
 * @param key 累加关键字(data为复杂数组是必须传)
 */
export const reduceNumber = (data = [], key) => {
  let total = 0;
  if (data.length) {
    if (typeof data[0] === "number") {
      total = data.reduce((prev, cur) => prev + cur, 0);
    } else total = data.reduce((prev, cur) => prev + cur[key], 0);
  }
  return total;
};

/**
 * 整数反转
 * @param {number} x
 * @return {number} 返回值
 */
export const reverseInt = (x = 0) => {
  let num = 0;
  while (x !== 0) {
    if (num > 2147483647 || num < -2147483648) return 0;
    num = num * 10 + (x % 10);
    x = (x / 10) | 0;
  }
  return num;
};

/**
 * 本地获取上传图片地址
 * @param file 上传文件
 * @returns {Promise} base64图片文件
 */
export const getUploadImageUrl = (file) => {
  let reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};
/**
 * 图片压缩
 * @param imgSrc [string]图片路径
 * @returns {Promise} base64图片文件
 */
export const compress = (imgSrc) => {
  let img = new Image();
  img.src = imgSrc;
  return new Promise(function (resolve) {
    img.onload = function () {
      let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      //利用canvas进行绘图
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //将原来图片的质量压缩到原先的0.2倍。
      let data = canvas.toDataURL("image/jpeg", 0.6); //data url的形式
      resolve(data);
    };
  });
};

/**
 * base64格式转化为file
 * @param data base64图片文件
 */
export const base64ToFile = (data) => {
  let binary = atob(data.split(",")[1]);
  let mime = data.split(",")[0].match(/:(.*?);/)[1];
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let fileData = new Blob([new Uint8Array(array)], {
    type: mime,
  });
  let file = new File([fileData], `${new Date().getTime()}.png`, {
    type: mime,
  });
  return file;
};

/**
 * 字符串中空格、',' 、回车转数组 '1,2 3'转成['1','2','3']
 * @param str 待处理字符串
 */
export const commaSplitString = (str = "") => {
  let arr = [];
  let strArr = str.split(",");
  strArr.map((item) => {
    item.split(/\s+/).map((o) => {
      if (o) arr.push(o);
    });
  });
  return [...new Set(arr)];
};

/**
 * 获取文件下载地址
 *@param fileId 文件id
 */
export const showFileUrl = (fileId, downLoad = false) => {
  let fileUrl =
    window.localStorage.getItem("configip") +
    "/api/systemcenter/anonymous/v1/assets/" +
    (downLoad ? "get" : "show") +
    "?fileId=" +
    fileId;
  return fileUrl;
};

//禁止输入
let timearr = [0, 0];
export const inhibitingInput = (event, callback) => {
  //开发模式允许输入
  if (process.env.NODE_ENV === "development") {
    return;
  }
  let value = event.target.value;
  if (event.target.value.length % 2 != 0) {
    //求余数不为0是奇数
    timearr[0] = new Date().getTime();
  } else {
    timearr[1] = new Date().getTime();
  }
  //当输入第二位时判断两次输入的间隔，判断是否为手动输入，间隔过长清空值
  if (value.length > 1 && Math.abs(timearr[1] - timearr[0]) > 60) {
    if (typeof callback == "function") {
      callback();
    }
    timearr = [0, 0];
  }
};
