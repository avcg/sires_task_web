<template lang="pug">
.tasks 
  .calendar
    .select
      s-menu
        .month Апрель
        template(v-slot:menu='')
          s-list
            s-list-item(v-for='month in monthsTranslate') {{month}}
      s-menu
        .year 2019
        template(v-slot:menu='')
          s-list
            s-list-item 2019
            s-list-item 2018
    .days
      span.day(v-for='day in getDays') {{day}}
  task-body
</template>
<script>
/* eslint-disable */
import format from 'date-fns/format'
import TaskBody from '@/components/Tasks/TaskBody'
import eachDay from 'date-fns/each_day'

export default {
  components: { TaskBody },
  computed: {
    getDays: function() {
      return eachDay(
        new Date(2019, 3, 1),
        new Date(2019, 4, 0)
      ).map(item=>format(item,'D'))
    },
  },
  data () {
    return {
      date: '2019-01-01',
      weekdaysTranslate: [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'
      ],
      monthsTranslate: [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ]
    }
  }
}
</script>
<style lang="sass" scoped>
.picker
  max-width: 280px
.tasks
  height: 100%
  .calendar
    .select
      display: flex
      width: fit-content
      margin: 0 auto
      margin-bottom: 5px
      .month
        margin-right: 7px
        width: 100px
      .year
        margin-left: 7px
        width: 100px
    .days
      width: fit-content
      margin: 0 auto
      display: flex
      .day
        margin: 0 2px
        width: 29px
        height: 29px
        display: flex
        align-items: center
        justify-content: center
        border-radius: 50%
        transition: all .3s
        &:hover
          color: #fff
          background-color: #99b4fe
          cursor: pointer
        .active
          color: #fff
          background-color: $primary-color
</style>

