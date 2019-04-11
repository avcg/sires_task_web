<template lang="pug">
//-resposible
//-coressponsible
//-observer
//- assignor
a-tabs.tabs(defaultactivekey='1')
  a-tab-pane.tab(tab='Ответственный', key='1')
    a-select.select(:defaultValue='resposible')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
  a-tab-pane.tab(tab='Соисполнители', key='2', mode="multiple")
    a-select.select(:defaultValue='coresponsibles')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
  a-tab-pane.tab(tab='Наблюдатели', key='3', mode="multiple")
    a-select.select(:defaultValue='observers')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
  a-tab-pane.tab(tab='Постановщик ', key='4')
    a-select.select(:defaultValue='assignor')
      a-select-option(v-for='user in users', :value='user.user.id') {{user.user.email}}
</template>

<script>
export default {
  props: ['users', 'assignor', 'coresponsibles', 'observers', 'responsible'],
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
