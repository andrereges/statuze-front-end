import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { LocalStorage } from 'quasar'

Vue.use(VueRouter)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // Acesso as páginas após login
  Router.beforeEach((to, from, next) => {
    if (to.matched.some(item => item.meta.requiresAuth)) {
      const isAuthenticated = LocalStorage.getItem('statuze_access_token')

      if (to.name !== 'login' && !isAuthenticated) {
        next({ name: 'login' })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return Router
}
