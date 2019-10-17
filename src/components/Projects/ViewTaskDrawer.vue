<template lang="pug">
  a-drawer(placement="right" width="700"
          :visible="open" @close="close")
    task-view(:proj="true" @close="close")
</template>

<script>
import TaskView from '../Tasks/TaskView';

export default {
  props: ['open'],
  components: {
    TaskView,
  },
  computed: {
    task() {
      return this.$store.state.actualTask;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
