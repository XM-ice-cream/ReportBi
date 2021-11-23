import {requestCenter} from '@/libs/request'
import {exportFile} from "@/libs/tools";

/**
 * 校验表字段值是否已存在
 * @param tableName 表名
 * @param columnField 验证的字段 若多个字段，中间英文逗号隔开 必须和columnValue一一对应
 * @param columnValue 验证的字段值 若多个字段，中间英文逗号隔开
 * @param id 新增时不传，编辑传id
 */
export const isExist = (rule, value, callback, {
  tableName,
  columnField,
  columnValue,
  id,
  tipMsg
}) => {
  if (value && value.trim() === '' || !value) {
    callback(window.$Vue.$t("pleaseEnter"));
  } else {
    let submitData = {
      tableName: tableName,
      id: id,
      detailData: []
    }
    if (columnField && columnField.length) {
      columnField.map((item, index) => {
        submitData.detailData.push({
          columnField: item,
          columnValue: columnValue[index],
        })
      })
    } else {
      submitData.detailData.push({
        columnField: rule.field,
        columnValue: value,
      })
    }
    let request = requestCenter({
      url: '/api/systemcenter/v1/database/isexist',
      method: 'post',
      data: submitData
    })
    request.then((res) => {
      if (res.code === 200) {
        callback();
      } else {
        callback(new Error(tipMsg || window.$Vue.$t("existingPleaseReenter")));
      }
    })
  }
}

// 下载模板
export const downloadReq = (data, templateName, suffix = '.xlsx') => {
  let request = requestCenter({
    url: '/api/systemcenter/anonymous/v1/assets/get',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
  request.then((res) => {
    let blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = templateName + suffix; // 自定义文件名
    exportFile(blob, fileName);
  });
}


/**
 * 校验表用户是否已存在
 */
export const userCheck = (rule, value, callback, {
  tipMsg
}) => {
  if (value && value.trim() === '' || !value) {
    callback(window.$Vue.$t("pleaseEnter"));
  } else {
    let submitData = {
      account: value,
    }
    let request = requestCenter({
      url: '/api/usercenter/v1/user/usercheck',
      method: 'get',
      params: submitData
    })
    request.then((res) => {
      if (res.code === 200) {
        callback();
      } else {
        callback(new Error(tipMsg || window.$Vue.$t("isEmpty")));
      }
    })
  }
}

/**
 * 获取服务器当前时间
 * @param format {String} 要获取的时间格式
 * @returns {Promise<*>}
 */
export const getServersTime = async (format = 'yyyy-MM-dd HH:mm:ss') => {
  const val = await getServersTimeReq({format})
  return val.result
}

const getServersTimeReq = data => {
  return requestCenter({
    url: '/api/systemcenter/anonymous/v1/ip/getdate',
    method: 'get',
    params: data
  })
}
