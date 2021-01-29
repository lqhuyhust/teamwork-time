import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../components/HomePage'
import LoginPage from '../components/LoginPage'
import Report from '../components/Report'
import AvailableTime from '../components/AvailableTime'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/home', component: HomePage },
    { path: '/available-time', component: AvailableTime },
    { path: '/login', component: LoginPage },
    { path: '/reports', component: Report, name: 'reports' },


    // otherwise redirect to home
    { path: '*', redirect: '/home' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})