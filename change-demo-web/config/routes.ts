export default [
  {
    path: '/welcome',
    layout: false,
    component: '@/layouts/BasicLayout',
    routes: [
      {
        name: '欢迎页',
        path: '/welcome',
        showLogin: true,
        showRegister: true,
        component: './Welcome',
      },
    ],
  },
  {
    path: '/user',
    flatMenu: true,
    layout: false,
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './user/Login',
            showHome: true,
            showRegister: true,
          },
          {
            name: '注册',
            path: '/user/register',
            component: './user/Register',
            showHome: true,
            showLogin: true,
          },
        ],
      },
      { component: './404' },
    ],
  },

  {
    path: '/',
    flatMenu: true,
    component: '@/layouts/PageLayout',
    routes: [
      {
        path: '/',
        redirect: '/dashboard',
      },
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
