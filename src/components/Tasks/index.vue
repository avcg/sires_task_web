<template lang="pug">
  .tasks
    task-header(v-on:openAddTask='openAddTask')
    task-body(:addTask='addTask')
</template>
<script>
import TaskHeader from './TaskHeader.vue'
import TaskBody from './TaskBody.vue'

export default {
  props: ['sortByProj'],
  data () {
    return {
      addTask: false
    }
  },
  methods: {
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
