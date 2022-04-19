export default [
  {
    path: '/welcome',
    name: '欢迎页',
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
            component: './user/Register'
          }
        ]
      },
      { component: './404' },
    ],
  },
  
  {
    path: '/dashboard',
    name: '工作台',
    component: './Dashboard',
  },
  {
    name: '系统管理',
    icon: 'setting',
    path: '/setting',
    routes: [
      {
        name: '账户管理',
        path: '/setting/account',
        component: './rbac/Account',
      },
      {
        name: '人员管理',
        path: '/setting/user',
        component: './rbac/User',
      },
      {
        name: '角色管理',
        path: '/setting/role',
        component: './rbac/Role',
      },
      {
        name: '权限管理',
        path: '/setting/permission',
        component: './rbac/permission',
      },
      {
        name: '菜单管理',
        path: '/setting/menu',
        component: './rbac/Menu',
      },
      {
        name: '操作日志',
        path: '/setting/operationLog',
        component: './rbac/OperationLog',
      },
    ],
  },
  { path: '/', redirect: '/workplace' },
  { component: './404' },
];
