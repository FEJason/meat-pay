import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/',
    component: () => import('../components/layout/index.vue'),
    meta: { title: '布局' },
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../pages/index/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/home',
        component: () => import('../pages/index/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/login',
        component: () => import('../pages/user/login'),
        meta: { title: '登录' }
      },
      {
        path: '/register',
        component: () => import('../pages/user/register'),
        meta: { title: '注册' }
      },
      {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('../pages/user/resetPassword'),
        meta: { title: '重置密码' }
      },
      {
        path: '/otc',
        component: () => import('../pages/otc/Main'),
        children: [
          {
            path: 'trade/:c',
            component: () => import('../pages/otc/Trade'),
            meta: { title: '买币'}
          },
          {
            path: 'orderInfo/:id',
            name: 'orderInfo',
            component: () => import('../pages/otc/orderInfo'),
            meta: { title: '订单详情'}
          },
          {
            path: 'orders',
            name: 'orders',
            component: () => import('../pages/otc/orders'),
            meta: { title: '我的订单' }
          },
          {
            path: 'history-ad',
            component: () => import('../pages/otc/historyAd'),
            meta: { title: '历史广告' }
          },
        ]
      },
      // 我的广告
      {
        path: '/myads',
        component: () => import('../pages/otc/myads'),
        meta: { title: '我的广告' }
      },
      // 认证广告方申请
      {
        path: '/application',
        component: () => import('../pages/otc/application'),
        meta: { title: '申请' }
      },
      // 资产
      {
        path: '/finance',
        component: () => import('../pages/finance/financeMain'),
        children: [
          // 资产总览
          {
            path: 'account',
            component: () => import('../pages/finance/account'),
            meta: { title: '资产总览' }
          },
          // 法币账户
          {
            path: 'otc',
            component: () => import('../pages/finance/otc'),
            meta: { title: '法币账户' }
          },
          // 财务记录
          {
            path: 'record',
            component: () => import('../pages/finance/record'),
            meta: { title: '财务记录' }
          },
        ]
      },
      // 充币
      {
        path: '/deposit',
        component: () => import('../pages/finance/deposit'),
        meta: { title: '充币' }
      },
      // 提币
      {
        path: '/withdraw',
        component: () => import('../pages/finance/withdraw'),
        meta: { title: '提币' }
      },
      // 提币地址
      {
        path: '/address',
        component: () => import('../pages/finance/address'),
        meta: { title: '提币地址' }
      },
      // 财务记录
      {
        path: '/record',
        component: () => import('../pages/finance/record'),
        meta: { title: '财务记录' }
      },
      // 消息中心
      {
        path: '/inmail',
        component: () => import('../pages/user/inmail'),
        meta: { title: '消息中心' }
      },
      // 消息详情
      {
        path: '/inmail-info/:id',
        component: () => import('../pages/user/inmailInfo'),
        meta: { title: '消息详情' }
      },
      // 账户&安全
      {
        path: '/security',
        name: 'security',
        component: () => import('../pages/user/security'),
        meta: { title: '账户&安全' }
      },
      // 法币设置
      {
        path: '/set-payment',
        name: 'setpayment',
        component: () => import('../pages/user/setPayment'),
        meta: { title: '设置' }
      },
      // 工具 - 官方验证通道
      {
        path: '/validate',
        name: 'validate',
        component: () => import('../pages/tool/validate'),
        meta: { title: '官方验证通道' }
      },
      // 工具 - 邀请奖励
      {
        path: '/invitation',
        name: 'invitation',
        component: () => import('../pages/tool/invitation'),
        meta: { title: '邀请奖励' }
      },
      // 工具 - 客户端下载
      {
        path: '/download',
        name: 'download',
        component: () => import('../pages/tool/download'),
        meta: { title: '客户端下载' }
      },
      // 费率说明
      {
        path: '/fees',
        name: 'fees',
        component: () => import('../pages/tool/fees'),
        meta: { title: '费率说明' }
      },
      // 帮助中心
      {
        path: '/help',
        name: 'help',
        component: () => import('../pages/tool/help'),
        meta: { title: '帮助中心' }
      },
      // 隐私政策
      {
        path: '/privacy',
        name: 'privacy',
        component: () => import('../pages/user/privacy'),
        meta: { title: '隐私政策' }
      },
      // 用户协议
      {
        path: '/agreement',
        name: 'agreement',
        component: () => import('../pages/user/agreement'),
        meta: { title: '用户协议' }
      },
      // 申请中心
      {
        path: '/application-center',
        name: 'applicationCenter',
        component: () => import('../pages/tool/applicationCenter'),
        meta: { title: '申请中心' }
      },
      // 上币申请
      {
        path: '/application',
        name: 'application',
        component: () => import('../pages/tool/application'),
        meta: { title: '上币申请' }
      },
    ]
  },
  // 公共模块之外的路由
  {
    path: '*',
    redirect: '/home'
  },
  // 手机下载页
  // {
  //   path: '/h5-download',
  //   name: 'H5Download',
  //   component: () => import('../pages/h5/h5Download')
  // }

]

const router = new VueRouter({
  routes
})

export default router
