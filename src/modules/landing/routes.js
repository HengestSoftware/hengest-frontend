export default [
  {
    path: '/',
    name: 'landing',
    component: () => import('./views/LandingView.vue'),
    meta: {
      title: 'HENGEST | Control y Producción Avícola',
    },
  },
]

