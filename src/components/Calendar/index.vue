<template lang="pug">
.tasks
  task-header(:proj='true' @sortByUser='sortByUser' @sort="changeSort")
  .calendar
    .select
      a-button(@click="subMonth")
        a-icon(type="left")
      a-select.select-month(:value="monthsTranslate[getMonth - 1]" @change="changeMonth")
        a-select-option(v-for="(month, i) in monthsTranslate" :key="`month${i}`"
                        :value="i") {{ month }}
      a-select.select-year(:value="getYear" @change="changeYear")
        a-select-option(value="2018") 2018
        a-select-option(value="2019") 2019
        a-select-option(value="2020") 2020
        a-select-option(value="2021") 2021
        a-select-option(value="2022") 2022
        a-select-option(value="2023") 2023
      a-button(@click="addMonth")
        a-icon(type="right")
    .days
      a-badge(v-for="(day, i) in getDays" :key="`day${i}`"
              :count="getCalendar[day] ? getCalendar[day].length : 0" :offset="[-16, 35]")
        span.day(:class="{ 'active' : getDay === day, 'disabled' : !getCalendar[day] }"
                @click="changeDay(day)") {{ day }}
    task-drawer(:open="openViewDrawer" @close="openViewDrawer = false")
    task-list(v-if="getCalendar" :tasks="tasksByUserRole" :proj="true" @selectTask="openViewDrawer = true")
    .loading(v-else)
      a-icon(type="loading")
</template>

<script>
import {
  format,
  eachDay,
  setMonth,
  setYear,
  setDate,
  addMonths,
  subMonths,
} from 'date-fns';
import TaskDrawer from '@/components/Projects/ViewTaskDrawer.vue';
import TaskList from '@/components/Tasks/TaskList';
import TaskHeader from '@/components/Tasks/TaskHeader';

export default {
  components: { TaskList, TaskDrawer, TaskHeader },
  methods: {
    changeSort(val) {
      this.sortBy = val;
    },
    isMember(members, id) {
      return members.map((m) => m.user.id).includes(id);
    },
    isMemberWithRole(members, id, role) {
      let isTrue = false;
      members.forEach((m) => {
        if (m.user.id == id && m.role == role) isTrue = true;
      });
      return isTrue;
    },
    sortByUser(filters) {
      if (filters.length < 2) {
        this.sortUser = 'all';
        this.sortRole = null;
      }
      this.sortUser = filters[0];
      this.sortRole = filters[1];
    },
    fDay(date) {
      return format(date, 'D');
    },
    updateCalendar() {
      const payload = {
        year: format(this.date, 'YYYY'),
        month: format(this.date, 'M'),
      };
      this.$store.dispatch('getCalendar', payload);
      this.$store.dispatch('getDateTasks', this.date);
    },
    subMonth() {
      this.date = subMonths(this.date, 1);
      this.updateCalendar();
    },
    addMonth() {
      this.date = addMonths(this.date, 1);
      this.updateCalendar();
    },
    changeMonth(index) {
      this.date = setMonth(this.date, index);
      this.updateCalendar();
    },
    changeYear(val) {
      this.date = setYear(this.date, val);
      this.updateCalendar();
    },
    changeDay(val) {
      this.date = setDate(this.date, val);
      this.$store.dispatch('getDateTasks', this.date);
    },
  },
  computed: {
    getTasks() {
      const { tasks } = this;
      switch (this.sortBy.type) {
        case 'date':
          if (this.sortBy.desc) {
            tasks.sort((a, b) => new Date(b.finish_time) - new Date(a.finish_time));
          } else {
            tasks.sort((a, b) => new Date(a.finish_time) - new Date(b.finish_time));
          }
          break;
        case 'alphabet':
          if (this.sortBy.desc) {
            tasks.sort((a, b) => {
              if (b.name < a.name) {
                return -1;
              }
              if (b.name > a.name) {
                return 1;
              }
              return 0;
            });
          } else {
            tasks.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
          }
          break;
        default:
      }
      return tasks;
    },
    tasksByUserRole() {
      const { sortUser, sortRole } = this;
      const tasks = this.getTasks;
      if (sortUser == 'all') {
        return tasks;
      }
      if (!sortRole && !sortUser) {
        return tasks;
      }
      if (!sortRole && sortUser) {
        return tasks.filter((t) => this.isMember(t.members, sortUser));
      }
      if (sortUser && sortRole) {
        if (sortRole == 'all') {
          return tasks.filter((t) => this.isMember(t.members, sortUser, sortRole));
        }
        return tasks.filter((t) => this.isMemberWithRole(t.members, sortUser, sortRole));
      }
      return tasks;
    },
    getCalendar() {
      return this.$store.state.calendar;
    },
    tasks() {
      return this.$store.state.tasks;
    },
    getDays() {
      const month = eachDay(
        format(this.date, 'YYYY-MM'),
        addMonths(format(this.date, 'YYYY-MM'), 1),
      ).map((item) => format(item, 'D'));
      month.pop();
      return month;
    },
    getYear() {
      return format(this.date, 'YYYY');
    },
    getMonth() {
      return format(this.date, 'M');
    },
    getDay() {
      return format(this.date, 'D');
    },
  },
  mounted() {
    this.updateCalendar();
    this.sortUser = this.$store.state.user.id;
    this.sortRole = 'all';
  },
  data() {
    return {
      openViewDrawer: false,
      date: new Date(),
      sortBy: {
        name: 'По убыванию дедлайна',
        type: 'date',
        desc: true,
      },
      sortUser: null,
      sortRole: null,
      weekdaysTranslate: [
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс',
      ],
      monthsTranslate: [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
      ],
    };
  },
};
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
