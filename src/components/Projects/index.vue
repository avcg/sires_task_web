<template lang="pug">
  .cont
    a-row(:gutter="16", v-if='project')
      a-col(:span='15')
        TaskList(:tasks='tasks', v-if='tasks')
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
                a-select-option(v-for='member in project.members' :value='member.user.id') {{member.user.email}}
          a-row
            a-col
              .headline Наблюдатели
          a-row
            a-col
              a-select(mode="multiple",@change="handleChangeGuests", @select='addObserver', placeholder="Наблюдатели", style='width: 100%')
                a-select-option(v-for='user in getFilteredUsers' :value='user.id') {{user.email}}
          a-row
            a-col
              .headline Участники
          a-row
            a-col
              a-select(:defaultValue='projectMembers',@change="handleChangeMembers", @select='addMember', @deselect='removeMember' mode="multiple", placeholder="Участники", style='width: 100%')
                a-select-option(v-for='user in getFilteredUsers' :value='user.id') {{user.email}}
    Loading(v-else)
    add-task-drawer(:open='openDrawer', @close='openDrawer = false')
</template>
<script>
import AddTaskDrawer from './AddTaskDrawer.vue'
import TaskList from '../Tasks/TaskList.vue'
import Loading from '../Loading/index.vue'
import axios from 'axios'

export default {
  components: { AddTaskDrawer, TaskList, Loading },
  data() {
    return {
      openDrawer: false,
      project: null,
      users: null,
      tasks: null,
      projectMembers: null,
      selectedGuests: [],
      selectedMembers: []
    }
  },
  computed: {
    getFilteredUsers: function () {
      return this.users.filter(item => !this.selectedGuests.includes(item.id)&&!this.selectedMembers.includes(item.id))
    }
  },
  methods: {
    handleChangeGuests: function (selectedGuests) {
      this.selectedGuests = selectedGuests
    },
    handleChangeMembers: function (selectedMembers) {
      this.selectedMembers = selectedMembers
    },
    addObserver: function (userId) {
      axios.post('/projects/' + this.$route.params.id + '/members', {
        member: {
          role: 'guest',
          user_id: userId
        }
      })
    },
    addMember: function (userId) {
      axios.post('/projects/' + this.$route.params.id + '/members', {
        member: {
          role: 'regular',
          user_id: userId
        }
      })
    },
    removeMember: function (userId) {
      axios.delete('/projects/' + this.$route.params.id + '/members/' + userId)
    }
  },
  mounted() {
    axios.get('/users').then(res => {
      this.users = res.data.users
    })
    axios.get('/projects/' + this.$route.params.id).then(res => {
      this.project = res.data.project
      this.projectMembers = res.data.project.members.map(i => i.user.id)
    })
    axios.get('/tasks?project_id=' + this.$route.params.id).then(res => {
      this.tasks = res.data.tasks
    })
  }
}
</script>
<style lang="sass" scoped>
.cont
  height: 100%
.headline
  margin: 10px 0
  font-size: 18px
  color: #252631
</style>
