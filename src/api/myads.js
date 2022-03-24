import request from '@/request/request'

/**
 * 查询广告商信息
 */
 export const getAdvertisers = () => {
    return request({
        url: '/otc/merchant/advertisers/info',
        method: 'get',
    })
}

/**
 * 广告商申请
 */
 export const merchantApply = (query) => {
  return request({
      url: '/otc/merchant/apply',
      method: 'post',
      data: query
  })
}