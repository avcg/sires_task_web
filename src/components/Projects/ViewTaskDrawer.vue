<template lang="pug">
  a-drawer(
    placement='right'
    @close='close'
    :visible='open'
    width='700'
  )
    task-view(:proj='true')
</template>
<script>
import TaskView from '../Tasks/TaskView'
export default {
  props: [ 'open' ],
  components: {TaskView},
  computed: {
    task(){
      return this.$store.state.actualTask
    }
  },
  methods: {
    close(){
      this.$emit('close')
    }
  }
}
</script>