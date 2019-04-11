<template lang="pug">
  .cont
    .inner
      h2.title SIRES
      form.form
        span.mb.caption Ваша почта
        input.mb(name="email" v-model='email')
        span.mb.caption Ваш пароль
        input.mb(name="password" v-model='password', type='password')
        a-button.mb.mt(:disabled='!email&&!password' type='primary' size='large' @click='logIn') Вход
        a-button(:disabled='!email&&!password' @click='register') Регистрация
</template>
<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    register: function() {
      this.$auth.register({
        data: {
          user: {
            email: this.email,
            password: this.password,
            role: 'regular'
          }
        },
        success: () => {
          this.$auth.login({
            data: {
              email: this.email,
              password: this.password
            },
            success: (resSuc) => {
              this.$store.commit('changeUser', resSuc.data.user)
            },
            headers: {
              "Content-Type": "application/json"
            },
            rememberMe: true,
            redirect: '/inbox',
          });
        },
        autoLogin: false,
        rememberMe: true,
        redirect: '/login',
      });
    },
    logIn: function () {
      this.$auth.login({
        data: {
          email: this.email,
          password: this.password
        },
        success: (res) => {
          this.$store.commit('changeUser', res.data.user)
        },
        headers: {
          "Content-Type": "application/json"
        },
        rememberMe: true,
        redirect: '/inbox',
      });
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
  .form
    display: flex
    flex-direction: column
  .title
    font-size: 38px
    margin: 0
    text-align: center
    letter-spacing: 6px
    margin-bottom: 20px
  .log
    padding-bottom: 40px
    font-size: 30px
  .mt
    margin-top: 30px
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
