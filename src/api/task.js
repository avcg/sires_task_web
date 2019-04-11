import axios from 'axios';
export default {
  updateTask: function (payload) {
    axios.put('/tasks/' + payload.id, { task: payload.task })
  }
}