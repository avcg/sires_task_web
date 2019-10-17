import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Tasks from '@/components/Tasks';
// import Dashboard from '@/components/Dashboard'
// import Projects from '@/components/Projects'
import Gantt from '@/components/Gantt';
import Calendar from '@/components/Calendar';
import Project from '@/components/Projects';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login,
    },
    {
      name: 'Home',
      path: '/',
      redirect: '/inbox',
    },
    {
      name: 'Входящие',
      path: '/inbox',
      component: Tasks,
      meta: {
        auth: true,
      },
    },
    {
      name: 'Сегодня',
      path: '/today',
      component: Tasks,
      meta: {
        auth: true,
      },
    },
    {
      name: 'Гантт',
      path: '/gantt',
      component: Gantt,
      meta: {
        auth: true,
      },
    },
    {
      name: 'Календарь',
      path: '/calendar',
      component: Calendar,
      meta: {
        auth: true,
      },
    },
    {
      name: 'Неделя',
      path: '/week',
      component: Tasks,
      meta: {
        auth: true,
      },
    },
    {
      path: '/project/:id',
      component: Project,
      meta: {
        auth: true,
      },
    },
  ],
});
