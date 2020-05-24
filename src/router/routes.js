const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: { icon: 'home', title: 'Home' },
        component: () => import('pages/home/Home.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        meta: { title: 'Perfil' },
        component: () => import('pages/home/Profile.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: '',
        meta: { title: 'Login' },
        name: 'login',
        component: () => import('pages/login/Login.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    name: 'error',
    meta: { title: 'Error' },
    component: () => import('pages/Error404.vue')
  })
}

export default routes
