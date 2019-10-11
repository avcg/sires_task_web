import axios from 'axios';

export default {
  updateTask(payload) {
    axios.put(`/tasks/${payload.id}`, { task: payload.task });
  },
};
