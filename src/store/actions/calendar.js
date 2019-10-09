import axios from 'axios';

export default {
  getCalendar: ({ commit }, payload) => {
    commit('cleanCalendar');
    axios.get(`/tasks/calendar?year=${payload.year}&month=${payload.month}`).then((res) => {
      commit('updateCalendar', res.data.calendar);
    });
  },
};
