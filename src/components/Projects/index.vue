<template lang="pug">
  div
    a-row(:gutter="16")
      a-col(:span='15')
        TaskList
      a-col(:span='9')
        a-card(:title='project.name', :bodyStyle=' {maxHeight: "100%"} ')
          a-row
            a-col(:span='10' :offset='14')
              a-button(type='primary', @click='openDrawer = true') Добавить задачу
          a-row
            a-col
              .headline Админ
          a-row
            a-col
              a-select(:defaultValue='project.members.filter(i=>i.role==="admin")[0].user.email')
          a-row
            a-col
              .headline Наблюдатели
          a-row
            a-col
              a-select(mode="multiple", placeholder="Наблюдатели", style='width: 100%')
                a-select-option(v-for='member in project.members' :value='member.user.id') {{member.user.email}}
          a-row
            a-col
              .headline Участники
          a-row
            a-col
              a-select(mode="multiple", placeholder="Участники", style='width: 100%')
                a-select-option(v-for='user in users' :value='user.id') {{user.email}}
    add-task-drawer(:open='openDrawer', @close='openDrawer = false')
</template>
<script>
import AddTaskDrawer from './AddTaskDrawer.vue'
import TaskList from '../Tasks/TaskList.vue'
import axios from 'axios'
export default {
  components: { AddTaskDrawer, TaskList },
  data() {
    return {
      openDrawer: false,
      project: null,
      users: null
    }
  },
  mounted() {
    axios.get('/users').then(res => {
      this.users = res.data.users
    })
    axios.get('/projects/' + this.$route.params.id).then(res => {
      this.project = res.data.project
    })
  }
}
</script>
<style lang="sass" scoped>
.headline
  margin: 10px 0
  font-size: 18px
  color: #252631
</style>
