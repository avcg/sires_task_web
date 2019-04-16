<template lang="pug">
  .sidebar(:style='{ width: sidebarOpen? "242px" : "77px" }')
    .menu
      //- .active-line(:style=' { top: top + "px", height: isProj ? "46px" : "64px" } ')
      div(@click='getEl')
        router-link.menu-item(to='/inbox', active-class='active')
          i.la.icon &#xf247;
          span(v-if='sidebarOpen') Входящие
      div(@click='getEl')
        router-link.menu-item(to='/today', active-class='active')
          i.la.icon &#xf26d;
          span(v-if='sidebarOpen') Сегодня
      div(@click='getEl')
        router-link.menu-item(to='/week', active-class='active')
          i.la.icon &#xf15d;
          span(v-if='sidebarOpen') Неделя
      div(@click='getEl')
        router-link.menu-item(to='/gantt', active-class='active')
          i.la.icon &#xf33b;
          span(v-if='sidebarOpen') Гантт
      div(@click='getEl')
        router-link.menu-item(to='/calendar', active-class='active')
          i.la.icon &#xf15f;
          span(v-if='sidebarOpen') Календарь
    .projects
      .headline
        .headline-inner(v-if='sidebarOpen')
          span Проекты
          .add(@click='openAddProj')
            i.la.icon 
            span Добавить
      .list(v-if='sidebarOpen')
        div(v-for='item in projects', @click='getEl($event, true)')
          router-link.list-item(:to='"/project/" + item.id', active-class='active', v-if='item.name!=="Входящие"')
            span {{item.name}}
    .projects
      .headline
        .headline-inner(v-if='sidebarOpen')
          span Теги
          .add(@click='openAddLabel')
            i.la.icon 
            span Добавить
      .list(v-if='sidebarOpen')
        div(v-for='tag in tags', @click='getEl($event, true)')
          .list-item(active-class='active')
            span {{ tag.name }}
</template>
<script>
export default {
  data () {
    return {
      top: 65,
      isProj: false
    }
  },
  methods: {
    openAddProj: function () {
      this.$store.commit('openProjectDialog')
    },
    openAddLabel: function () {
      this.$store.commit('openLabelDialog')
    },
    getEl: function (e, proj) {
      e.stopPropagation()
      if (proj) this.isProj = true
      else this.isProj = false
      this.top = e.target.getBoundingClientRect().top
    }
  },
  computed: {
    projects: function () {
      return this.$store.state.projects
    },
    tags: function () {
      return this.$store.state.tags
    },
    sidebarOpen: function () {
      return this.$store.state.sidebarOpen
    },
    activeItem: function () {
      switch (this.$route.name) {
        case 'Входящие':
          return 0
        case 'Сегодня':
          return 1
        case 'Неделя':
          return 2
        default:
          return 0
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.sidebar
  transition: width .5s
  overflow: hidden
  white-space: nowrap
  border-right: solid 1px #e8ecef
  height: calc(100vh - 65px)
  .active
    background-color: #f8fafb
    span
      font-weight: 500
    i
      color: $primary-color
  .menu
    .active-line
      position: absolute
      z-index: 10
      left: 0
      width: 2px
      background-color: $primary-color
      transition: top .5s, height .5s
    &-item
      height: 64px
      display: flex
      align-items: center
      text-decoration: none
      padding-left: 28px
      transition: background-color .3s
      user-select: none
      *
        pointer-events: none
      &:hover
        cursor: pointer
        background-color: #f9fbfb
      span
        margin-left: 18px
        font-size: 14px
        letter-spacing: 0.3px
        color: #778ca2
      i
        font-size: 18px
  .projects
    .list
      max-height: 158px
      overflow: auto
      &-item
        height: 46px
        display: flex
        align-items: center
        transition: background-color .3s
        position: relative
        text-decoration: none
        user-select: none
        *
          pointer-events: none
        &:hover
          cursor: pointer
          background-color: #f9fbfb
        .label
          width: 3px
          position: absolute
          left: 0
          top: 0
          bottom: 0
        span
          margin-left: 28px
          font-size: 14px
          letter-spacing: 0.3px
          color: #778ca2
    .headline
      padding-left: 28px
      padding-right: 20px
      height: 60px
      font-size: 14px
      color: #98a9bc
      &-inner
        height: 100%
        display: flex
        justify-content: space-between
        align-items: center
        .add
          display: flex
          align-items: center
          user-select: none
          &:hover
            color: $primary-color
            cursor: pointer
            i
              color: $primary-color
          i
            font-size: 14px
          span
            transition: color .3s
            margin-left: 5px
</style>
