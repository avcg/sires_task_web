<template lang="pug">
  s-dialog(:open='open', title='Добавить тег', @close='closeDialog')
    template
      a-input(v-model='name', placeholder='Название тега')
    template(v-slot:actions='')
      .spacer
      s-btn(:disabled='!name', @click='addLabel') Добавить
</template>
<script>
export default {
  computed: {
    open: function () {
      return this.$store.state.labelDialog
    }
  },
  methods: {
    closeDialog: function () {
      this.$store.commit('closeLabelDialog')
    },
    addLabel: function () {
      const body = {
        name: this.name
      }
      this.$store.commit('addLabel', body)
      this.closeDialog()
    }
  },
  data () {
    return {
      name: ''
    }
  }
}
</script>
<style lang="sass" scoped>
  .label
    font-size: 14px
    color: #252631
    margin-bottom: 13px
  .block
    width: 100%
  .date
    height: 52px
    border-width: 0
    border: solid 1px #e8ecef
    background-color: #ffffff
    display: flex
    align-items: center
    box-sizing: border-box
    background: #fff
    font-size: 14px
    font-weight: 500
    color: #1b1e24
    border-radius: 4px
    outline: none
    margin-bottom: 21px
    justify-content: space-between
    padding: 0 16px
    flex: 1
    &-cont
      flex: 1
</style>
