import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { formatRoutes } from '@/util/util'
const _import = require('./_import')

Vue.use(VueRouter)
// 布局
import Layout from '@/page/index/'

const constantRouterMap = [{
  path: '/',
  name: '首页',
  redirect: '/wel'
}, {
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    component: _import('wel')
  }]
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}, {
  path: '/login',
  name: '登录页',
  component: _import('login/index')
}, {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [
    {
      path: 'index',
      name: '个人信息',
      component: _import('admin/user/info', 'views')
    },
    {
      path: 'passwd',
      name: '修改密码',
      component: _import('admin/user/passwd', 'views')
    }
  ]
}, {
  path: '/404',
  component: _import('error-page/404', 'components'),
  name: '404'
}, {
  path: '/403',
  component: _import('error-page/403', 'components'),
  name: '403'
}, {
  path: '/500',
  component: _import('error-page/500', 'components'),
  name: '500'
}]

export default new VueRouter({
  // mode: 'history',
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [].concat(...formatRoutes(store.state.user.menu), constantRouterMap)
})
