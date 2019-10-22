<template lang="pug">
.tasks
  task-header(@openAddTask="openAddTask" @sort="changeSort" @sortByUser='sortByUser')
  task-body(:addTask="addTask" :sortBy="sortBy" :sortUser='sortUser' :sortRole='sortRole' )
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
      sortUser: null,
      sortRole: null,
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

    sortByUser(filters) {
      if (filters.length < 2) {
        this.sortUser = 'all';
        this.sortRole = null;
      }
      this.sortUser = filters[0];
      this.sortRole = filters[1];
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
