const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
    ],
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Search.vue') },
    ],
  },
  {
    path: '/brotherhood',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Brotherhood.vue') },
    ],
  },
  {
    path: '/create',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Create.vue') },
    ],
  },
  {
    path: '/projects/:category',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Projects.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/Register.vue'),
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
