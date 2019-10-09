<template lang="pug">
.list-item(@click="callback($event)" :class='{ "active" : active }')
  slot
  .spacer
  i.la.icon(v-if='active') &#xf17b;
</template>

<script>
export default {
  name: 's-list-item',
  props: ['active'],
  methods: {
    callback(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="sass" scoped>
.list-item
  height: 60px
  display: flex
  align-items: center
  padding: 0 20px
  &:hover
    background-color: #F8FAFB
    cursor: pointer
.active
  color: $primary-color
  i
    color: $primary-color
</style>
