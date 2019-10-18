<template lang="pug">
.tasks
  task-header(@openAddTask="openAddTask" @sort="changeSort" @imInToggle='imInToggle')
  task-body(:addTask="addTask" :sortBy="sortBy" :imIn='imInTask' )
</template>

<script>
import TaskHeader from './TaskHeader.vue';
import TaskBody from './TaskBody.vue';

export default {
  components: {
    TaskHeader,
    TaskBody,
  },
  data() {
    return {
      addTask: false,
      imInTask: true,
      sortBy: {
        name: 'По убыванию дедлайна',
        type: 'date',
        desc: true,
      },
    };
  },
  mounted() {
    this.initTasks();
  },
  updated() {
    this.initTasks();
  },
  methods: {
    imInToggle() {
      this.imInTask = !this.imInTask;
    },
    changeSort(val) {
      this.sortBy = val;
    },
    initTasks() {
      this.$store.commit('cleanTasks');
      switch (this.$route.name) {
        case 'Входящие':
          this.$store.dispatch('getInbox');
          break;
        case 'Сегодня':
          this.$store.dispatch('getTodayTasks');
          break;
        case 'Неделя':
          this.$store.dispatch('getWeekTasks');
          break;
        default:
          this.$store.dispatch('getTasks');
          break;
      }
    },
    openAddTask() {
      this.addTask = !this.addTask;
    },
  },
};
</script>

<style lang="sass" scoped>
  .tasks
    height: 100%
    box-sizing: border-box
</style>
