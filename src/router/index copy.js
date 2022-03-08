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
    // name: 'Home',
    component: () => import('../pages/index/Index.vue'),
    meta: { title: '首页'}
  },
  {
    path: '/home',
    component: () => import('../pages/index/Index')
  },
  {
    path: '/login',
    component: () => import('../pages/uc/Login')
  },
  {
    path: '/login/returnUrl/:returnUrl',
    component: () => import('../pages/uc/Login')
  },
  {
    path: '/register',
    component: () => import('../pages/uc/Register')
  },
  {
    path: '/reg',
    component: () => import('../pages/uc/MobileRegister')
  },
  {
    path: '/app',
    component: () => import('../pages/uc/AppDownload')
  },
  // {
  //   path: '/findPwd',
  //   component: () => import('../pages/uc/Findpwd')
  // },
  {
    path: '/exchange',
    component: () => import('../pages/exchange/Exchange')
  },
  {
    path: '/exchange/:pair',
    name: "ExchangePair",
    component: () => import('../pages/exchange/Exchange')
  },
  // 永续合约
  {
    path: '/swap',
    component: () => import('../pages/swap/SwapIndex')
  },
  {
    path: '/swap/:pair',
    component: () => import('../pages/swap/SwapIndex')
  },
  {
    path: '/help',
    component: () => import('../pages/cms/Help')
  },
  {
    path: '/helplist',
    component: () => import('../pages/cms/HelpList')
  },
  {
    path: '/helpdetail',
    component: () => import('../pages/cms/HelpDetail')
  },
  {
    path: '/notice',
    component: () => import('../pages/cms/Notice')
  },
  {
    path: '/invite',
    component: () => import('../pages/invite/Invite')
  },
  {
    path: '/lab',
    component: () => import('../pages/activity/Activity')
  },
  {
    path: '/ctc',
    component: () => import('../pages/ctc/Ctc')
  },
  {
    path: '/cexchange',
    component: () => import('../pages/cexchange/cexchange')
  },
  {
    path: '/option',
    component: () => import('../pages/option/Option')
  },
  {
    path: '/news',
    component: () => import('../pages/news/News')
  },
  {
    path: '/lab/detail/:id',
    component: () => import('../pages/activity/ActivityDetail')
  },
  {
    path: '/announcement/:id',
    component: () => import('../pages/cms/NoticeItem')
  },
  {
    path: '/partner',
    component: () => import('../pages/activity/Partner')
  },
  {
    path: '/bzb',
    component: () => import('../pages/activity/Bzb')
  },
  {
    path: '/whitepaper',
    component: () => import('../pages/cms/WhitePaper')
  },
  {
    path: '*',
    component: () => import('../pages/index/Index')
  },
  {
    path: '/envelope/:eno',
    component: () => import('../pages/envelope/Envelope')
  },

  {
    path: '/otc',
    component: () => import('../pages/otc/Main'),
    children: [
      {
        path: 'trade/:c',
        component: () => import('../pages/otc/Trade')
      },
      {
        path: 'tradeInfo',
        name: 'tradeInfo',
        component: () => import('../pages/otc/TradeInfo')
      },
      {
        path: 'orderInfo/:id',
        name: 'orderInfo',
        component: () => import('../pages/otc/orderInfo')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../pages/otc/orders'),
        meta: { title: '我的订单'}
      },
    ]
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
        meta: { title: '资产总览'}
      },
      // 币币账户
      {
        path: 'spot',
        component: () => import('../pages/finance/spot'),
        meta: { title: '币币账户'}
      },
      // 法币账户
      {
        path: 'otc',
        component: () => import('../pages/finance/otc'),
        meta: { title: '法币账户'}
      },
    ]
  },
  // 资产划转
  {
    path: '/transfer',
    component: () => import('../pages/finance/transfer'),
    meta: { title: '资产划转'}
  },
  // 充币
  {
    path: '/deposit',
    component: () => import('../pages/finance/deposit'),
    meta: { title: '充币'}
  },
  // 提币
  {
    path: '/withdraw',
    component: () => import('../pages/finance/withdraw'),
    meta: { title: '提币'}
  },
  // 提币地址
  {
    path: '/address',
    component: () => import('../pages/finance/address'),
    meta: { title: '提币地址'}
  },
  // 财务记录
  {
    path: '/record',
    component: () => import('../pages/finance/record'),
    meta: { title: '财务记录'}
  },
  // 账户&安全
  {
    path: '/security',
    name: 'security',
    component: () => import('../pages/user/security'),
    meta: { title: '账户&安全'}
  },
  // 法币设置
  {
    path: '/set-payment',
    name: 'setpayment',
    component: () => import('../pages/user/setPayment'),
    meta: { title: '设置'}
  },
  // 币币订单
  {
    path: '/transac',
    name: 'transac',
    component: () => import('../pages/user/transac'),
    meta: { title: '币币订单'}
  },
  {
    path: '/uc',
    component: () => import('../pages/uc/MemberCenter'),
    children: [
      {
        path: '',
        component: () => import('../components/uc/Safe')
      },
      {
        path: 'safe',
        component: () => import('../components/uc/Safe')
      },
      {
        path: 'account',
        component: () => import('../components/uc/Account')
      },
      {
        path: 'money',
        component: () => import('../components/uc/MoneyIndex')
      },
      {
        path: 'swapAssets',
        component: () => import('../components/uc/SwapAssets')
      },
      {
        path: 'record',
        component: () => import('../components/uc/Record')
      },
      {
        path: 'recharge',
        component: () => import('../components/uc/Recharge')
      },
      {
        path: 'withdraw',
        component: () => import('../components/uc/Withdraw')
      },
      {
        path: 'withdraw/address',
        component: () => import('../components/uc/WithdrawAddress')
      },
      {
        path: 'withdraw/code',
        component: () => import('../components/uc/WithdrawCode')
      },
      // 个人中心 - OTC管理 - 我的广告
      {
        path: 'ad',
        component: () => import('../components/otc/MyAd')
      },
      {
        path: 'ad/create',
        component: () => import('../pages/otc/AdPublish')
      },
      {
        path: 'ad/update',
        component: () => import('../pages/otc/AdPublish')
      },
      // 个人中心 - OTC管理 - 我的订单
      {
        path: 'order',
        // component: () => import('../components/uc/myorder')
        component: () => import('../pages/otc/orders'),
        meta: { title: '我的订单'}
      },
      {
        path: 'entrust/current',
        component: () => import('../components/uc/EntrustCurrent')
      },
      {
        path: 'entrust/history',
        component: () => import('../components/uc/EntrustHistory')
      },
      {
        path: 'trade',
        component: () => import('../components/uc/MinTrade')
      },
      {
        path: 'invitingmining',
        component: () => import('../components/uc/InvitingMin')
      },
      {
        path: 'paydividends',
        component: () => import('../components/uc/PayDividends')
      },
      {
        path: 'promotion/mycards',
        component: () => import('../components/uc/PromotionMyCards')
      },
      {
        path: 'promotion/mypromotion',
        component: () => import('../components/uc/MyPromotion')
      },
      {
        path: 'innovation/myorders',
        component: () => import('../components/uc/InnovationOrders')
      },
      {
        path: 'innovation/myminings',
        component: () => import('../components/uc/InnovationMinings')
      },
      {
        path: 'innovation/mylocked',
        component: () => import('../components/uc/InnovationLocked')
      },
      {
        path: 'quickExchange',
        component: () => import('../components/uc/QuickExchange')
      },
      {
        path: 'apiManage',
        component: () => import('../components/uc/apiManage')
      }
    ]
  },
  // {
  //   path: '/otc/tradeInfo',
  //   name: 'tradeInfo',
  //   component: () => import('../pages/otc/TradeInfo')
  // },
  {
    path: '/checkuser',
    component: () => import('../pages/otc/CheckUser')
  },
  {
    path: '/chat',
    component: () => import('../pages/otc/Chat')
  },
  {
    path: '/identbusiness',
    component: () => import('../pages/uc/IdentBusiness')
  },
  {
    path: '/about-us',
    component: () => import('../pages/cms/AboutUs')
  }
]

const router = new VueRouter({
  routes
})

export default router
