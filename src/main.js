import Vue from 'vue'
import App from './App'
import router from './router/index'
import './assets/styles/line-awesome.css'
import './assets/styles/animate.css'
import Vuex from 'vuex'
import '../node_modules/vue-date-pick/dist/vueDatePick.css'
import vClickOutside from 'v-click-outside'
import VueTextareaAutosize from 'vue-textarea-autosize'
import SComponents from './components/common'
import DatePick from 'vue-date-pick'
import ru from '../node_modules/date-fns/locale/ru'
import { format } from 'date-fns'
import Antd from 'ant-design-vue'
import "ant-design-vue/dist/antd.css";
import moment from 'moment'

Vue.prototype.moment = moment
// import store from './store'
Vue.use(Antd)
SComponents.forEach(component => {
  Vue.component(component.name, component)
})

Vue.component('date-pick', DatePick)
Vue.use(VueTextareaAutosize)
Vue.use(vClickOutside)
Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    actualTaskId: null,
    sidebarOpen: true,
    counter: 0,
    viewTask: false,
    authenticated: true,
    labelDialog: false,
    projectDialog: false,
    users: [
      'Максим Зуевский',
      'Владимир Трояновский',
      'Антон Подосинников',
      'Анастасия Хвостова'
    ],
    projects: [
      {
        name: 'Входящие'
      }
    ],
    labels: [
    ],
    tasks: [
    ]
  },
  getters: {
    actualTask: state => {
      return state.tasks.filter(task => task.id === state.actualTaskId)[0]
    }
  },
  actions: {
    deleteAssigned: ({commit}, payload) => {
      switch (payload.key) {
        case 'subcontractors':
        case 'watchers':
          commit('deleteManyAssigned', payload)
          break
        default:
          commit('deleteAssigned', payload)
          break
      }
    }
  },
  mutations: {
    updateTaskDates (state, dates) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].dates = dates
    },
    addTaskLabel (state, label) {
      let labels = state.tasks.filter(task => task.id === state.actualTaskId)[0].labels
      labels.push(label)
      state.tasks.filter(task => task.id === state.actualTaskId)[0].labels = labels
    },
    deleteManyAssigned (state, payload) {
      const { key, val } = payload
      let arr = state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned[key]
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned[key] = arr.filter(item => item !== val)
    },
    deleteAssigned (state, payload) {
      const { key } = payload
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned[key] = null
    },
    closeLabelDialog (state) {
      state.labelDialog = false
    },
    openLabelDialog (state) {
      state.labelDialog = true
    },
    closeProjectDialog (state) {
      state.projectDialog = false
    },
    openProjectDialog (state) {
      state.projectDialog = true
    },
    addLabel (state, payload) {
      const randomId = 'label-' + state.counter
      payload.id = randomId
      state.labels.push(payload)
      state.counter++
    },
    addProject (state, payload) {
      const randomId = 'project-' + state.counter
      payload.id = randomId
      state.projects.push(payload)
      state.counter++
    },
    login (state) {
      state.authenticated = true
    },
    setTaskProject (state, project) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].project = project
    },
    toggleTaskView (state) {
      state.viewTask = !state.viewTask
    },
    closeTaskViewAndAdd (state) {
      state.viewTask = false
      state.actualTaskId = null
    },
    showTaskView (state, payload) {
      if (state.actualTaskId === payload) {
        state.viewTask = false
        state.addTask = false
        state.actualTaskId = null
      } else {
        state.viewTask = true
        state.addTask = false
        state.actualTaskId = payload
      }
    },
    toggleAddTask (state) {
      state.viewTask = false
      state.actualTaskId = null
      state.addTask = !state.addTask
    },
    toggleSidebar (state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    addComment (state, payload) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].activity.push({
        from: 'Artem Gershteyn',
        text: payload.text,
        date: payload.date,
        type: 1
      })
    },
    assignToTask (state, assigned) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned = assigned
    },
    updateName (state, taskName) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].name = taskName
    },
    updateDeadline (state, deadline) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].deadline = deadline
    },
    updateDescription (state, description) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].description = description
    },
    addDocument (state, doc) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].docs.push(doc)
    },
    updateCheckName (state, payload) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0]
        .checks.filter(check => check.id === payload.checkId)[0].name = payload.val
    },
    checkSubtask (state, checkId) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].checks.filter(check => check.id === checkId)[0].checked = !state.tasks.filter(task => task.id === state.actualTaskId)[0].checks.filter(check => check.id === checkId)[0].checked
    },
    addCheck (state) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].checks.push({
        name: '',
        id: Math.random() + 'subtask' + state.actualTaskId,
        checked: false
      })
    },
    assignResposible (state, responsible) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned.responsible = responsible
    },
    assignSubcontractor (state, subcontractor) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned.subcontractors.push(subcontractor)
    },
    assignDirector (state, director) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned.director = director
    },
    assignWatcher (state, watcher) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned.watchers.push(watcher)
    },
    addTask (state) {
      const randomId = 'task-' + state.counter
      const body = {
        name: 'Новая задача',
        completed: false,
        id: randomId,
        project: {
          name: 'Входящие'
        },
        deadline: null,
        dates: [
          new Date(),
          new Date()
        ],
        labels: [],
        assigned: {
          responsible: null,
          subcontractors: [],
          watchers: [],
          director: null
        },
        docs: [],
        subtasks: [],
        description: '',
        activity: []
      }
      state.tasks.unshift(body)
      state.viewTask = true
      state.actualTaskId = randomId
      state.counter++
      state.tasks.filter(task => task.id === state.actualTaskId)[0].activity.push({
        from: 'Artem Gershteyn',
        text: 'cоздал задачу',
        date: format(
          new Date(),
          'D MMM HH:mm:ss',
          {locale: ru}
        ),
        type: 0
      })
    },
    toggleTask (state, payload) {
      state.tasks[payload].completed = !state.tasks[payload].completed
    },
    deleteTask (state) {
      state.viewTask = false
      state.tasks = state.tasks.filter(task => task.id !== state.actualTaskId)
      state.actualTaskId = null
    }
  }
})
router.beforeEach((to, from, next) => {
  store.commit('closeTaskViewAndAdd')
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
