import request from '@/request/request'

/**
 * 查询支持的币种列表
 */
export const getSymbolList = () => {
    return request({
        url: '/market/app/market/symbol',
    })
}

/**
 * 币种下属-交易对信息
 */
export const getPairList = (query) => {
    return request({
        url: `/market/app/market/pairList/${query}`,
    })
}

/**
 * 查询交易对信息
 */
export const getTickers = (query) => {
    return request({
        url: `/market/app/market/tickers/${query}`,
    })
}

/**
 * 查询交易对详细信息
 */
export const getPairInfo = (query) => {
    return request({
        url: `/market/app/market/pairInfo/${query}`,
    })
}


/**
 * 有限深度-24档
 */
export const getDepthMini = (query) => {
    return request({
        url: `/market/app/market/depth-mini/${query.symbol}/${query.size}`,
        params: query
    })
}

/**
 * 成交记录
 */
 export const getRecord = (query) => {
    return request({
        url: `/market/app/market/latest-trade?symbol=${query.symbol}&size=${query.size}`,
    })
}

/**
 * 下单
 */
 export const addOrder = (query) => {
    return request({
        url: `/exchange/app/order/add`,
        method: 'post',
        params: query
    })
}

/**
 * 获取当前委托
 */
 export const getOpenOrders = (query) => {
    return request({
        url: `/exchange/app/order/current`,
        params: query
    })
}

/**
 * 获取历史委托
 */
 export const getOrderHistory = (query) => {
    return request({
        url: `/exchange/app/order/history`,
        params: query
    })
}

/**
 * 取消订单
 */
 export const cancelOrder = (query) => {
    return request({
        url: `/exchange/app/order/cancel/${query}`,
        method: 'put'
    })
}

/**
 * 添加自选
 */
 export const saveOptional = (query) => {
    return request({
        url: `/market/app/memberOptional/saveOptional/${query}`,
        method: 'post'
    })
}

/**
 * 删除自选
 */
 export const deleteOptional = (query) => {
    return request({
        url: `/market/app/memberOptional/deleteOptional/${query}`,
        method: 'delete'
    })
}

/**
 * 自选列表
 */
 export const getOptionalList = () => {
    return request({
        url: `/market/app/memberOptional/memberOptionalByUserId`,
    })
}

/**
 * 获取币种余额
 */
export const getBalance = (query) => {
    return request({
        url: `/wallet/assets/account/balance/${query.type}/${query.currency}`,
    })
}

