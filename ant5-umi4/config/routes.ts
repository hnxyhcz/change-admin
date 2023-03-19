// IRoute
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          // {
          //   name: 'register',
          //   path: '/user/register',
          //   component: './user/Register',
          // },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    path: '/system',
    name: 'system',
    routes: [
      {
        name: 'user',
        path: '/system/user',
        component: './system/User',
      },
      {
        name: 'menu',
        path: '/system/menu',
        component: './system/Menu',
      },
      {
        name: 'role',
        path: '/system/role',
        component: './system/Role',
      },
      {
        name: 'dept',
        path: '/system/dept',
        component: './system/Dept',
      },
      {
        name: 'post',
        path: '/system/post',
        component: './system/Post',
      },
      {
        name: 'dictType',
        path: '/system/dict',
        component: './system/Dict/DictType',
      },
      {
        name: 'dictData',
        path: '/system/dict/:dictType',
        component: './system/Dict/DictData',
      },
      {
        name: 'log',
        path: '/system/log',
        routes: [
          {
            path: '/system/log/operate-log',
            component: './system/Logger/OperateLog',
            name: 'operateLog',
          },
          {
            path: '/system/log/login-log',
            component: './system/Logger/LoginLog',
            name: 'loginLog',
          },
        ],
      },
      {
        name: 'sms',
        path: '/system/sms',
        routes: [
          {
            path: '/system/sms/channel',
            component: './system/sms/SmsChannel',
            name: 'smsChannel',
          },
          {
            path: '/system/sms/template',
            component: './system/sms/SmsTemplate',
            name: 'smsTemplate',
          },
          {
            path: '/system/sms/log',
            component: './system/sms/SmsLog',
            name: 'smsLog',
          },
        ],
      },
      {
        name: 'oauth2',
        path: '/system/oauth2',
        routes: [
          {
            path: '/system/oauth2/application',
            component: './system/OAuth2/Client',
            name: 'oauth2Client',
          },
          {
            path: '/system/oauth2/token',
            component: './system/OAuth2/Token',
            authority: 'system:oauth2-token',
            name: 'oauth2Token',
          },
        ],
      },
      {
        name: 'errorCode',
        path: '/system/error-code',
        component: './system/ErrorCode',
      },
      {
        name: 'sensitiveWord',
        path: '/system/sensitive-word',
        component: './system/SensitiveWord',
      },
    ],
  },
  {
    path: '/infra',
    name: 'infra',
    routes: [
      {
        path: '/infra/file',
        name: 'file',
        routes: [
          {
            path: '/infra/file/file',
            name: 'file',
            component: './infra/file/FileList',
          },
          {
            path: '/infra/file/file-config',
            name: 'config',
            component: './infra/file/FileConfig',
          },
        ],
      },
      {
        path: '/infra/config',
        name: 'config',
        component: './infra/Config',
      },
      {
        path: '/infra/swagger',
        name: 'swagger',
        component: './infra/Swagger',
      },
      {
        path: '/infra/db-doc',
        name: 'db-doc',
        component: './infra/DbDoc',
      },
      {
        path: '/infra/api-log',
        name: 'apiLog',
        routes: [
          {
            path: '/infra/api-log/access-log',
            name: 'accessLog',
            component: './infra/apiLog/AccessLog',
          },
          {
            path: '/infra/api-log/error-log',
            name: 'errorLog',
            component: './infra/apiLog/ErrorLog',
          },
        ],
      },
      {
        path: '/infra/druid',
        name: 'durid',
        component: './infra/Druid',
      },
      {
        path: '/infra/redis',
        name: 'redis',
        component: './infra/Redis',
      },
      {
        path: '/infra/admin-server',
        name: 'server',
        component: './infra/Server',
      },
      {
        name: 'job',
        path: '/infra/job',
        component: './infra/job/Task',
      },
      {
        name: 'jobLog',
        path: '/infra/job/log',
        component: './infra/job/Log',
      },
    ],
  },
];
