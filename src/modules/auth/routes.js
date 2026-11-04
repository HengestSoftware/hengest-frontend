export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginView.vue'),
    meta: {
      title: 'Iniciar sesión | HENGEST',
    },
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('./views/RegisterView.vue'),
    meta: {
      title: 'Registrar Granja | HENGEST',
    },
  },
]

