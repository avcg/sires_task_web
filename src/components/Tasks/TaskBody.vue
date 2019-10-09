<template lang="pug">
  .body
    .cont(:style='{ width: viewTask ? "50%" : "100%", paddingRight: viewTask ? "28px" : 0 }')
      transition(name='task-list' mode="out-in"
                enter-active-class="animated fast fadeIn"
                leave-active-class="animated fast fadeOut")
        task-list(v-if='getTasks.length > 0', :tasks='getTasks')
        task-empty(v-else)
    .cont(:style='{ width: viewTask ? "50%" : 0 }')
      transition(name='task-view' mode="out-in"
                enter-active-class="animated fast slideInRight"
                leave-active-class="animated fast slideOutRight")
        task-view(v-if='viewTask' :key='actualTaskId' :viewTask='viewTask')
</template>

<script>
import TaskEmpty from './TaskEmpty.vue';
import TaskList from './TaskList.vue';
import TaskView from './TaskView.vue';

export default {
  props: ['sortBy'],
  components: { TaskEmpty, TaskList, TaskView },
  computed: {
    getTasks() {
      const { tasks } = this.$store.state;
      switch (this.sortBy.type) {
        case 'date':
          if (this.sortBy.desc) {
            tasks.sort((a, b) => new Date(b.finish_time) - new Date(a.finish_time));
          } else {
            tasks.sort((a, b) => new Date(a.finish_time) - new Date(b.finish_time));
          }
        case 'alphabet':
          if (this.sortBy.desc) {
            tasks.sort((a, b) => {
              if (b.name < a.name) { return -1; }
              if (b.name > a.name) { return 1; }
              return 0;
            });
          } else {
            tasks.sort((a, b) => {
              if (a.name < b.name) { return -1; }
              if (a.name > b.name) { return 1; }
              return 0;
            });
          }
          break;
      }
      return tasks;
    },
    actualTaskId() {
      return this.$store.state.actualTaskId;
    },
    viewTask() {
      return this.$store.state.viewTask;
    },
  },
};
</script>

<style lang="sass" scoped>
  .body
    padding-top: 30px
    box-sizing: border-box
    height: 100%
    display: flex
    transition: flex .5s
    .cont
      overflow: hidden
      transition: width 1s, padding-right .5s
      height: 100%
</style>
