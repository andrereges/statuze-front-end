import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { LocalStorage } from 'quasar'

Vue.use(VueRouter)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} - Statuze`
    if (!LocalStorage.getItem('statuze_user') && to.name !== 'login') {
      next({ name: 'login' })
    } else {
      next()
    }
  })

  return Router
}
