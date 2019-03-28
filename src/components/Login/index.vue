<template lang="pug">
  .cont
    .inner
      span.mb.caption Ваша почта
      input.mb
      span.mb.caption Ваш пароль
      input.mb
      s-btn(@click='logIn') Вход
</template>
<script>
export default {
  methods: {
    logIn: function () {
      this.$store.commit('login')
      this.$router.replace({ name: 'Входящие' })
    }
  }
}
</script>
<style lang="sass" scoped>
.cont
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  height: 100vh
  .log
    padding-bottom: 40px
    font-size: 30px
  .mb
    margin-bottom: 10px
  .sires
    font-size: 30px
    font-weight: 300
    letter-spacing: 6px
  .tasks
    font-size: 20px
    font-weight: 500
    letter-spacing: 3px
  .inner
    width: 360px
    display: flex
    flex-direction: column
  input
    border: 0
    border: 1px solid #E8ECEF
    border-radius: 4px
    width: 360px
    height: 46px
    padding: 14px 16px
    box-sizing: border-box
    font-size: 14px
    font-weight: 500
</style>
