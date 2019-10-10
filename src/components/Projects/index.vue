<template lang="pug">
  .cont
    a-row(:gutter="16", v-if='!isLoading&&project!=null')
      a-col(:span='15')
        TaskList(:tasks='tasks', v-if='tasks', :proj='true', @selectTask='openViewDrawer = true')
      a-col(:span='9')
        a-card(:title='project.name', :bodyStyle=' {maxHeight: "100%"} ')
          a-row
            a-col(:span='10' v-if='!isGuest')
              a-button(type='primary' @click='addTask') Добавить задачу
            a-col(:span='10' :offset='4' v-if='!isDisabled')
              a-button(type='danger' @click='deleteProject') Удалить проект
          a-row
            a-col
              .headline Админ
          a-row
            a-col
              a-select(:disabled='isDisabled' :defaultValue='project.members.filter(i=>i.role==="admin")[0].user.id')
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
              a-select(:filterOption='filterMember' :disabled='isDisabled' :defaultValue='getGuests' mode="multiple",@change="handleChangeGuests", @deselect='removeGuest', @select='addObserver', placeholder="Наблюдатели", style='width: 100%')
                a-select-option(v-for='user in getFilteredUsers' :value='user.id' :key='user.first_name + " " + user.last_name + " " + user.id')
                  .inner-opt
                    a-avatar.ava(:size='18', v-if='getAvatar(user)' :src='getAvatar(user)')
                    a-avatar.ava(:size='18',icon="user", v-else)
                    |{{getFullName(user)}}
          a-row
            a-col
              .headline Участники
          a-row
            a-col
              a-select(:filterOption='filterMember' :disabled='isDisabled' :defaultValue='getMembers',@change="handleChangeMembers", @select='addMember', @deselect='removeMember' mode="multiple", placeholder="Участники", style='width: 100%')
                a-select-option(v-for='user in getFilteredUsers' :value='user.id' :key='user.first_name + " " + user.last_name + " " + user.id')
                  .inner-opt
                    a-avatar.ava(:size='18', v-if='getAvatar(user)' :src='getAvatar(user)')
                    a-avatar.ava(:size='18',icon="user", v-else)
                    |{{getFullName(user)}}
    Loading(v-else)
    task-drawer(:open='openViewDrawer', @close='closeDrawer' v-if='!isLoading&&project!=null')
</template>
<script>
import axios from 'axios';
import AddTaskDrawer from './AddTaskDrawer.vue';
import TaskDrawer from './ViewTaskDrawer';
import TaskList from '../Tasks/TaskList.vue';
import Loading from '../Loading/index.vue';

export default {
  components: {
    AddTaskDrawer, TaskList, Loading, TaskDrawer,
  },
  data() {
    return {
      openDrawer: false,
      openViewDrawer: false,
      project: null,
      users: null,
      isLoading: false,
      projectMembers: null,
      selectedGuests: [],
      selectedMembers: [],
    };
  },
  computed: {
    isGuest() {
      if (this.user) {
        if (this.user.role == 'admin') return false;
        if (
          this.project
          && this.project.members
          && (
            (this.project.members.filter((i) => i.role === 'admin').length > 0 && this.project.members.filter((i) => i.role === 'admin')[0].user.id === this.user.id)
            || (this.project.members.filter((i) => i.role === 'regular').length > 0 && this.project.members.filter((i) => i.role === 'regular').map((u) => u.user.id).includes(this.user.id))
          )
        ) {
          return false;
        }
      }
      return true;
    },
    isDisabled() {
      if (this.user) {
        if (this.user.role == 'admin') return false;
        if (this.project && this.project.members && this.project.members.filter((i) => i.role === 'admin').length > 0 && this.project.members.filter((i) => i.role === 'admin')[0].user.id === this.user.id) {
          return false;
        }
      }
      return true;
    },
    user() {
      return this.$store.state.user;
    },
    tasks() {
      return this.$store.state.tasks;
    },
    getGuests() {
      if (this.project) {
        return this.project.members.filter((i) => i.role == 'guest').map((i) => i.user.id);
      }
      return [];
    },
    getMembers() {
      if (this.project) {
        return this.project.members.filter((i) => i.role != 'guest' && i.user.id != this.user.id).map((i) => i.user.id);
      }
      return [];
    },
    getFilteredUsers() {
      if (this.users) {
        return this.users.filter((item) => !this.selectedGuests.includes(item.id) && !this.selectedMembers.includes(item.id));
      }
      return [];
    },
  },
  methods: {
    deleteProject() {
      this.axios.delete(`/projects/${this.project.id}`).then(() => {
        this.$store.dispatch('getProjects');
        this.$router.push('/');
      });
    },
    filterMember(val, comp) {
      return comp.key.toLowerCase().includes(val.toLowerCase());
    },
    addTask() {
      this.$store.dispatch('addTask', this.$route.params.id);
      this.openViewDrawer = true;
    },
    closeDrawer() {
      this.openViewDrawer = false;
    },
    getAvatar(obj) {
      if (obj.avatar) {
        return `https://api.avcg.ru${obj.avatar}`;
      }
      return '';
    },
    getFullName(obj) {
      const name = obj.first_name;
      const surname = obj.last_name;
      const toTitleCase = (s) => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();
      if (name && surname) {
        return `${toTitleCase(name)} ${toTitleCase(surname)}`;
      } return obj.email;
    },
    handleChangeGuests(selectedGuests) {
      this.selectedGuests = selectedGuests;
    },
    handleSearch(value) {
      console.log(value);
    },
    handleChangeMembers(selectedMembers) {
      this.selectedMembers = selectedMembers;
    },
    addObserver(userId) {
      axios.post(`/projects/${this.$route.params.id}/members`, {
        member: {
          role: 'guest',
          user_id: userId,
        },
      });
    },
    addMember(userId) {
      axios.post(`/projects/${this.$route.params.id}/members`, {
        member: {
          role: 'regular',
          user_id: userId,
        },
      });
    },
    removeMember(userId) {
      axios.delete(`/projects/${this.$route.params.id}/members/${userId}`);
    },
    removeGuest(userId) {
      axios.delete(`/projects/${this.$route.params.id}/members/${userId}`);
    },
  },
  mounted() {
    axios.get('/users?limit=100').then((res) => {
      this.users = res.data.users;
    });
    this.isLoading = true;
    axios.get(`/projects/${this.$route.params.id}`).then((res) => {
      this.project = res.data.project;
      this.isLoading = false;
      this.projectMembers = res.data.project.members.map((i) => i.user.id);
    });
    this.$store.dispatch('getProjectTasks', this.$route.params.id);
  },
};
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
