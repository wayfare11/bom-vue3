import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login/Login.vue';
import List from './components/MainList/List.vue';

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/list',
    component: List,
    meta: { requiresAuth: true }
  }
];


const router = createRouter({
  history: createWebHistory('/bom'),
  routes
});

// 添加导航守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 使用 'sessionStorage' 来检查用户是否登录
    if (!sessionStorage.getItem('isLoggedIn')) {
      // 如果用户未登录，重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // 如果用户已登录，则继续
      next();
    }
  } else {
    // 如果路由不需要认证，则直接放行
    next();
  }
});


export default router;
