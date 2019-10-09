<template lang="pug">
  .toolbar
    .logo
      span SIRES
    .burger(@click='toggleSide')
      a-icon(v-if='isSidebarOpen' type="menu-fold")
      a-icon(v-else type="menu-unfold")
    .route {{$route.name}}
    .spacer
    a-popover(:title="getFullName" placement="bottomRight")
      .cont(slot="content")
        .popover-link(@click='profileModal = true') Профиль
        a-modal(title='Профиль' v-model='profileModal'
                cancelText="Отменить" okText="Сохранить"
                @ok='updateProfile')
          a-row
            a-col
              input.inp(type='file' @change='handleChange')
          a-row.mb
            a-col(:span='11')
              a-input(placeholder="Ваше имя" v-model='name')
            a-col(:span='11' :offset='2')
              a-input(placeholder="Ваша фамилия" v-model='surname')
          a-row
            a-col(:span='11')
              a-input(placeholder="Должность" v-model='position')
        .popover-link.popover-link-red(@click='logout') Выйти
      .avatar
        a-avatar(v-if='getAvatar' :src='getAvatar')
        a-avatar(v-else icon="user")
</template>

<script>
import axios from 'axios';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      loading: false,
      imageUrl: '',
      ava: '',
      profileModal: false,
      name: this.$store.state.user.first_name,
      surname: this.$store.state.user.last_name,
      position: this.$store.state.user.position,
    };
  },
  methods: {
    handleChange(e) {
      this.ava = e.target.files[0];
      getBase64(e.target.files[0], (imageUrl) => {
        this.imageUrl = imageUrl;
        const obj = JSON.parse(localStorage[this.$store.state.user.email]);
        obj.img = imageUrl;
        localStorage[this.$store.state.user.email] = JSON.stringify(obj);
        this.loading = false;
      });
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    },
    toggleSide() {
      this.$store.commit('toggleSidebar');
    },
    logout() {
      this.$auth.logout();
      window.location = '/';
    },
    updateProfile() {
      const body = new FormData();
      body.set('user[first_name]', this.name);
      body.set('user[last_name]', this.surname);
      body.set('user[avatar]', this.ava);
      body.set('user[position]', this.position);
      axios({
        method: 'put',
        url: `/users/${this.$store.state.user.id}`,
        data: body,
        header: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        this.$store.commit('changeUser', res.data.user);
      });
      this.profileModal = false;
    },
  },
  watch: {
    getName() {
      this.name = this.getName;
    },
  },
  computed: {
    isSidebarOpen() {
      return this.$store.state.sidebarOpen;
    },
    getAvatar() {
      return `https://api.avcg.ru${this.$store.state.user.avatar}`;
    },
    getName() {
      return this.$store.state.user.first_name;
    },
    getSurname() {
      return this.$store.state.user.last_name;
    },
    getPosition() {
      return this.$store.state.user.position;
    },
    getFullName() {
      if (this.getName && this.getSurname) {
        const toTitleCase = (s) => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();
        return `${toTitleCase(this.getName)} ${toTitleCase(this.getSurname)}`;
      }
      return null;
    },
  },
};
</script>
<style lang="sass">
  .popover-link
    margin-bottom: 5px
    &:hover
      cursor: pointer
    &-red
      color: #f5222d
</style>

<style lang="sass" scoped>
  .mb
    margin-bottom: 10px
  .inp
    margin-bottom: 15px
  .toolbar
    height: 64px
    border-bottom: solid 1px #e8ecef
    display: flex
    align-items: center
    .cont
      .logout
        color: #f5222d
    i
      user-select: none
      transition: color .3s
      color: #92A0B0
    .logo
      width: 242px
      text-align: center
      font-size: 30px
      font-weight: 300
      letter-spacing: 6px
    .burger
      margin-left: 26px
      font-size: 24px
      &:hover
        i
          cursor: pointer
          color: $primary-color
    .add
      margin-left: 24px
    .route
      font-size: 20px
      margin-left: 20px
      color: #252631
    .avatar
      margin-right: 25px
      height: 100%
      padding: 0 15px
      display: flex
      align-items: center
      font-size: 20px
      i
        transition: color .3s
      &:hover
        cursor: pointer
        i
          color: #FE4D97
    .msg
      margin-left: 26px
    .notifications
      margin-left: 26px
      margin-right: 55px
      font-size: 24px
    .apps
      margin-left: 26px
    .user
      width: 36px
      height: 36px
      background-position: center center
      background-size: 100% auto
      border-radius: 50%
      margin: 0 26px
    .search-input
      display: flex
      align-items: center
      input
        padding: 0px
        border-width: 0px
        font-size: 14px
        color: #252631
        margin-left: 13px
        outline: none
        width: 260px
        &::placeholder
          color: #778ca2
</style>
