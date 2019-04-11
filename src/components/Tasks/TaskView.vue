<template lang="pug">
.task-view
  task-view-form(v-if='isLoaded')
  .loading(v-else)
    a-icon(type='loading')
</template>
<script>
import TaskViewForm from './view/TaskViewForm.vue'
export default {
  components: {
    TaskViewForm
  },
  computed: {
    isLoaded: function () {
      return !this.$store.state.fullTaskLoading
    }
  }
}
</script>

<style lang="sass" scoped>
.task-view
  height: calc(100vh - 172px)
  background-color: #ffffff
  transition: width .5s
  .loading
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    i
      font-size: 84px
</style>
