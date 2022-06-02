export default [
  {
    path: '/welcome',
    layout: false,
    component: './Welcome',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './user/Login',
          },
          {
            name: '注册',
            path: '/user/register',
            component: './user/Register',
          },
        ],
      },
      { component: './404' },
    ],
  },

  {
    path: '/',
    flatMenu: true,
    component: '@/layouts/AppLayout',
    routes: [
      {
        path: '/dashboard',
        name: '工作台',
        icon: 'dashboard',
        component: './Dashboard',
      },
      {
        name: '系统管理',
        icon: 'setting',
        path: '/setting',
        access: 'routeFilter',
        authority: 'system',
        component: '@/layouts/AppLayout',
        routes: [
          {
            name: '人员管理',
            path: '/setting/user',
            access: 'routeFilter',
            authority: 'system:role',
            component: './system/User',
          },
          {
            name: '角色管理',
            path: '/setting/role',
            access: 'routeFilter',
            authority: 'system:role',
            component: './system/Role',
          },
          {
            name: '操作日志',
            path: '/setting/oplog',
            component: './system/Oplog',
            access: 'routeFilter',
            authority: 'ROLE_ADMIN',
          },
        ],
      },
    ],
  },

  { path: '/', redirect: '/dashboard' },
  { component: './404' },
];
