<template lang="pug">
.list(v-on:click="callback($event)")
  slot
</template>

<script>
export default {
  name: 's-list',
  methods: {
    callback(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="sass" scoped>
.list
  height: 100%
  overflow-y: scroll
</style>
