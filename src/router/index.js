import Vue from 'vue';
import Router from 'vue-router';
import Tasks from '@/components/Tasks';
// import Dashboard from '@/components/Dashboard'
// import Projects from '@/components/Projects'
import Gantt from '@/components/Gantt';
import Login from '@/components/Login';
import Calendar from '@/components/Calendar';
import Project from '@/components/Projects';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/inbox',
    }, {
      path: '/inbox',
      name: 'Входящие',
      component: Tasks,
      meta: { auth: true },
    }, {
      path: '/today',
      name: 'Сегодня',
      component: Tasks,
      meta: { auth: true },
    }, {
      path: '/gantt',
      name: 'Гантт',
      component: Gantt,
      meta: { auth: true },
    }, {
      path: '/calendar',
      name: 'Календарь',
      component: Calendar,
      meta: { auth: true },
    }, {
      path: '/week',
      name: 'Неделя',
      component: Tasks,
      meta: { auth: true },
    }, {
      path: '/login',
      name: 'login',
      component: Login,
    }, {
      path: '/project/:id',
      component: Project,
      meta: { auth: true },
    },
  ],
});
