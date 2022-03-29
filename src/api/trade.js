import request from '@/request/request'

/**
 * 获取币种列表
 */
 export const getCurrencyList = () => {
    return request({
        url: '/otc/currency/assets',
        method: 'get',
    })
}

/**
 * 获取广告列表
 */
 export const getAdList = query => {
    return request({
        url: '/otc/trade/goods/sale/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询法定货币列表
 */
 export const getLegalList = query => {
    return request({
        url: '/otc/trade/all',
        method: 'get',
        params: query
    })
}

/**
 * 获取广告详情
 */
 export const getIdAdv = query => {
    return request({
        url: `/otc/trade/goods/details/${query}`,
        method: 'get',
    })
}

/**
 * otc买卖下单
 */
 export const otcOrder = query => {
    return request({
        url: `/otc/order/transactionOrder`,
        method: 'post',
        data: query
    })
}

/**
 * 订单详情查询
 */
 export const getOrderInfo = query => {
    return request({
        url: `/otc/order/tradeDetails/${query.id}`,
    })
}

/**
 * 订单付款确认
 */
 export const confirmPayment = query => {
    return request({
        url: `/otc/order/payment`,
        method: 'put',
        params: query
    })
}

/**
 * 订单收款确认
 */
 export const confirmCollection = query => {
    return request({
        url: `/otc/order/collection`,
        method: 'put',
        params: query
    })
}

/**
 * 查询OTC订单
 */
 export const getOrderList = query => {
    return request({
        url: `/otc/order/status/list`,
        params: query
    })
}

/**
 * 查询OTC未完成订单
 */
 export const getUndoneList = query => {
    return request({
        url: `/otc/order/undone/list`,
        params: query
    })
}

/**
 * 订单取消
 */
 export const cancelOrder = query => {
    return request({
        url: `/otc/order/cancel`,
        method: 'put',
        params: query
    })
}

/**
 * 发布广告
 */
 export const release = query => {
    return request({
        url: `/otc/trade/center/goods/release`,
        method: 'post',
        data: query
    })
}

/**
 * 上下架广告
 */
 export const setRelease = query => {
    return request({
        url: `/otc/trade/center/advertisers/release`,
        method: 'put',
        data: query
    })
}

/**
 * 删除广告
 */
 export const revoke = query => {
    return request({
        url: `/otc/trade/center/advertisers/revoke`,
        method: 'put',
        params: query
    })
}


/**
 * 我的广告
 */
 export const getMyAd = query => {
    return request({
        url: `/otc/trade/center/goods/state-list`,
        params: query
    })
}

/**
 * 订单申述
 */
 export const plead = query => {
    return request({
        url: `/otc/appeal/commit`,
        method: 'post',
        data: query
    })
}

/**
 * 历史聊天记录
 */
 export const getHistoryMessage = query => {
    return request({
        url: `/chat/room/otc/getHistoryMessage/${query.id}`,
        params: query
    })
}

/**
 * 支付方式
 */
 export const queryPayWay = () => {
    return request({
        url: `/otc/pay/type/queryPayWay`
    })
}

