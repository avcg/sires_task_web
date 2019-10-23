<template lang="pug">
.sidebar(:style="{ width: sidebarOpen ? '242px' : '77px' }")
  .menu
    //- .active-line(:style=" { top: `${top}px`, height: isProj ? '46px' : '64px' } ")
    div(@click="getEl")
      router-link.menu-item(to="/inbox" active-class="active")
        i.la.icon &#xf247;
        span(v-if="sidebarOpen") Входящие
    div(@click="getEl")
      router-link.menu-item(to="/today" active-class="active")
        i.la.icon &#xf26d;
        span(v-if="sidebarOpen") Сегодня
    div(@click="getEl")
      router-link.menu-item(to="/week" active-class="active")
        i.la.icon &#xf15d;
        span(v-if="sidebarOpen") Неделя
    div(@click="getEl")
      router-link.menu-item(to="/gantt" active-class="active")
        i.la.icon &#xf33b;
        span(v-if="sidebarOpen") Гантт
    div(@click="getEl")
      router-link.menu-item(to="/calendar" active-class="active")
        i.la.icon &#xf15f;
        span(v-if="sidebarOpen") Календарь
  .projects-glob(v-if="sidebarOpen")
    .projects
      .headline
        .headline-inner
          span Проекты
          .add(@click="openAddProj")
            i.la.icon 
            span Добавить
      .proj-search
        a-input(size='small' placeholder='Поиск по проектам' v-model='searchProj')
      .list
        div(v-for="(item, i) in filteredProjects" :key="`item${i}`"
            @click="getEl($event, true)")
          router-link.list-item(:to="`/project/${item.id}`" active-class="active")
            span {{item.name.length > 21 ? `${item.name.substring(0, 21)}...` : item.name}}
    .projects
      .headline
        .headline-inner
          span Теги
          .add(v-if="$auth.check('admin')" @click="openAddLabel")
            i.la.icon 
            span Добавить
      .list
        div(v-for="(tag, i) in tags" :key="`tag${i}`"
            @click="deleteTag(tag.id)")
          .list-item(active-class="active")
            span {{ tag.name }}
</template>

<script>
export default {
  data() {
    return {
      top: 65,
      isProj: false,
      searchProj: '',
    };
  },
  computed: {
    filteredProjects() {
      const { searchProj, projects } = this;
      if (searchProj) {
        return projects.filter((p) => p.name.toLowerCase().includes(searchProj));
      }
      return projects;
    },
    projects() {
      return this.$store.getters.getProjectsAll.filter((it) => it.name !== 'Inbox' && it.name !== 'Входящие').sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
      });
    },
    tags() {
      return this.$store.state.tags;
    },
    sidebarOpen() {
      return this.$store.state.sidebarOpen;
    },
    activeItem() {
      switch (this.$route.name) {
        case 'Входящие':
          return 0;
        case 'Сегодня':
          return 1;
        case 'Неделя':
          return 2;
        default:
          return 0;
      }
    },
  },
  methods: {
    deleteTag(id) {
      this.axios.delete(`/tags/${id}`);
    },
    openAddProj() {
      this.$store.commit('openProjectDialog');
    },
    openAddLabel() {
      this.$store.commit('openLabelDialog');
    },
    getEl(e, proj) {
      e.stopPropagation();
      if (proj) this.isProj = true;
      else this.isProj = false;
      this.top = e.target.getBoundingClientRect().top;
    },
  },
};
</script>

<style lang="sass" scoped>
.proj-search
  padding-left: 28px
  padding-right: 20px
.sidebar
  border-right: solid 1px #e8ecef
  overflow: hidden
  white-space: nowrap
  transition: width .5s
  height: 100%
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
  .projects-glob
    max-height: calc(100% - 235px)
    padding-bottom: 235px
    overflow: auto
  .projects
    .list
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
      position: sticky
      top: 0
      z-index: 10
      background: #fff
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
