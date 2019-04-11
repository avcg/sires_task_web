export default {
  cleanCalendar: (state) => {
    state.calendar = null
  },
  updateCalendar: (state, calendar) => {
    state.calendar = calendar
  }
}