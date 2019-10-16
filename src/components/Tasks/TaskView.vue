<template lang="pug">
.task-view(:style="{ height: proj ? '100%' : 'calc(100vh - 172px)' }")
  task-view-form(v-if="isLoaded" :proj="proj" @close="close")
  .loading(v-else)
    a-icon(type="loading")
</template>

<script>
import TaskViewForm from './view/TaskViewForm.vue';

export default {
  props: ['proj'],
  components: {
    TaskViewForm,
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
  computed: {
    isLoaded() {
      return !this.$store.state.fullTaskLoading;
    },
  },
};
</script>

<style lang="sass" scoped>
.task-view
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
