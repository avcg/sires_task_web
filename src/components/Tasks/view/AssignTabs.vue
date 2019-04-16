<template lang="pug">
//-resposible
//-coressponsible
//-observer
//- assignor
a-tabs.tabs(defaultactivekey='1')
  a-tab-pane.tab(tab='Ответственный', key='1')
    a-select.select(:defaultValue='responsible', @change='changeResponsible')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
  a-tab-pane.tab(tab='Соисполнители', key='2')
    a-select.select(:defaultValue='coresponsibles', mode="multiple", @change='changeCoresponsibles')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
  a-tab-pane.tab(tab='Наблюдатели', key='3')
    a-select.select(:defaultValue='observers', mode="multiple", @change='changeObservers')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
  a-tab-pane.tab(tab='Постановщик ', key='4')
    a-select.select(:defaultValue='assignor', @change='changeAssignor')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
</template>

<script>
export default {
  props: ['users', 'assignor', 'coresponsibles', 'observers', 'responsible'],
  methods: {
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

<style lang="sass" scoped>
.tabs
  margin-bottom: 15px
  .tab
    .select
      width: 100%
</style>
