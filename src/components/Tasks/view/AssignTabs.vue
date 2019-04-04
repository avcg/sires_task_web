<template lang="pug">
.tabs
  .tabs-head
    .tabs-head-item(@click='activeTab = 0' :class=' { "active" : activeTab == 0 } ') Ответственный
    .tabs-head-item(@click='activeTab = 1' :class=' { "active" : activeTab == 1 } ') Соисполнители
    .tabs-head-item(@click='activeTab = 2' :class=' { "active" : activeTab == 2 } ') Наблюдатели
    .tabs-head-item(@click='activeTab = 3' :class=' { "active" : activeTab == 3 } ') Постановщик
  .tabs-body
    .tabs-body-item(v-if='activeTab == 0')
      s-menu(bottom)
        .assignBtn(v-if='responsible', @click='deleteAssigned($event, responsible, "responsible")')
          span {{responsible.match(/[A-ZА-Я]/g).slice(0,2).join('')}}
        .assignBtn(v-else)
          i.la.icon &#xf2c2;
        template(v-slot:menu='')
          s-list
            s-list-item(v-for='item in users',
              @click='assignResponsible(item)',
              :active='actualTask.assigned.responsible===item'
            ) {{item}}
    .tabs-body-item(v-if='activeTab == 1')
      s-menu(bottom, disableInnerClick)
        .fl
          .assignBtn(v-if='subcontractors.length>0',
              v-for='item in subcontractors',
              @click='deleteAssigned($event, item, "subcontractors")'
            )
            span {{item.match(/[A-ZА-Я]/g).slice(0,2).join('')}}
          .assignBtn
            i.la.icon &#xf2c2;
        template(v-slot:menu='')
          s-list
            s-list-item(v-for='item in users',
              @click='assignSubcontractor(item)',
              :active='subcontractors.indexOf(item)>-1'
            ) {{item}}
    .tabs-body-item(v-if='activeTab == 2')
      s-menu(bottom, disableInnerClick)
        .fl
          .assignBtn(v-if='watchers.length>0',
              v-for='item in watchers',
              @click='deleteAssigned($event, item, "watchers")'
            )
            span {{item.match(/[A-ZА-Я]/g).slice(0,2).join('')}}
          .assignBtn
            i.la.icon &#xf2c2;
        template(v-slot:menu='')
          s-list
            s-list-item(v-for='item in users',
              @click='assignWatcher(item)',
              :active='watchers.indexOf(item)>-1'
            ) {{item}}
    .tabs-body-item(v-if='activeTab == 3')
      s-menu(bottom)
        .assignBtn(v-if='director', @click='deleteAssigned($event, director, "director")')
          span {{director.match(/[A-ZА-Я]/g).slice(0,2).join('')}}
        .assignBtn(v-else)
          i.la.icon &#xf2c2;
        template(v-slot:menu='')
          s-list
            s-list-item(v-for='item in users',
              @click='assignDirector(item)',
              :active='actualTask.assigned.director===item'
            ) {{item}}
</template>

<script>
export default {
  data () {
    return {
      activeTab: 0
    }
  },
  methods: {
    deleteAssigned: function (e, val, key) {
      e.stopPropagation()
      console.log(e)
      console.log(val)
      console.log(key)
      const payload = { val, key }
      this.$store.dispatch('deleteAssigned', payload)
    },
    assignSubcontractor: function (subcontractor) {
      this.$store.commit('assignSubcontractor', subcontractor)
    },
    assignDirector: function (director) {
      this.$store.commit('assignDirector', director)
    },
    assignWatcher: function (watcher) {
      this.$store.commit('assignWatcher', watcher)
    },
    assignResponsible: function (responsible) {
      this.$store.commit('assignResposible', responsible)
    }
  },
  computed: {
    actualTask: function () {
      return this.$store.getters.actualTask
    },
    director: function () {
      return this.actualTask.assigned.director
    },
    responsible: function () {
      return this.actualTask.assigned.responsible
    },
    subcontractors: function () {
      return this.actualTask.assigned.subcontractors
    },
    watchers: function () {
      return this.actualTask.assigned.watchers
    },
    users: function () {
      return this.$store.state.users
    }
  }
}
</script>

<style lang="sass" scoped>
.tabs
  margin-top: 15px
  margin-bottom: 15px
  &-head
    display: flex
    &-item
      color: #778CA2
      font-weight: 500
      font-size: 12px
      text-transform: uppercase
      margin-right: 15px
      padding-bottom: 5px
      user-select: none
      transition: border-bottom .3s
      border-bottom: 2px solid transparent
      &:hover
        border-bottom: 2px solid #778CA2
        cursor: pointer
    .active
      color: $primary-color
      border-bottom: 2px solid $primary-color
  &-body
    margin-top: 10px
    .assignBtn
      width: 35px
      height: 35px
      margin-right: 5px
      display: flex
      align-items: center
      justify-content: center
      border-radius: 50%
      background-color: #f2f4f6
      &:hover
        cursor: pointer
        user-select: none
      i
        font-size: 18px
        color: $primary-color
</style>
