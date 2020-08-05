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
    path: '/moderate',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Moderate.vue') },
    ],
  },
  {
    path: '/moderate/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/moderate/ModerateUsers.vue') },
    ],
  },
  {
    path: '/moderate/publishings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/moderate/ModeratePublishings.vue') },
    ],
  },
  {
    path: '/moderate/publishings/publishDetails/:publishId',
    component: () => import('pages/moderate/ModeratePublishDetails.vue'),
  },
  {
    path: '/projects/:category',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Projects.vue') },
    ],
  },
  {
    path: '/publishDetails/:publishId',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PublishDetails.vue') },
    ],
  },
  {
    path: "/chat/:otherUserId",
    component: () => import("pages/Chat.vue")
  },
  {
    path: "/myChats",
    component: () => import("pages/MyChats.vue")
  },
  {
    path: "/faq",
    component: () => import("pages/FAQ.vue")
  },
  {
    path: "/faq/generalRules",
    component: () => import("pages/faq/GeneralRules.vue")
  },
  {
    path: "/faq/technicalIssues",
    component: () => import("pages/faq/TechnicalIssues.vue")
  },
  {
    path: "/faq/popularQuestions",
    component: () => import("pages/faq/PopularQuestions.vue")
  },
  {
    path: "/faq/whoWeAre",
    component: () => import("pages/faq/WhoWeAre.vue")
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/welcome',
    component: () => import('pages/ChooseInterests.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/Register.vue'),
  },
  {
    path: '/profile/:otherUserId',
    component: () => import('pages/Profile.vue'),
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
