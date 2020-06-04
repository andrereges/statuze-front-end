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
      },
      {
        path: '/administration',
        name: 'administration',
        meta: { title: 'Administração' },
        component: () => import('pages/home/Administration.vue')
      },
      {
        path: '/suggestions',
        name: 'suggestions',
        meta: { title: 'Quadro de Sugestões' },
        component: () => import('pages/home/Suggestion.vue')
      },
      {
        path: '/birthdays',
        name: 'birthdays',
        meta: { title: 'Aniversariantes do Mês' },
        component: () => import('pages/home/Birthday.vue')
      },
      {
        path: '/about',
        name: 'about',
        meta: { title: 'Sobre' },
        component: () => import('pages/home/About.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        meta: { title: 'Configurações' },
        component: () => import('pages/home/Setting.vue')
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
