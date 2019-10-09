<template lang="pug">
transition(name='dialog')
  .dialog(v-if='open')
    .outside(@click='close')
    .cont
      .close(@click='close')
        i.la.icon 
      .header(v-if='title')
        .title {{title}}
      .body
        slot
      .actions(@close='close')
        slot(name='actions')
</template>

<script>
export default {
  props: ['open', 'title'],
  name: 's-dialog',
  data() {
    return {
      isOpen: false,
    };
  },
  watch: {
    open() {
      this.isOpen = !this.isOpen;
    },
  },
  methods: {
    close(e) {
      this.$emit('close');
    },
  },
};
</script>

<style lang="sass" scoped>
  .dialog
    position: fixed
    z-index: 3
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: flex
    align-items: center
    justify-content: center
    .outside
      position: absolute
      background-color: #212121
      bottom: 0
      top: 0
      left: 0
      right: 0
      opacity: 0.46
    .cont
      min-width: 500px
      min-height: 300px
      background: #fff
      transition: all .3s
      position: relative
      display: flex
      flex-direction: column
      z-index: 1
      border-radius: 4px
      box-shadow: 0 2px 16px 0 rgba(154, 155, 168, 0.12)
      position: relative
      .close
        position: absolute
        top: 20px
        right: 15px
        font-size: 22px
        transform: rotate(45deg)
        color: #778ca2
        transition: color .3s
        user-select: none
        &:hover
          cursor: pointer
          i
            color: $primary-color
      .header
        padding: 20px 24px
        font-size: 20px
      .body
        background-color: #f8fafb
        padding: 26px 28px
        flex: 1
      .actions
        padding: 20px 24px
        display: flex
        justify-content: space-between
</style>
