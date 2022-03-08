import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 公共模块之外的路由
  // 手机下载页
  {
    path: '/',
    name: 'H5Download',
    component: () => import('@/h5/h5Download'),
    meta: { title: 'Meta Life' },
  },
  {
    path: '/h5-download',
    name: 'H5Download',
    component: () => import('@/h5/h5Download'),
    meta: { title: 'Meta Life' },
  }
]

const router = new VueRouter({
  routes
})

export default router
