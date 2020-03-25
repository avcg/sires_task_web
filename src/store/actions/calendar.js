import axios from 'axios';

export default {
  getCalendar: ({ commit }, payload) => {
    commit('cleanCalendar');
    let month = 0;
    if (payload.month.length < 2) month = `0${payload.month}`;
    else month = payload.month;
    axios.get(`/calendar?year=${payload.year}&month=${month}`).then((res) => {
      commit('updateCalendar', res.data.calendar);
    });
  },
};
