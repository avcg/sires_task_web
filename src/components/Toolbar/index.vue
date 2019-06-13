<template lang="pug">
  .toolbar
    .logo
      span SIRES
    .burger(@click='toggleSide')
      a-icon(v-if='isSidebarOpen' type="menu-fold")
      a-icon(v-else type="menu-unfold")
    .route {{$route.name}}
    .spacer
    a-popover(:title="getFullName",  placement="bottomRight")
      .cont(slot="content")
        .popover-link(@click='profileModal = true') Профиль
        a-modal(title='Профиль' v-model='profileModal' @ok='profileModal = false' okText="Сохранить" cancelText="Отменить")
          a-row
            a-col
              input.inp(type='file', @change='handleChange')
          a-row
            a-col(:span='11')
              a-input(placeholder="Ваше имя", :defaultValue='getName', @change='changeName')
            a-col(:span='11', :offset='2')
              a-input(placeholder="Ваша фамилия", :defaultValue='getSurname', @change='changeSurname')
        .popover-link.popover-link-red(@click='logout') Выйти
      .avatar
        a-avatar(v-if='getAvatar' :src='getAvatar')
        a-avatar(icon="user", v-else)
    // .logout(@click='logout')
    //   a-icon(type='logout')
    // .search-input
    //   a-icon(type="search")
    //   input(placeholder='Поиск по задачам и тп.')
    // .msg
    //   i.la.icon 
    // .notifications
    //   a-icon(type="bell")
</template>
<script>
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  data() {
    return {
      loading: false,
      imageUrl: '',
      profileModal: false
    }
  },
  methods: {
    handleChange (e) {
      // console.log(e.target.files[0])
      getBase64(e.target.files[0], (imageUrl) => {
        this.imageUrl = imageUrl
        let obj = JSON.parse(localStorage[this.$store.state.user.email])
        obj.img = imageUrl
        localStorage[this.$store.state.user.email] = JSON.stringify(obj)
        this.loading = false
      })
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },
    toggleSide: function () {
      this.$store.commit('toggleSidebar')
    },
    logout: function () {
      this.$auth.logout()
    },
    changeName: function (e) {
      let obj = JSON.parse(localStorage[this.$store.state.user.email])
      obj.name = e.target.value
      localStorage[this.$store.state.user.email] = JSON.stringify(obj)
    },
    changeSurname: function (e) {
      let obj = JSON.parse(localStorage[this.$store.state.user.email])
      obj.surname = e.target.value
      localStorage[this.$store.state.user.email] = JSON.stringify(obj)
    }
  },
  computed: {
    isSidebarOpen: function() {
      return this.$store.state.sidebarOpen
    },
    getAvatar: function () {
      let obj = JSON.parse(localStorage[this.$store.state.user.email])
      return obj.img
    },
    getName: function () {
      let obj = JSON.parse(localStorage[this.$store.state.user.email])
      return obj.name
    },
    getSurname: function () {
      let obj = JSON.parse(localStorage[this.$store.state.user.email])
      return obj.surname
    },
    getFullName: function () {
      let obj = JSON.parse(localStorage[this.$store.state.user.email])
      const toTitleCase = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase()
      return toTitleCase(obj.name) + " " + toTitleCase(obj.surname)
    }
  }
}
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
