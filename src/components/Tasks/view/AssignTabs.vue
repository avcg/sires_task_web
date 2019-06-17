<template lang="pug">
//-resposible
//-coressponsible
//-observer
//- assignor
a-tabs.tabs(defaultactivekey='1')
  a-tab-pane.tab(tab='Ответственный', key='1')
    a-select.select(size='large' :defaultValue='responsible', @change='changeResponsible')
      a-select-option(v-for='user in users', :value='user.user.id') 
        .inner-opt
          a-avatar.ava(:size='32', v-if='getAvatar(user.user)' :src='getAvatar(user.user)')
          a-avatar.ava(icon="user", v-else)
          |{{getFullName(user.user)}}
  a-tab-pane.tab(tab='Соисполнители', key='2')
    a-select.select(size='large' :defaultValue='coresponsibles', mode="multiple", @change='changeCoresponsibles')
      a-select-option(v-for='user in users', :value='user.user.id') 
        .inner-opt
          a-avatar.ava(:size='32', v-if='getAvatar(user.user)' :src='getAvatar(user.user)')
          a-avatar.ava(icon="user", v-else)
          |{{getFullName(user.user)}}
  a-tab-pane.tab(tab='Наблюдатели', key='3')
    a-select.select(size='large' :defaultValue='observers', mode="multiple", @change='changeObservers')
      a-select-option(v-for='user in users', :value='user.user.id') 
        .inner-opt
          a-avatar.ava(:size='32', v-if='getAvatar(user.user)' :src='getAvatar(user.user)')
          a-avatar.ava(icon="user", v-else)
          |{{getFullName(user.user)}}
  a-tab-pane.tab(tab='Постановщик ', key='4')
    a-select.select(size='large' :defaultValue='assignor', @change='changeAssignor')
      a-select-option(v-for='user in users', :value='user.user.id') 
        .inner-opt
          a-avatar.ava(:size='32', v-if='getAvatar(user.user)' :src='getAvatar(user.user)')
          a-avatar.ava(icon="user", v-else)
          |{{getFullName(user.user)}}
</template>

<script>
export default {
  props: ['users', 'assignor', 'coresponsibles', 'observers', 'responsible'],
  methods: {
    getAvatar: function (obj) {
      return "https://api.avcg.ru" + obj.avatar
    },
    getFullName: function (obj) {
      let name = obj.first_name
      let surname = obj.last_name
      const toTitleCase = s => s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase()
      if(name&&surname){
        return toTitleCase(obj.name) + " " + toTitleCase(obj.surname)
      }else return obj.email
    },
    changeResponsible: function (id) {
      this.$emit('responsible', id)
    },
    changeCoresponsibles: function (ids) {
      this.$emit('coresposibles', ids)
    },
    changeObservers: function (ids) {
      this.$emit('observers', ids)
    },
    changeAssignor: function (id) {
      this.$emit('assignor', id)
    }
  },
  mounted() {

  }
}
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
