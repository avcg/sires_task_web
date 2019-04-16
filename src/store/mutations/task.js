export default {
  addTaskTag (state, tag) {
    state.actualTask.tags.push(tag)
  },
  deleteTask (state) {
    state.viewTask = false
    state.tasks = state.tasks.filter(task => task.id !== state.actualTask.id)
    state.actualTask = null
  },
  addComment (state, comment) {
    state.actualTask.comments.push(comment)
  },
  addTaskAttachment (state, file) {
    state.actualTask.attachments.push(file)
  },
  updateTaskDates (state, dates) {
    const start = dates[0].format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'),
      end = dates[1].format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ')
    state.actualTask.start_time = start
    state.actualTask.finish_time = end
    // show change in taskList
    state.tasks.filter(i => i.id === state.actualTask.id)[0].start_time = start
    state.tasks.filter(i => i.id === state.actualTask.id)[0].finish_time = end
  },
  updateName (state, taskName) {
    state.actualTask.name = taskName
    // show change in taskList
    state.tasks.filter(i => i.id === state.actualTask.id)[0].name = taskName
  },
  setTaskProject (state, id) {
    state.actualTask.project = state.projects.filter(i=>i.id===id)[0]
  },
  addTask (state, task) {
    state.tasks.unshift(task)
  },
  changeActualTask (state, task) {
    state.actualTask = task
  },
  fullTaskIsLoading (state) {
    state.fullTaskLoading = true
  },
  fullTaskIsLoaded (state) {
    state.fullTaskLoading = false
  },
  showTaskView (state) {
    state.viewTask = true
  },
  hideTaskView (state) {
    state.viewTask = false
  },
  makeUndoneTask (state, id) {
    state.tasks.filter(i => i.id===id)[0].done = false
  },
  makeDoneTask (state, id) {
    state.tasks.filter(i => i.id===id)[0].done = true
  },
}