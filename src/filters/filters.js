/**
 * @param {Number} num 需要查询的数组
 * @description 把数字转换成千分位格式 10000 => "10,000"
 */
export const toThousandFilter = (num = 0) =>  {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * @param {String} str 要转换的字符串
 * @description 首字母大写 john => John
 */
export const uppercaseFirst = (str = '') =>  {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @param {String|Number} str 要转换的字符串或数字
 * @description 百分比转换 0.3883628 => 38.84%
 */
export const percent = (str = '') =>  {
  const keyVal = str * 1
  if (isNaN(keyVal)) return ''
  if (keyVal === 0) return 0
  return `${(keyVal * 100).toFixed(2)}%`
}
