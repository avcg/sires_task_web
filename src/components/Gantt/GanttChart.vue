<template lang="pug">
div
  task-header(:proj='true' @sortByUser='sortByUser' @sort="changeSort")
  .cont
    .side
      .select-proj
        a-select(:defaultValue="inboxId" style="flex: 1; margin-right: 10px; max-width: 150px"
                @change="projectChange")
          a-select-option(v-for="proj in projects" :key="proj.id") {{ proj.name }}
        a-tooltip(title="Экспорт в Excel")
          a-button(@click="exportExcel" type="primary" :disabled="tasks.length == 0")
            a-icon(type="export")
      .tasks-tree
        task-drawer(:open="openViewDrawer" @close="closeDrawer")
        .tasks-tree-task(v-for="task in tasksByUserRole" :key="task.id" @click="openTask(task.id)")
          span(v-if="task.name.length<30") {{ task.name }}
          span(v-else) {{ task.name.substring(0,30)+".." }}
          //- a-tag.ml-10(v-if='getRole(task)') {{getRole(task)}}
    .gantt(ref="ganttCont")
      .ganttBody#ganttBody(:style="{ width: `${ganttWidth}px` }")
        .head
          .month(v-for="(month, i) in getGanttMonths" :key="`month${i}`")
            .month-name {{ fMonth(month.start) }}
            .dates
              .date(v-for="(day, j) in month.days" :key="`month${i}-day${j}`" :class="{ 'today' : isToday(day)}") {{ fDay(day) }}
        .body
          .task(v-for="(bar, i) in getGanttItems" :key="`bar${i}`")
            a-tooltip(placement="top" :title="bar.name")
              .bar(:style="{ width: `${bar.width}px`, marginLeft: `${bar.margin}px` }")
              //- template(slot="content")
                div
                  a-avatar A
</template>

<script>
import { uniqBy } from 'lodash';
import ExcelJS from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
import {
  min,
  max,
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  isWithinRange,
  differenceInMonths,
  getDaysInMonth,
  eachDay,
  differenceInCalendarDays,
  isToday,
} from 'date-fns';
import TaskDrawer from '../Projects/ViewTaskDrawer';
import TaskHeader from '@/components/Tasks/TaskHeader';

const ruLocale = require('date-fns/locale/ru');

const dayWidth = 35;

export default {
  props: ['tasks', 'projects'],
  components: {
    TaskDrawer,
    TaskHeader,
  },
  data() {
    return {
      expandProj: [],
      proj: this.inboxId,
      openViewDrawer: false,
      sortBy: {
        name: 'По убыванию дедлайна',
        type: 'date',
        desc: true,
      },
      sortUser: null,
      sortRole: null,
    };
  },
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
    async exportExcel() {
      let id = this.inboxId;
      if (this.proj) id = this.proj;
      const proj = this.projects.filter((p) => p.id === id)[0];

      const wb = new ExcelJS.Workbook();

      const ws = wb.addWorksheet();
      const headline = [];
      const days = [];

      this.getGanttMonths.forEach((m, mI) => {
        if (mI === 0) {
          end = 2;
        }
        m.days.forEach((d, i) => {
          if (i === 0) {
            headline.push(this.fMonth(m.start));
          } else {
            headline.push('');
          }
          days.push(parseInt(this.fDay(d)));
        });
      });
      ws.getColumn(2).width = 20;
      ws.addRow([]);
      ws.addRow(['', proj.name, ...headline]);
      ws.addRow(['', '', ...days]);
      let end;
      this.getGanttMonths.forEach((m, mI) => {
        if (mI === 0) {
          end = 3;
        }
        ws.mergeCells(2, end, 2, end + (m.days.length - 1));
        ws.getCell(2, end).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
        end += m.days.length;
      });

      this.tasks.forEach((t, tI) => {
        const taskRow = ['', t.name];
        this.getGanttMonths.forEach((m, mI) => {
          m.days.forEach((d, i) => {
            days.push('');
          });
        });
        ws.addRow(taskRow);
      });
      ws.views = [
        {
          state: 'frozen',
          xSplit: 2,
          Split: 3,
          topLeftCell: 'C4',
          activeCell: 'A1',
        },
      ];
      this.tasks.forEach((t, tI) => {
        ws.getCell(tI + 3, 3).alignment = { wrapText: true };
        this.getGanttMonths.forEach((m, mI) => {
          if (mI === 0) {
            end = 3;
          }
          m.days.forEach((d, i) => {
            const col = ws.getColumn(end + i);
            col.width = 4;
            if (isWithinRange(d, t.start_time, t.finish_time)) {
              ws.getCell(4 + tI, end + i).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4090F7' },
              };
            }
          });
          end += m.days.length;
        });
      });
      const buf = await wb.xlsx.writeBuffer();

      saveAs(new Blob([buf]), `Сетевой_график_${proj.name}_${format(new Date(), 'ss:mm:HH_D.M.YYYY')}.xlsx`);
    },
    openTask(id) {
      this.$store.dispatch('showTask', id);
      this.openViewDrawer = true;
    },
    closeDrawer() {
      this.openViewDrawer = false;
    },
    isToday(date) {
      return isToday(date);
    },
    projectChange(id) {
      this.proj = id;
      this.$store.dispatch('getProjectTasks', id);
    },
    fMonth(date) {
      return format(date, 'MMMM', { locale: ruLocale });
    },
    fDay(date) {
      return format(date, 'D');
    },
    redrawGantt() {
      const gantt = new Gantt('#gantt', this.getGanttItems, {
        bar_height: 17,
        language: 'ru',
      });
    },
    expand(expandedKeys) {
      this.expandProj = expandedKeys;
      this.redrawGantt();
    },
    getRole(task) {
      let member = task.members.filter((m) => m.user.id === this.$store.state.user.id);
      if (member.length === 0) return '';
      member = member[0];
      switch (member.role) {
        case 'assignator':
          return 'Постановщик';
        case 'observer':
          return 'Наблюдатель';
        case 'responsible':
          return 'Ответсвенный';
        case 'co-responsible':
          return 'Соисполнитель';
        default:
          return '';
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.ganttCont.scrollLeft = (
        differenceInCalendarDays(new Date(), this.getGanttMonths[0].start) - 10) * dayWidth;
      this.sortUser = this.$store.state.user.id;
      this.sortRole = 'all';
    },
    200);
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
    inboxId() {
      return this.$store.state.user.inbox_project_id;
    },
    getGanttMonths() {
      const tasks = this.tasksByUserRole;
      const minDate = startOfMonth(min(...tasks.map((d) => d.start_time)));
      const maxDate = endOfMonth(max(...tasks.map((d) => d.finish_time)));
      const months = [];
      let tempMonth = minDate;
      while (differenceInMonths(maxDate, tempMonth) >= 0) {
        months.push({
          start: tempMonth,
          width: getDaysInMonth(tempMonth) * dayWidth,
          days: [],
        });
        tempMonth = addMonths(tempMonth, 1);
      }
      months.splice(-1, 1);
      months.map((month) => {
        const monthEndDay = endOfMonth(month.start);
        month.days = eachDay(month.start, monthEndDay);
      });
      return months;
    },
    ganttWidth() {
      return this.getGanttMonths.reduce((acc, item) => acc += item.width, 0);
    },
    getTasks() {
      return this.$store.state.tasks.map((item) => item);
    },
    getTree() {
      let tree = [];
      tree = this.$store.state.tasks.map((item) => ({
        title: item.project.name,
        key: item.project.name,
        children: [],
        class: 'gantt-node',
      }));
      tree = uniqBy(tree, 'key');
      this.$store.state.tasks.map((item) => {
        const projInd = tree.map((d) => d.key).indexOf(item.project.name);
        item.title = item.name;
        tree[projInd].children.push(item);
      });
      return tree;
    },
    getProjects() {
      return this.$store.getters.getProjectsAll;
    },
    getProjTree() {
      const list = {};
      this.$store.state.tasks.map((item) => {
        if (!list[item.project.name]) list[item.project.name] = [];
        item.title = item.name;
        item.class = 'gantt-node';
        list[item.project.name].push(item);
      });
      return list;
    },
    getGanttItems() {
      const tasks = [];
      this.tasksByUserRole.map((task) => {
        task.start = task.start_time;
        task.end = task.finish_time;
        task.margin = differenceInCalendarDays(task.start, this.getGanttMonths[0].start) * dayWidth;
        task.width = differenceInCalendarDays(task.end, task.start) * dayWidth + dayWidth;
        task.type = 'task';
        tasks.push(task);
      });
      return tasks;
    },
    // getGanttItems: function() {
    //   let tasks = []
    //   for(const projKey in this.getProjTree){
    //     let momentsEnd = this.getProjTree[projKey].map(d => d.dates[1]),
    //       momentsStart = this.getProjTree[projKey].map(d => d.dates[0]),
    //       maxDate = max(...momentsEnd),
    //       minDate = min(...momentsStart)
    //     tasks.push({
    //       name: projKey,
    //       type: 'proj',
    //       end: maxDate,
    //       start: minDate,
    //       margin: differenceInCalendarDays(minDate, this.getGanttMonths[0].start) * dayWidth,
    //       width: differenceInCalendarDays(maxDate, minDate) * dayWidth + dayWidth,
    //     })
    //     if(this.expandProj.length>0&&this.expandProj.includes(projKey)){
    //       this.getProjTree[projKey].map(task => {
    //         task.start=task.dates[0]
    //         task.end=task.dates[1]
    //         task.margin = differenceInCalendarDays(task.start, this.getGanttMonths[0].start) * dayWidth
    //         task.width = differenceInCalendarDays(task.end, task.start) * dayWidth + dayWidth
    //         task.type='task'
    //         tasks.push(task)
    //       })
    //     }
    //   }
    //   return tasks
    // }
  },
};
</script>

<style lang="sass" scoped>
.cont
  display: inline-flex
  width: 100%
  height: 100%
  margin-top: 15px
  .side
    flex: 1
    min-width: 250px
    max-width: 250px
    box-sizing: border-box
    border: 1px solid #E9ECEF
    background: #fff
    .select-proj
      height: 72px
      background: #fff
      width: 248px
      padding: 0 25px
      display: flex
      align-items: center
      border-bottom: 1px solid #E9ECEF
    .tasks-tree
      &-task
        height: 35px
        padding-left: 25px
        line-height: 35px
        font-size: 12px
        border-bottom: 1px solid #E9ECEF
        transition: background .3s
        &:hover
          cursor: pointer
          background: #F5F5F5
        &:last-child
          border-bottom: 0
  .gantt
    flex: 1
    max-width: calc(100% - 250px)
    overflow-x: scroll
    border-right: 1px solid #E9ECEF
    border-bottom: 1px solid #E9ECEF
    background: #fff
    .ganttBody
      .body
        .task
          height: 35px
          background: #fff
          display: flex
          align-items: center
          border-bottom: 1px solid #E9ECEF
          &:last-child
            border-bottom: 0
          .bar
            height: 20px
            background: #4d7cfe
            border-radius: 15px
            border: 1px solid #4364c4
          .proj-bar
            background: #3a58ac
      .head
        display: flex
        background: #fff
        border-top: 1px solid #E9ECEF
        border-bottom: 1px solid #E9ECEF
        .month
          &:last-child
            .month-name
              border-right: 0
            .date:last-child
              border-right: 0
          .month-name
            display: flex
            align-items: center
            justify-content: center
            height: 40px
            border-right: 1px solid #E9ECEF
            text-transform: capitalize
          .dates
            display: flex
            border-top: 1px solid #E9ECEF
            .date
              width: 35px
              height: 30px
              line-height: 30px
              text-align: center
              border-right: 1px solid #E9ECEF
            .today
              background-color: $primary-color
              color: #fff
</style>
