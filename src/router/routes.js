import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/Board',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'BoardList',
        component: () => import('pages/Board/List.vue'),
      },
      {
        path: ':id',
        name: 'BoardDetail',
        component: () => import('pages/Board/Detail.vue'),
      },
      {
        path: 'Regist',
        name: 'BoardRegist',
        component: () => import('pages/Board/Regist.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
