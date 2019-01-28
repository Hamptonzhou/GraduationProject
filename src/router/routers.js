import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      // notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        // notCache: true,
        icon: 'md-home'
      },
      component: () => import('@/view/single-page/home')
    }]
  },
  {
    path: '/join',
    name: 'join',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [{
      path: 'join_page',
      name: 'join_page',
      meta: {
        icon: '',
        title: 'QQ群'
      },
      component: () => import('@/view/join-page.vue')
    }]
  },

  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '组件'
    },
    component: Main,
    children: [{
      path: 'tables_page',
      name: 'tables_page',
      meta: {
        icon: 'md-grid',
        title: '多功能表格'
      },
      component: () => import('@/view/components/tables/tables.vue')
    }, ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },


  // ################################################################毕设开发################################################################
  {
    path: '/log',
    name: 'log',
    meta: {
      hideInBread: true,
      hideInMenu: false
    },
    component: Main,
    children: [{
      path: 'logCollection_page',
      name: 'logCollection_page',
      meta: {
        icon: 'ios-bug',
        title: '日志收集',
        beforeCloseName: 'before_close_normal'
      },
      component: () => import('@/view/single-page/logCollection_page.vue')
    }]
  },

  {
    path: '/organization',
    name: 'organization',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [{
      path: 'organization_page',
      name: 'organization_page',
      meta: {
        icon: 'md-planet',
        title: ' {{ organization_page }}'
      },
      component: () => import('@/view/organization/organization_page.vue')
    }]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: false
    },
    children: [{
      path: 'message_page',
      name: 'message_page',
      meta: {
        icon: 'md-notifications',
        title: '消息中心'
      },
      component: () => import('@/view/single-page/message/index.vue')
    }]
  },
  {
    path: '/formDesigner',
    name: 'formDesigner',
    meta: {
      title: '表单设计器'
    },
    component: Main,
    children: [{
      path: 'formDesigner_page',
      name: 'formDesigner_page',
      meta: {
        icon: 'md-grid',
        title: '表单设计器'
      },
      component: () => import('@/view/formDesigner/formDesigner_page.vue')
    }]
  },
]
