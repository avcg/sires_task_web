<template lang="pug">
.tasks 
  .calendar
    .select
      s-menu
        .month {{getMonth}}
        template(v-slot:menu='')
          s-list
            s-list-item( v-for='month, index in monthsTranslate', @click='changeMonth(index)') {{month}}
      s-menu
        .year {{getYear}}
        template(v-slot:menu='')
          s-list
            s-list-item(@click='changeYear(2019)') 2019
            s-list-item(@click='changeYear(2018)') 2018
    .days
      span.day(:class='{ "active" : getDay===day }' v-for='day in getDays' @click='changeDay(day)') {{day}}
  task-body(:sortDate='date')
</template>
<script>
/* eslint-disable */
import format from 'date-fns/format'
import TaskBody from '@/components/Tasks/TaskBody'
import eachDay from 'date-fns/each_day'
import setMonth from 'date-fns/set_month'
import setYear from 'date-fns/set_year'
import setDate from 'date-fns/set_date'
import addMonths from 'date-fns/add_months'

export default {
  components: { TaskBody },
  methods: {
    changeMonth: function (index) {
      this.date = setMonth(this.date, index)
    },
    changeYear: function (val) {
      this.date = setYear(this.date, val)
    },
    changeDay: function (val) {
      this.date = setDate(this.date, val)
    },
  },
  computed: {
    getDays: function () {
      let month = eachDay(
        format(this.date, 'YYYY-MM'),
        addMonths(format(this.date, 'YYYY-MM'), 1)
      ).map(item=>format(item,'D'))
      month.pop()
      return month
    },
    getMonth: function () {
      return format(this.date,'MMMM')
    },
    getYear: function () {
      return format(this.date, 'YYYY')
    },
    getDay: function () {
      return format(this.date, 'D')
    }
  },
  data () {
    return {
      date: new Date(),
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
        &:hover
          color: #fff
          background-color: $primary-color
</style>

