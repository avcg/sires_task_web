<template lang="pug">
  .body
    .cont(:style='{ width: viewTask ? "50%" : "100%", paddingRight: viewTask ? "28px" : 0 }')
      transition(name='task-list' enter-active-class="animated fast fadeIn" leave-active-class="animated fast fadeOut" mode="out-in")
        task-list(v-if='haveTasks')
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
  components: { TaskEmpty, TaskList, TaskView },
  computed: {
    haveTasks: function () {
      return this.$store.state.tasks.length > 0
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
