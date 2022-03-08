/**
 * 配置全局方法
 */
import { toFixeds, transMoney } from './formatAmount'
import timeFormat from './timeFormat'
/**
 * 解决JS计算精度问题
  加 NP.plus(0.1, 0.2);     // = 0.3, not 0.30000000000000004
  减 NP.minus(1.0, 0.9);    // = 0.1, not 0.09999999999999998
  乘 NP.times(3, 0.3);      // = 0.9, not 0.8999999999999999
  除 NP.divide(1.21, 1.1);  // = 1.1, not 1.0999999999999999
 */
import NP from 'number-precision'

const $yj = {
  // 数字转金额格式
  transMoney,
  // 时间格式化
  timeFormat
}

const install = Vue => {
  Vue.filter('toFixeds', (val, num) => {
    return toFixeds(val, num)
  })
  Vue.prototype.$yj = $yj
  Vue.prototype.NP = NP
  Vue.prototype.toFixeds = toFixeds
}

export default {
  install
}