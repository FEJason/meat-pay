/**
 * 资产接口
 */
import request from '@/request/request'

/**
 * 资产总览
 */
 export const getAccount = () => {
  return request({
      url: `/wallet/assets/account/overview`,
  })
}

/**
 * 资产列表
 */
 export const getAssetList = (type) => {
  return request({
      url: `/wallet/assets/${type}/asset`,
  })
}

/**
 * 充值币种列表
 */
 export const getCurrencyList = () => {
  return request({
      url: `/wallet/assets/account/token/currency`,
  })
}

/**
 * 获取充币地址
 */
 export const getDepositAddress = (chainId) => {
  return request({
      url: `/wallet/assets/account/deposit/address/${chainId}`,
  })
}

/**
 * 财务记录
 */
 export const getRecord = (query) => {
  return request({
      url: `/wallet/assets/bill/page`,
      params: query
  })
}

/**
 * 提币
 */
 export const withdraw = (query) => {
  return request({
      url: `/wallet/assets/account/withdraw/apply`,
      method: 'post',
      data: query
  })
}

/**
 * 新增提币地址
 */
 export const saveAddress = (query) => {
  return request({
      url: `/wallet/assets/account/withdraw/address-save`,
      method: 'post',
      data: query
  })
}

/**
 * 查询用户币地址列表
 */
 export const getAddressList = (query) => {
  return request({
      url: `/wallet/assets/account/withdraw/address-list`,
      params: query
  })
}

/**
 * 删除提币地址
 */
 export const removeAddress = (id) => {
  return request({
      url: `/wallet/assets/account/withdraw/address-remove/${id}`,
      method: 'delete'
  })
}

/**
 * 划转
 */
 export const transfer = (query) => {
  return request({
      url: `/wallet/assets/account/transfer`,
      method: 'post',
      data: query
  })
}



