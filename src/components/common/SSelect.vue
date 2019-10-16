<template lang="pug">
div
  .label(v-if="label") {{ label }}
  s-menu(disableInnerClick)
    .select
      .selected(v-for="(chip, i) in selected" v-if="i < 2")
        span {{ chip }}
      .arrow
        i.la.icon 
    template(v-slot:menu="")
      s-list
        template(v-for="(item, j) in items")
          s-list-item(@click="selectItem(item)" :active="selected.includes(item)")
            span {{ item }}
</template>

<script>
export default {
  name: 's-select',
  props: ['label', 'items'],
  data() {
    return {
      selected: [],
    };
  },
  methods: {
    selectItem(item) {
      if (this.selected.includes(item)) {
        this.selected.splice(this.selected.indexOf(item), 1);
      } else {
        this.selected.push(item);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.label
  font-size: 14px
  color: #252631
  margin-bottom: 13px
.select
  height: 52px
  overflow: hidden
  border-width: 0
  border: solid 1px #e8ecef
  background-color: #ffffff
  width: 100%
  padding: 8px
  box-sizing: border-box
  background: #fff
  font-size: 14px
  font-weight: 500
  color: #1b1e24
  border-radius: 4px
  outline: none
  margin-bottom: 21px
  display: flex
  position: relative
  .arrow
    position: absolute
    top: 13px
    right: 16px
    i
      font-size: 18px
      color: #778ca2
  .selected
    margin-right: 10px
    border-radius: 4px
    font-size: 14px
    font-weight: 400
    color: #778CA2
    background-color: #F2F4F6
    padding: 10px 12px
    display: flex
    align-items: center
  &:hover
    cursor: pointer
</style>
