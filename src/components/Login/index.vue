<template lang="pug">
  .cont
    .inner
      h2.title SIRES
      form.form
        span.mb.caption Ваша почта
        input.mb(name="email" v-model='email' @keyup.enter='logIn')
        span.mb.caption Ваш пароль
        input.mb(name="password" v-model='password', type='password' @keyup.enter='logIn')
        a-button.mb.mt(:disabled='!email&&!password' type='primary' size='large' @click='logIn' :loading='loading') Вход
        a-button(@click='regModal = true') Регистрация
      a-modal(title='Регистрация', v-model='regModal', @ok='register', :okButtonProps='{props:{disabled: !(regModal&&regEmail&&regPass&&regName&&regLastn&&regPos&&regAva)}}',okText='Регистрация', cancelText='Отменить')
        a-row.mb(:gutter="16" type="flex" align="middle")
          a-col(:span='12')
            a-input(v-model='regEmail' placeholder="Email")
          a-col(:span='12')
            a-input(v-model='regPass' placeholder="Пароль" type='password')
        a-row.mb(:gutter="16" type="flex" align="middle")
          a-col(:span='12')
            a-input(v-model='regName' placeholder="Имя")
          a-col(:span='12')
            a-input(v-model='regLastn' placeholder="Фамилия")
        a-row(:gutter="16" type="flex" align="middle")
          a-col(:span='12')
            a-input(v-model='regPos' placeholder="Должность")
          a-col(:span='12')
            span.mb.caption Ваша аватарка
            input.inp(type='file', @change='handleChange')
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      regModal: false,
      regEmail: '',
      regPass: '',
      regName: '',
      regLastn: '',
      regPos: '',
      regAva: null,
    }
  },
  methods: {
    handleChange: function(e) {
      this.regAva = e.target.files[0]
    },
    register: function() {
      let body = new FormData()
      body.set('user[first_name]', this.regName)
      body.set('user[last_name]', this.regLastn)
      body.set('user[avatar]', this.regAva)
      body.set('user[position]', this.regPos)
      body.set('user[role]', "regular")
      body.set('user[email]', this.regEmail)
      body.set('user[password]', this.regPass)
      this.$auth.register({
        data: body,
        success: () => {
          this.$auth.login({
            data: {
              email: this.regEmail,
              password: this.regPass
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
      if(this.email&&this.password) {
        this.loading = true
        this.$auth.login({
          data: {
            email: this.email,
            password: this.password
          },
          success: (res) => {
            this.loading = false
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
.mb
  margin-bottom: 10px
</style>
