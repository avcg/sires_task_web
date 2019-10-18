<template lang="pug">
//- resposible
//- coresponsibles
//- observers
//- assignor
a-tabs.tabs(defaultActiveKey="1")
  a-tab-pane.tab(tab="Ответственный" key="1")
    a-select.select(size="large" :defaultValue="responsible"
                    @change="changeResponsible" :disabled="!isAssignor")
      a-select-option(v-for="user in filteredUsers" :key="user.user.id"
                      :value="user.user.id")
        .inner-opt
          a-avatar.ava(v-if="getAvatar(user.user)" :size="32" :src="getAvatar(user.user)")
          a-avatar.ava(v-else icon="user")
          |{{ getFullName(user.user) }}
  a-tab-pane.tab(tab="Соисполнители" key="2")
    a-select.select(mode="multiple" size="large"
                    :disabled="!isAssignor" :defaultValue="coresponsibles"
                    @change="changeCoresponsibles")
      a-select-option(v-for="user in filteredUsers" :key="user.user.id"
                      :value="user.user.id")
        .inner-opt
          a-avatar.ava(v-if="getAvatar(user.user)" :size="32" :src="getAvatar(user.user)")
          a-avatar.ava(v-else icon="user")
          |{{ getFullName(user.user) }}
  a-tab-pane.tab(tab="Наблюдатели" key="3")
    a-select.select(mode="multiple" size="large"
                    :disabled="!isAssignor" :defaultValue="observers"
                    @change="changeObservers")
      a-select-option(v-for="user in filteredUsers" :key="user.user.id"
                      :value="user.user.id")
        .inner-opt
          a-avatar.ava(v-if="getAvatar(user.user)" :size="32" :src="getAvatar(user.user)")
          a-avatar.ava(v-else icon="user")
          |{{ getFullName(user.user) }}
  a-tab-pane.tab(tab="Постановщик " key="4")
    a-select.select(size="large" :disabled="!isAssignor"
                    :defaultValue="assignor" @change="changeAssignor")
      a-select-option(v-for="user in filteredUsers" :key="user.user.id"
                      :value="user.user.id")
        .inner-opt
          a-avatar.ava(v-if="getAvatar(user.user)" :size="32" :src="getAvatar(user.user)")
          a-avatar.ava(v-else icon="user")
          |{{ getFullName(user.user) }}
</template>

<script>
export default {
  props: ['users', 'assignor', 'coresponsibles', 'observers', 'responsible'],
  computed: {
    isAssignor() {
      if (this.users && this.users.filter((u) => u.role === 'admin').length > 0 && this.users.filter((u) => u.role === 'admin')[0].user.id === this.$store.state.user.id) return true;
      if (this.$store.state.role === 'admin') return true;
      if (this.assignor && this.assignor[0] === this.$store.state.user.id) return true;
      return false;
    },
    filteredUsers() {
      return this.users;
    },
  },
  methods: {
    getAvatar(obj) {
      return `https://api.avcg.ru${obj.avatar}`;
    },
    getFullName(obj) {
      const name = obj.first_name;
      const surname = obj.last_name;
      const toTitleCase = (s) => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();
      if (name && surname) {
        return `${toTitleCase(name)} ${toTitleCase(surname)}`;
      } return obj.email;
    },
    changeResponsible(id) {
      this.$emit('changeAssign', 'responsible', id);
    },
    changeCoresponsibles(ids) {
      this.$emit('changeAssign', 'co-responsible', ids);
    },
    changeObservers(ids) {
      this.$emit('changeAssign', 'observer', ids);
    },
    changeAssignor(id) {
      this.$emit('changeAssign', 'assignator', id);
    },
  },
  mounted() {

  },
};
</script>

<style lang="sass">
.inner-opt
  display: flex
  align-items: center
</style>

<style lang="sass" scoped>
.ava
  margin-right: 10px
.tabs
  margin-bottom: 15px
  .tab
    .select
      width: 100%
</style>
