<template lang="pug">
  .body
    .cont(:style='{ width: viewTask ? "50%" : "100%", paddingRight: viewTask ? "28px" : 0 }')
      transition(name='task-list' enter-active-class="animated fast fadeIn" leave-active-class="animated fast fadeOut" mode="out-in")
        task-list(v-if='getTasks.length>0', :tasks='getTasks')
        task-empty(v-else)
    .cont(:style='{ width: viewTask ? "50%" : 0 }')
      transition(name='task-view' enter-active-class="animated fast slideInRight" leave-active-class="animated fast slideOutRight" mode="out-in")
        task-view(:viewTask='viewTask',v-if='viewTask', :key='actualTaskId')
</template>
<script>
import TaskEmpty from './TaskEmpty.vue'
import TaskList from './TaskList.vue'
import TaskView from './TaskView.vue'

export default {
  props: [ 'sortBy' ],
  components: { TaskEmpty, TaskList, TaskView },
  computed: {
    getTasks: function () {
      let tasks = this.$store.state.tasks
      switch (this.sortBy.type) {
        case 'date':
          if(this.sortBy.desc) {
            tasks.sort(function(a,b){
              return new Date(b.finish_time) - new Date(a.finish_time);
            });
          }else {
            tasks.sort(function(a,b){
              return new Date(a.finish_time) - new Date(b.finish_time);
            });
          }
        case 'alphabet':
          if(this.sortBy.desc) {
            tasks.sort(function compare(a, b) {
              if (b.name < a.name)
                return -1;
              if (b.name > a.name)
                return 1;
              return 0;
            });
            
          } else {
            tasks.sort(function compare(a, b) {
              if (a.name < b.name)
                return -1;
              if (a.name > b.name)
                return 1;
              return 0;
            });
          }
          break;
      }
      return tasks
    },
    actualTaskId: function () {
      return this.$store.state.actualTaskId
    },
    viewTask: function () {
      return this.$store.state.viewTask
    }
  }
}
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
