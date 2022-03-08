import request from '@/request/request'

/* 查询国家地区区号 */
export const getBannerList = query => {
    return request({
        url: '/configure/app/common/carouselPictureList',
        params: query
    })
}

/* 查询国家地区区号 */
export const findHotList = query => {
    return request({
        url: '/market/app/market/findHotList',
        params: query
    })
}
