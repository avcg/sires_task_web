<template lang="pug">
  .cont(@click='isOpen = true', v-click-outside='closeMenu')
    .body
      slot
    transition(enter-active-class="animated fast fadeIn" leave-active-class="animated fast fadeOut")
      .menu(v-if='isOpen',v-on:click='innerClick',:style='{ top: bottom ? "calc(100% + 5px)" : 0, right: right ? "10px" : "auto", left: right ? "auto" : 0 }')
        slot(name='menu')
</template>
<script>
export default {
  props: ['disableInnerClick', 'right', 'bottom'],
  name: 's-menu',
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    innerClick: function () {
      if (!this.disableInnerClick) {
        this.isOpen = false
      }
    },
    closeMenu: function () {
      this.isOpen = false
    }
  }
}
</script>

<style lang="sass" scoped>
.cont
  position: relative
  .body
    &:hover
      cursor: pointer
  .menu
    position: absolute
    width: 100%
    height: 240px
    box-shadow: 0 2px 16px rgba(154,155,168,.12)
    top: 0
    left: 0
    background: #fff
    z-index: 2
</style>
