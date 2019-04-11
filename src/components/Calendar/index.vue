<template lang="pug">
.tasks 
  .calendar
    .select
      a-button(@click='subMonth')
        a-icon(type='left')
      a-select.select-month(:value='monthsTranslate[getMonth - 1]', @change='changeMonth')
        a-select-option(v-for='month, index in monthsTranslate', :value='index') {{month}}
      a-select.select-year(:value='getYear')
        a-select-option(value='2018') 2018
        a-select-option(value='2019') 2019
      a-button(@click='addMonth')
        a-icon(type='right')
    .days
      a-badge(v-for='day in getDays' :count='getCalendar[day] ? getCalendar[day].length : 0', :offset='[-16, 35]')
        span.day(:class='{ "active" : getDay===day, "disabled" : !getCalendar[day] }' @click='changeDay(day)') {{day}}
    task-list(v-if='getCalendar', :tasks='getCalendar[fDay(date)]')
    .loading(v-else)
      a-icon(type='loading')
</template>
<script>
/* eslint-disable */
import TaskList from '@/components/Tasks/TaskList'
import {
  format,
  eachDay,
  setMonth,
  setYear,
  setDate,
  addMonths,
  subMonths
} from 'date-fns'

export default {
  components: { TaskList },
  methods: {
    fDay: function (date) {
      return format(date, 'D')
    },
    updateCalendar: function () {
      const payload = {
        year: format(this.date, 'YYYY'),
        month: format(this.date, 'M')
      }
      this.$store.dispatch('getCalendar', payload)
    },
    subMonth: function () {
      this.date = subMonths(this.date, 1)
      this.updateCalendar()
    },
    addMonth: function () {
      this.date = addMonths(this.date, 1)
      this.updateCalendar()
    },
    changeMonth: function (index) {
      this.date = setMonth(this.date, index)
      this.updateCalendar()
    },
    changeYear: function (val) {
      this.date = setYear(this.date, val)
      this.updateCalendar()
    },
    changeDay: function (val) {
      this.date = setDate(this.date, val)
    },
  },
  computed: {
    getCalendar: function () {
      return this.$store.state.calendar
    },
    getDays: function () {
      let month = eachDay(
        format(this.date, 'YYYY-MM'),
        addMonths(format(this.date, 'YYYY-MM'), 1)
      ).map(item=>format(item,'D'))
      month.pop()
      return month
    },
    getMonth: function () {
      return format(this.date,'M')
    },
    getYear: function () {
      return format(this.date, 'YYYY')
    },
    getDay: function () {
      return format(this.date, 'D')
    }
  },
  mounted() {
    this.updateCalendar()
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
.calendar
  height: 100%
  display: flex
  flex-direction: column
  .loading
    flex: 1
    display: flex
    align-items: center
    justify-content: center
    font-size: 88px
.tasks
  height: 100%
  .calendar
    .select
      display: flex
      width: fit-content
      margin: 0 auto
      margin-bottom: 5px
      &-month
        margin: 0 7px
        width: 100px
      &-year
        margin-right: 7px
        width: 100px
    .days
      width: fit-content
      margin: 0 auto
      display: flex
      margin-bottom: 20px
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
      .disabled
        color: #7C8DA1
        &:hover
          color: #7C8DA1
          background-color: transparent
          cursor: not-allowed
      .active
        color: #fff
        background-color: $primary-color
        &:hover
          color: #fff
          background-color: $primary-color
</style>

