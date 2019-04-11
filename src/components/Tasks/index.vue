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
  mounted() {
    this.$store.commit('cleanTasks')
    switch (this.$route.name) {
      case 'Входящие':
        this.$store.dispatch('getInbox')
        break
      default:
        this.$store.dispatch('getTasks')
        break
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
