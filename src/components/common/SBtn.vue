<template lang="pug">
.btn(:class="{ 'disabled' : disabled }", @click="callback($event)")
  slot
</template>

<script>
export default {
  props: ['disabled'],
  name: 's-btn',
  methods: {
    callback(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="sass" scoped>
  .btn
    // background-image: linear-gradient(to right, #8E2DE2, #4A00E0)
    background-color: $primary-color
    min-width: 206px
    height: 46px
    border-radius: 4px
    font-size: 14px
    color: #fff
    text-transform: uppercase
    display: flex
    align-items: center
    justify-content: center
    font-weight: medium
    transition: background-color .3s, color .3s
    user-select: none
    &:hover
      background-color: #4973E9
      cursor: pointer
  .disabled
    background-color: #EFF1F3
    color: #708498
    &:hover
      background-color: #EDEFF1
      color: #4A77F4
      cursor: not-allowed
</style>
