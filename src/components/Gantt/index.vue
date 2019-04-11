<template lang="pug">
  .gantt-cont
    gantt-chart(v-if='getTasks', :projects='getProjects', :tasks='getTasks')
    .loading(v-else)
      a-icon(type='loading')
</template>
<script>
import GanttChart from './GanttChart.vue'

export default {
  components: { GanttChart },
  computed: {
    getProjects: function () {
      let projects = this.$store.state.projects
      // projects.unshift({
      //   name: 'Входящие',
      //   id: this.$store.state.user.inbox_project_id
      // })
      return projects
    },
    getTasks: function () {
      return this.$store.state.tasks
    }
  },
  mounted() {
    this.$store.dispatch('getInbox')
  }
}
</script>
<style lang="sass" scoped>

</style>
