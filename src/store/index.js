import Vue from 'vue';
import Vuex from 'vuex';
import { format } from 'date-fns';
import axios from 'axios';
import VueAxios from 'vue-axios';

import actionsTask from './actions/task';
import actionsCalendar from './actions/calendar';

import mutationsTask from './mutations/task';
import mutationsCalendar from './mutations/calendar';

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = 'https://api.avcg.ru/api/v1';
Vue.use(Vuex);

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
      'Анастасия Хвостова',
    ],
    projects: [
      {
        name: 'Входящие',
        id: 'inbox',
      },
    ],
    calendar: {},
    tags: [
    ],
    tasks: [
    ],
  },
  actions: {
    ...actionsTask,
    ...actionsCalendar,
    addTag: ({ commit }, name) => {
      axios.post('/tags', {
        tag: {
          name,
        },
      }).then((res) => {
        commit('pushTag', res.data.tag);
      });
    },
    addProject: ({ commit }, name) => {
      axios.post('/projects', {
        project: {
          name,
        },
      }).then((res) => {
        commit('pushProject', res.data.project);
      });
    },
    getInbox: ({ state, commit }) => {
      axios.get(`/tasks?project_id=${state.user.inbox_project_id}`).then((res) => {
        commit('updateTasks', res.data.tasks);
      });
    },
    getProjectTasks: ({ commit }, id) => {
      commit('cleanTasks');
      axios.get(`/tasks?project_id=${id}`).then((res) => {
        commit('updateTasks', res.data.tasks);
      });
    },
    getUsers: ({ commit }) => {
      axios.get('/users?limit=100').then((res) => {
        commit('updateUsers', res.data.users);
      });
    },
    getUser: ({ commit }) => {
      axios.get('/current_user').then((res) => {
        commit('changeUser', res.data.user);
      });
    },
    getTags: ({ commit }) => {
      axios.get('/tags').then((res) => {
        commit('updateTags', res.data.tags);
      });
    },
    getProjects: ({ commit }) => {
      axios.get('/projects?limit=100').then((res) => {
        commit('updateProjects', res.data.projects);
      });
    },
    getDateTasks: ({ commit }, date) => {
      axios.get(`/tasks?finish_date=${format(date, 'YYYY-MM-DD')}`).then((res) => {
        commit('updateTasks', res.data.tasks);
      });
    },
    getWeekTasks: ({ commit }) => {
      axios.get('/tasks?hot=true').then((res) => {
        commit('updateTasks', res.data.tasks);
      });
    },
    getTodayTasks: ({ commit }) => {
      axios.get(`/tasks?finish_date=${format(new Date(), 'YYYY-MM-DD')}`).then((res) => {
        commit('updateTasks', res.data.tasks);
      });
    },
    getTasks: ({ commit }) => {
      axios.get('/tasks?top_level').then((res) => {
        commit('updateTasks', res.data.tasks);
      });
    },
    deleteAssigned: ({ commit }, payload) => {
      switch (payload.key) {
        case 'subcontractors':
        case 'watchers':
          commit('deleteManyAssigned', payload);
          break;
        default:
          commit('deleteAssigned', payload);
          break;
      }
    },
  },
  mutations: {
    ...mutationsTask,
    ...mutationsCalendar,
    cleanTasks(state) {
      state.tasks = [];
    },
    updateUsers(state, users) {
      state.users = users;
    },
    updateTags(state, tags) {
      state.tags = tags;
    },
    changeUser(state, user) {
      state.user = user;
    },
    updateProjects(state, projects) {
      state.projects = projects;
    },
    addTaskLabel(state, label) {
      const { labels } = state.tasks.filter((task) => task.id === state.actualTaskId)[0];
      labels.push(label);
      state.tasks.filter((task) => task.id === state.actualTaskId)[0].labels = labels;
    },
    deleteManyAssigned(state, payload) {
      const { key, val } = payload;
      const arr = state.tasks.filter((task) => task.id === state.actualTaskId)[0].assigned[key];
      state.tasks.filter((task) => task.id === state.actualTaskId)[0].assigned[key] = arr.filter((item) => item !== val);
    },
    deleteAssigned(state, payload) {
      const { key } = payload;
      state.tasks.filter((task) => task.id === state.actualTaskId)[0].assigned[key] = null;
    },
    closeLabelDialog(state) {
      state.labelDialog = false;
    },
    openLabelDialog(state) {
      state.labelDialog = true;
    },
    closeProjectDialog(state) {
      state.projectDialog = false;
    },
    openProjectDialog(state) {
      state.projectDialog = true;
    },
    pushTag(state, payload) {
      state.tags.push(payload);
    },
    pushProject(state, payload) {
      state.projects.push(payload);
    },
    login(state) {
      state.authenticated = true;
    },
    toggleTaskView(state) {
      state.viewTask = !state.viewTask;
    },
    closeTaskViewAndAdd(state) {
      state.viewTask = false;
      state.actualTaskId = null;
    },
    toggleAddTask(state) {
      state.viewTask = false;
      state.actualTaskId = null;
      state.addTask = !state.addTask;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    updateTasks(state, payload) {
      state.tasks = payload;
    },
    toggleTask(state, payload) {
      state.tasks[payload].completed = !state.tasks[payload].completed;
    },
  },
});

export default store;
