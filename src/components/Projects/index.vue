<template lang="pug">
  .cont
    a-row(:gutter="16", v-if='!isLoading&&project!=null')
      a-col(:span='15')
        TaskList(:tasks='tasks', v-if='tasks', :proj='true', @selectTask='openViewDrawer = true')
      a-col(:span='9')
        a-card(:title='project.name', :bodyStyle=' {maxHeight: "100%"} ')
          a-row
            a-col(:span='10' :offset='14')
              a-button(type='primary' @click='addTask') Добавить задачу
          a-row
            a-col
              .headline Админ
          a-row
            a-col
              a-select(:defaultValue='project.members.filter(i=>i.role==="admin")[0].user.id')
                a-select-option(v-for='member in project.members' :value='member.user.id') 
                  .inner-opt
                    a-avatar.ava(:size='24', v-if='getAvatar(member.user)' :src='getAvatar(member.user)')
                    a-avatar.ava(:size='24', icon="user", v-else)
                    |{{getFullName(member.user)}}
          a-row
            a-col
              .headline Наблюдатели
          a-row
            a-col
              a-select(:defaultValue='getGuests' mode="multiple",@change="handleChangeGuests", @select='addObserver', placeholder="Наблюдатели", style='width: 100%')
                a-select-option(v-for='user in getFilteredUsers' :value='user.id')
                  .inner-opt
                    a-avatar.ava(:size='18', v-if='getAvatar(user)' :src='getAvatar(user)')
                    a-avatar.ava(:size='18',icon="user", v-else)
                    |{{getFullName(user)}}
          a-row
            a-col
              .headline Участники
          a-row
            a-col
              a-select(:defaultValue='getMembers',@change="handleChangeMembers", @select='addMember', @deselect='removeMember' mode="multiple", placeholder="Участники", style='width: 100%')
                a-select-option(v-for='user in getFilteredUsers' :value='user.id')
                  .inner-opt
                    a-avatar.ava(:size='18', v-if='getAvatar(user)' :src='getAvatar(user)')
                    a-avatar.ava(:size='18',icon="user", v-else)
                    |{{getFullName(user)}}
    Loading(v-else)
    task-drawer(:open='openViewDrawer', @close='closeDrawer' v-if='!isLoading&&project!=null')
</template>
<script>
import AddTaskDrawer from './AddTaskDrawer.vue'
import TaskDrawer from './ViewTaskDrawer'
import TaskList from '../Tasks/TaskList.vue'
import Loading from '../Loading/index.vue'
import axios from 'axios'

export default {
  components: { AddTaskDrawer, TaskList, Loading, TaskDrawer },
  data() {
    return {
      openDrawer: false,
      openViewDrawer: false,
      project: null,
      users: null,
      isLoading: false,
      projectMembers: null,
      selectedGuests: [],
      selectedMembers: []
    }
  },
  computed: {
    tasks(){
      return this.$store.state.tasks
    },
    getGuests: function () {
      if(this.project){
        return this.project.members.filter(i => i.role == "guest").map(i => i.user.id)
      }else {
        return []
      }
    },
    getMembers: function () {
      if(this.project){
        return this.project.members.filter(i => i.role != "guest").map(i => i.user.id)
      }else {
        return []
      }
    },
    getFilteredUsers: function () {
      if(this.users){
        return this.users.filter(item => !this.selectedGuests.includes(item.id)&&!this.selectedMembers.includes(item.id))
      }else {
        return []
      }
      
    }
  },
  methods: {
    addTask: function (){
      this.$store.dispatch('addTask', this.$route.params.id )
      this.openViewDrawer = true
    },
    closeDrawer(){
      this.openViewDrawer = false
    },
    getAvatar: function (obj) {
      if(obj.avatar){
        return "https://api.avcg.ru" + obj.avatar
      }else {
        return ''
      }
      
    },
    getFullName: function (obj) {
      let name = obj.first_name
      let surname = obj.last_name
      const toTitleCase = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase()
      if(name&&surname){
        return toTitleCase(name) + " " + toTitleCase(surname)
      }else return obj.email
    },
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
    axios.get('/users?limit=100').then(res => {
      this.users = res.data.users
    })
    this.isLoading = true
    axios.get('/projects/' + this.$route.params.id).then(res => {
      this.project = res.data.project
      this.isLoading = false
      this.projectMembers = res.data.project.members.map(i => i.user.id)
    })
    this.$store.dispatch('getProjectTasks', this.$route.params.id)
    
  }
}
</script>
<style lang="sass" scoped>
.inner-opt
  display: flex
  align-items: center
  height: 100%
  .ava
    margin-right: 10px
.cont
  height: 100%
.headline
  margin: 10px 0
  font-size: 18px
  color: #252631
</style>
