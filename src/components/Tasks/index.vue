<template lang="pug">
  .tasks
    task-header(@openAddTask='openAddTask', @sort='changeSort')
    task-body(:addTask='addTask', :sortBy='sortBy')
</template>
<script>
import TaskHeader from './TaskHeader.vue'
import TaskBody from './TaskBody.vue'

export default {
  data () {
    return {
      addTask: false,
      sortBy: {
        name: 'По убыванию дедлайна',
        type: 'date',
        desc: true
      }
    }
  },
  updated(){
    this.initTasks()
  },
  mounted() {
    this.initTasks()
  },
  methods: {
    changeSort (val) {
      this.sortBy = val
    },
    initTasks: function () {
      this.$store.commit('cleanTasks')
      switch (this.$route.name) {
        case 'Входящие':
          this.$store.dispatch('getInbox')
          break
        case 'Сегодня':
          this.$store.dispatch('getTodayTasks')
          break
        case 'Неделя':
          this.$store.dispatch('getWeekTasks')
          break
        default:
          this.$store.dispatch('getTasks')
          break
      }
    },
    openAddTask: function () {
      this.addTask = !this.addTask
    }
  },
  components: { TaskHeader, TaskBody }
}
</script>

<style lang="sass" scoped>
  .tasks
    height: 100%
</style>
