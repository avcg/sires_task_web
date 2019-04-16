<template lang="pug">
  .toolbar
    .logo
      span SIRES
    .burger(@click='toggleSide')
      a-icon(v-if='isSidebarOpen' type="menu-fold")
      a-icon(v-else type="menu-unfold")
    .route {{$route.name}}
    .spacer
    .logout(@click='logout')
      a-icon(type='logout')
    //- .search-input
    //-   a-icon(type="search")
    //-   input(placeholder='Поиск по задачам и тп.')
    //- .msg
    //-   i.la.icon 
    //- .notifications
    //-   a-icon(type="bell")
</template>
<script>
export default {
  methods: {
    toggleSide: function () {
      this.$store.commit('toggleSidebar')
    },
    logout: function () {
      this.$auth.logout()
    }
  },
  computed: {
    isSidebarOpen: function() {
      return this.$store.state.sidebarOpen
    }
  }
}
</script>

<style lang="sass" scoped>
  .toolbar
    height: 64px
    border-bottom: solid 1px #e8ecef
    display: flex
    align-items: center
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
    .logout
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
