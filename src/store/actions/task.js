import axios from 'axios';
import { startOfDay, endOfDay } from 'date-fns';
import _ from 'lodash';
import API from '@/api/task';

const saveDebounced = _.wrap(
  _.memoize(() => _.debounce(API.updateTask, 500), _.property('id')),
  (func, payload) => func(payload)(payload),
);

export default {
  addTagTask: ({ state, commit }, tag) => {
    commit('addTaskTag', tag);
    const newTask = state.actualTask;
    delete newTask.attachments;
    const payload = {
      id: state.actualTask.id,
      task: newTask,
    };
    payload.task.tag_ids = payload.task.tags.map((t) => t.id);
    saveDebounced(payload);
  },
  deleteTask: ({ state, commit }) => {
    axios.delete(`/tasks/${state.actualTask.id}`);
    commit('deleteTask');
  },
  addTaskComment: ({ state, commit }, comment) => {
    const commentWithUser = { ...comment };
    commentWithUser.author = state.user;
    commit('addComment', commentWithUser);
    axios.post(`/tasks/${state.actualTask.id}/comments`, { comment });
  },
  addTaskAttachment: ({ commit }, file) => {
    commit('addTaskAttachment', file);
    // axios.put('/tasks/' + state.actualTask.id, { task: state.actualTask })
  },
  updateTaskDates: ({ state, commit }, val) => {
    commit('updateTaskDates', val);
    const newTask = state.actualTask;
    delete newTask.attachments;
    const payload = {
      id: state.actualTask.id,
      task: newTask,
    };
    saveDebounced(payload);
  },
  updateAssign: ({}, { task_id, user_ids, role }) => {
    axios.put(`/tasks/${task_id}/members/roles/${role}`, { user_ids });
  },
  updateName: ({ state, commit }, name) => {
    commit('updateName', name);
    const newTask = state.actualTask;
    delete newTask.attachments;
    const payload = {
      id: state.actualTask.id,
      task: newTask,
    };
    saveDebounced(payload);
  },
  updateDescription: ({ state, commit }, name) => {
    commit('updateDescription', name);
    const newTask = state.actualTask;
    delete newTask.attachments;
    const payload = {
      id: state.actualTask.id,
      task: newTask,
    };
    saveDebounced(payload);
  },
  setTaskProject: ({ state, commit }, id) => {
    commit('setTaskProject', id);
    const newTask = { ...state.actualTask };
    newTask.project_id = id;
    axios.put(`/tasks/${state.actualTask.id}`, { task: newTask });
  },
  addTask: ({ state, commit }, id) => {
    commit('fullTaskIsLoading');
    commit('showTaskView');
    if (id) {
      axios.post('/tasks', {
        task: {
          finish_time: endOfDay(new Date()).toISOString(),
          name: 'Новая задача',
          project_id: parseInt(id, 10),
          start_time: startOfDay(new Date()).toISOString(),
        },
      }).then((res) => {
        commit('addTask', res.data.task);
        commit('changeActualTask', res.data.task);
        commit('fullTaskIsLoaded');
      });
    } else {
      axios.post('/tasks', {
        task: {
          finish_time: endOfDay(new Date()).toISOString(),
          name: 'Новая задача',
          project_id: state.user.inbox_project_id,
          start_time: startOfDay(new Date()).toISOString(),
        },
      }).then((res) => {
        commit('addTask', res.data.task);
        commit('changeActualTask', res.data.task);
        commit('fullTaskIsLoaded');
      });
    }
  },
  toggleTaskDone: ({ commit }, id) => {
    commit('makeDoneTask', id);
    return axios.post(`/tasks/${id}/mark_done`);
  },
  toggleTaskUndone: ({ commit }, id) => {
    axios.post(`/tasks/${id}/mark_undone`);
    commit('makeUndoneTask', id);
  },
  reloadTask: ({ commit }, id) => {
    axios.get(`/tasks/${id}`).then((res) => {
      commit('changeActualTask', res.data.task);
    });
  },
  showTask: ({ commit }, id) => {
    commit('fullTaskIsLoading');
    commit('showTaskView');
    return axios.get(`/tasks/${id}`).then((res) => {
      commit('fullTaskIsLoaded');
      commit('changeActualTask', res.data.task);
    });
  },
  showTaskProj: ({ commit }, id) => {
    axios.get(`/tasks/${id}`).then((res) => {
      commit('changeActualTask', res.data.task);
    });
  },
};
