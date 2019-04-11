import Vue from 'vue'
import Vuex from 'vuex'
import { format } from 'date-fns'
import ru from '../../node_modules/date-fns/locale/ru'
import axios from 'axios';
import VueAxios from 'vue-axios';

import actionsTask from './actions/task'
import actionsCalendar from './actions/calendar'

import mutationsTask from './mutations/task'
import mutationsCalendar from './mutations/calendar'

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = 'http://147.135.234.170:4000/api/v1';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {},
    actualTask: null,
    sidebarOpen: true,
    counter: 0,
    viewTask: false,
    fullTaskLoading: true,
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
        name: 'Входящие',
        id: 'inbox'
      }
    ],
    calendar: {},
    tags: [
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
    ...actionsTask,
    ...actionsCalendar,
    addTag: ({commit}, name) => {
      axios.post('/tags', {
        tag: {
          name
        }
      }).then(res=>{
        commit('pushTag', res.data.tag)
      })
    },
    addProject: ({commit}, name) => {
      axios.post('/projects', {
        project: {
          name
        }
      }).then(res=>{
        commit('pushProject', res.data.project)
      })
    },
    getInbox: ({state, commit}) => {
      axios.get('/tasks?project_id=' + state.user.inbox_project_id).then(res=>{
        commit('updateTasks', res.data.tasks)
      })
    },
    getProjectTasks: ({commit}, id) => {
      commit('cleanTasks')
      axios.get('/tasks?project_id=' + id).then(res=>{
        commit('updateTasks', res.data.tasks)
      })
    },
    getUsers: ({commit}) => {
      axios.get('/users').then(res=>{
        commit('updateUsers', res.data.users)
      })      
    },
    getUser: ({commit}) => {
      axios.get('/current_user').then(res=>{
        commit('changeUser', res.data.user)
      })      
    },
    getTags: ({commit}) => {
      axios.get('/tags').then(res=>{
        commit('updateTags', res.data.tags)
      })
    },
    getProjects: ({commit}) => {
      axios.get('/projects').then(res=>{
        commit('updateProjects', res.data.projects)
      })
    },
    getTasks: ({commit}) => {
      axios.get('/tasks').then(res=>{
        commit('updateTasks', res.data)
      })
    },
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
    ...mutationsTask,
    ...mutationsCalendar,
    cleanTasks (state) {
      state.tasks = []
    },
    updateUsers (state, users) {
      state.users = users
    },
    updateTags (state, tags) {
      state.tags = tags
    },
    changeUser (state, user) {
      state.user = user
    },
    updateProjects (state, projects) {
      state.projects = projects
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
    pushTag (state, payload) {
      state.tags.push(payload)
    },
    pushProject (state, payload) {
      state.projects.push(payload)
    },
    login (state) {
      state.authenticated = true
    },
    toggleTaskView (state) {
      state.viewTask = !state.viewTask
    },
    closeTaskViewAndAdd (state) {
      state.viewTask = false
      state.actualTaskId = null
    },
    toggleAddTask (state) {
      state.viewTask = false
      state.actualTaskId = null
      state.addTask = !state.addTask
    },
    toggleSidebar (state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    assignToTask (state, assigned) {
      state.tasks.filter(task => task.id === state.actualTaskId)[0].assigned = assigned
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
    updateTasks (state, payload) {
      state.tasks = payload
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

export default store