import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'CheckPicking',
        meta: {
          title: 'Check Picking',
        },
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/Brand',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'BrandList',
        meta: {
          title: 'Brand List',
        },
        component: () => import('pages/Brand/List.vue'),
      },
      {
        path: ':id',
        name: 'BrandRegist',
        meta: {
          title: 'Brand List',
        },
        component: () => import('pages/Brand/Regist.vue'),
      },
    ],
  },
  {
    path: '/Sort',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'SortBrandList',
        meta: {
          title: 'Sort Brand List',
        },
        component: () => import('pages/Sort/List.vue'),
      },
      {
        path: ':id',
        name: 'SortCardList',
        meta: {
          title: 'Sort Card List',
        },
        component: () => import('pages/Sort/CardList.vue'),
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
