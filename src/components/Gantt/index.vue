<template lang="pug">
.gantt-cont
  gantt-chart(v-if="tasks" :tasks="tasks" :projects="projects")
  .loading(v-else)
    a-icon(type="loading")
</template>

<script>
import GanttChart from './GanttChart.vue';

export default {
  components: {
    GanttChart,
  },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
    projects() {
      const { projects } = this.$store.state;
      // projects.unshift({
      //   name: 'Входящие',
      //   id: this.$store.state.user.inbox_project_id
      // })
      return projects;
    },
  },
  mounted() {
    this.$store.dispatch('getInbox');
  },
};
</script>

<style lang="sass" scoped>
</style>
