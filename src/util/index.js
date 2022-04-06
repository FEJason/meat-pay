/**
 * 配置全局方法
 */
import { toFixeds, transMoney, accAdd, accSub, accDiv, accMul } from './formatAmount'
import timeFormat from './timeFormat'

const $yj = {
  // 数字转金额格式
  transMoney,
  // 时间格式化
  timeFormat,
  // 加
  accAdd,
  // 减
  accSub,
  // 乘
  accMul,
  // 除
  accDiv
}

const install = Vue => {
  Vue.filter('toFixeds', (val, num) => {
    return toFixeds(val, num)
  })
  Vue.prototype.$yj = $yj
  Vue.prototype.toFixeds = toFixeds
}

export default {
  install
}