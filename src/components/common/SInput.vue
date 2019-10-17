<template lang="pug">
div
  .label(v-if="label") {{ label }}
  input.input(:value="value" @input="change")
</template>

<script>
export default {
  props: ['value', 'label'],
  name: 's-input',
  methods: {
    change(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="sass" scoped>
.label
  font-size: 14px
  color: #252631
  margin-bottom: 13px
.input
  height: 52px
  border-width: 0
  border: solid 1px #e8ecef
  background-color: #ffffff
  width: 100%
  padding: 18px 16px
  box-sizing: border-box
  background: #fff
  font-size: 14px
  font-weight: 500
  color: #1b1e24
  border-radius: 4px
  outline: none
  margin-bottom: 21px
</style>
