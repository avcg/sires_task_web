<template lang="pug">
  .headline
    .filters
      .filter
        i.la.icon 
        span.name СОРТИРОВКА:
        .select
          span А-Я
          i.la.icon 
      //- .filter
      //-   i.la.icon 
      //-   span.name ПРОЕКТ:
      //-   .select
      //-     span Планировка ТЦ
      //-     i.la.icon 
    .spacer
    .add(@click='addTask')
      i.la.icon 
      span НОВАЯ ЗАДАЧА
</template>
<script>
export default {
  methods: {
    addTask () {
      this.$store.commit('addTask')
    }
  }
}
</script>

<style lang="sass" scoped>
.headline
  display: flex
  .add
    display: flex
    align-items: center
    user-select: none
    color: $primary-color
    font-size: 12px
    i
      color: $primary-color
      font-size: 18px
    &:hover
      cursor: pointer
    span
      margin-left: 5px
      font-weight: 500
  .filters
    display: flex
    align-items: center
    .filter
      display: flex
      align-items: center
      font-size: 12px
      font-weight: 500
      margin-right: 23px
      i
        font-size: 18px
      .name
        color: #778ca2
        margin-left: 6px
      .select
        display: flex
        margin-left: 15px
        align-items: center
        &:hover
          cursor: pointer
        i
          margin-left: 12px
          transform: translateY(-1px)
          font-size: 16px
</style>
