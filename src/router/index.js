import Vue from 'vue'
import Router from 'vue-router'
import Tasks from '@/components/Tasks'
// import Dashboard from '@/components/Dashboard'
// import Projects from '@/components/Projects'
import Gantt from '@/components/Gantt'
import Login from '@/components/Login'
import Calendar from '@/components/Calendar'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/inbox',
      name: 'Входящие',
      component: Tasks,
      props: {
        sortByProj: false
      }
    }, {
      path: '/today',
      name: 'Сегодня',
      component: Tasks,
      props: {
        sortByProj: true
      }
    }, {
      path: '/gantt',
      name: 'Гантт',
      component: Gantt,
      props: {
        sortByProj: true
      }
    }, {
      path: '/calendar',
      name: 'Календарь',
      component: Calendar,
      props: {
        sortByProj: true
      }
    }, {
      path: '/week',
      name: 'Неделя',
      component: Tasks,
      props: {
        sortByProj: true
      }
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/project/:id',
      component: Tasks
    }
  ]
})
