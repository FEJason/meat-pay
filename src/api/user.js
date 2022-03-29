import request from '@/request/request'
import axios from 'axios'

/* 查询国家地区区号 */
export const getCountryList = query => {
    return request({
        url: '/configure/app/common/country/list',
        method: 'get',
        params: query
    })
}

/**
 * 发送短信验证码
 * type: 2-注册
 */
export const sendMobileCode = ({type, areaCode, mobile}) => {
    return request({
        url: `/msg/sms/sendMobileCode/${type}/${areaCode}/${mobile}`,
        method: 'get',
    })
}

/**
 * 发送邮箱验证码
 * type: 2-注册
 */
 export const sendEmailCode = ({type, email}) => {
    return request({
        url: `/msg/sms/sendEmailCode/${type}/${email}`,
        method: 'get',
    })
}

/**
 * 注册 
 */
export const register = query => {
    return request({
        url: `/uc/member/register`,
        method: 'post',
        params: query
    })
}

/**
 * 登录 
 */
 export const login = query => {
    return axios({
        url: `/auth/oauth/token`,
        headers: {
            isToken: false,
            Authorization: 'Basic bWV0YTptZXRh'
        },
        method: 'get',
        params: query
    })
}

/**
 * 重置密码第一步 
 */
 export const resetPass = (query) => {
    return request({
        url: `/sc/security/checkRestPassword`,
        params: query
    })
}

/**
 * 重置密码第二步 
 */
 export const resetPassT = (query) => {
    return request({
        url: `/sc/security/validateRestPassword`,
        params: query
    })
}

/**
 * 重置密码
 */
 export const restPassword = (query) => {
    return request({
        url: `/sc/security/restPassword`,
        method: 'patch',
        params: query
    })
}

/**
 * 退出登录 
 */
 export const logout = () => {
    return request({
        url: `/auth/token/logout`,
        method: 'delete',
    })
}

/**
 * 用户信息
 */
 export const getUserInfo = () => {
    return request({
        url: `/uc/user/getUserInfo`,
    })
}

/**
 * 个人中心 - 当前委托 
 */
 export const currentOrder = query => {
    return request({
        url: `/exchange/app/order/personal/current`,
        params: query
    })
}

/**
 * 个人中心 - 当前委托 
 */
 export const historyOrder = query => {
    return request({
        url: `/exchange/app/order/personal/history`,
        params: query
    })
}

/**
 * 用户收款列表
 */
 export const getPaymentList = query => {
    return request({
        url: `/otc/payment/list`,
        params: query
    })
}

/**
 * 保存收款方式
 */
 export const savePayment = query => {
    return request({
        url: `/otc/payment/save`,
        method: 'post',
        data: query
    })
}

/**
 * 修改收款方式
 */
 export const editPayment = query => {
    return request({
        url: `/otc/payment/edit`,
        method: 'put',
        data: query
    })
}

/**
 * 查询支持收款方式
 */
 export const getPayType = query => {
    return request({
        url: `/otc/pay/type/all`,
        data: query
    })
}

/**
 * 身份认证
 */
 export const certification = query => {
    return request({
        url: `/approve/kcy/identification/submit`,
        method: 'post',
        data: query
    })
}

/**
 * 更新认证信息
 */
 export const certificationEdit = query => {
    return request({
        url: `/approve/kcy/identification/edit`,
        method: 'put',
        data: query
    })
}

/**
 * 查询商家信息
 */
 export const getCertification = () => {
    return request({
        url: `/approve/kcy/identification/certification`,
    })
}

/**
 * 查询用户安全认证
 */
 export const getSecurity = () => {
    return request({
        url: `/sc/security/list`,
    })
}

/**
 * 安全中心 - 发送效验码
 */
 export const sendCode = (query) => {
    return request({
        url: `/sc/security/sendCode`,
        method: 'post',
        data: query
    })
}

/**
 * 安全中心 - 综合业务设置
 */
export const setVerify = (query) => {
    return request({
        url: `/sc/security/verify`,
        method: 'patch',
        data: query
    })
}

/**
 * 获取Google认证
 */
 export const getGoogle = () => {
    return request({
        url: `/sc/security/googleAuthSecretKey`,
    })
}

/**
 * 获取汇率
 */
 export const getRate = () => {
    return request({
        url: `/configure/app/common/currencyRate/list`,
    })
}

/**
 * 获取计价单位
 */
 export const priceUnit = () => {
    return request({
        url: `/sexchange/extExchange/priceUnit`,
    })
}

/**
 * 分页查询消息
 */
 export const getMessage = () => {
    return request({
        url: `msg/app/messageCenter/page`,
    })
}

/**
 * 消息未读数量
 */
 export const getAllNotRead = () => {
    return request({
        url: `/msg/app/messageCenter/getAllNotRead`,
    })
}

/**
 * 消息详情
 */
 export const getMessageInfo = (id) => {
    return request({
        url: `/msg/app/messageCenter/${id}`,
    })
}

/**
 * 修改为已读状态
 */
 export const editMessageRead = (id) => {
    return request({
        url: `/msg/app/messageCenter/${id}`,
        method: 'put'
    })
}

/**
 * 全部已读
 */
 export const allRead = () => {
    return request({
        url: `/msg/app/messageCenter`,
        method: 'put'
    })
}