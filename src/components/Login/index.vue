<template lang="pug">
.cont
  .inner
    h2.title SIRES
    form.form
      span.mb.caption Email
      input.mb(name="email" v-model="email" @keyup.enter="logIn")
      span.mb.caption Пароль
      input.mb(name="password" type="password" v-model="password" @keyup.enter="logIn")
      a-button.mb.mt(type="primary" size="large" :disabled="!(email && password)"
                    :loading="loading" @click="logIn") Вход
      a-button(@click="registration.modal = true") Регистрация
    a-modal(title="Регистрация" cancelText="Отменить" okText="Зарегистрироваться"
            :okButtonProps="okButtonProps" v-model="registration.modal"
            @ok="register")
      a-row.mb(type="flex" align="middle" :gutter="16")
        a-col(:span="12")
          a-input(placeholder="Email" v-model="registration.email")
        a-col(:span="12")
          a-input(type="password" placeholder="Пароль" v-model="registration.password")
      a-row.mb(type="flex" align="middle" :gutter="16")
        a-col(:span="12")
          a-input(placeholder="Имя" v-model="registration.firstName")
        a-col(:span="12")
          a-input(placeholder="Фамилия" v-model="registration.lastName")
      a-row(type="flex" align="middle" :gutter="16")
        a-col(:span="12")
          a-input(placeholder="Должность" v-model="registration.position")
        a-col(:span="12")
          span.mb.caption Аватар
          input.inp(type="file" @change="addAvatar")
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      registration: {
        modal: false,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        position: '',
        avatar: null,
      },
    };
  },
  computed: {
    okButtonProps() {
      return { props: { disabled: !this.isFilled } };
    },
    isFilled() {
      let flag = true;
      const values = Object.values(this.registration);
      for (let i = 0; i < values.length; i += 1) {
        if (!values[i]) {
          flag = false;
          break;
        }
      }
      return flag;
    },
  },
  methods: {
    addAvatar(e) {
      this.registration.avatar = e.target.files[0];
    },
    register() {
      const body = new FormData();
      body.set('user[first_name]', this.registration.firstName);
      body.set('user[last_name]', this.registration.lastName);
      body.set('user[avatar]', this.registration.avatat);
      body.set('user[position]', this.registration.position);
      body.set('user[role]', 'regular');
      body.set('user[email]', this.registration.email);
      body.set('user[password]', this.registration.password);
      this.$auth.register({
        data: body,
        success: () => {
          this.$auth.login({
            data: {
              email: this.registration.email,
              password: this.registration.password,
            },
            success: (resSuc) => {
              this.$store.commit('changeUser', resSuc.data.user);
            },
            headers: {
              'Content-Type': 'application/json',
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
    logIn() {
      if (this.email && this.password) {
        this.loading = true;
        this.$auth.login({
          data: {
            email: this.email,
            password: this.password,
          },
          success: (res) => {
            this.loading = false;
            this.$store.dispatch('getProjects');
            this.$store.commit('changeUser', res.data.user);
          },
          headers: {
            'Content-Type': 'application/json',
          },
          error: (err) => {
            if (err.response.status === 401) {
              this.loading = false;
              this.$message.error('Неправильный логин или пароль');
            }
          },
          rememberMe: true,
          redirect: '/inbox',
        });
      }
    },
  },
};
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
