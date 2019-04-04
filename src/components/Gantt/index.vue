<template lang="pug">
  .cont
    .side
      a-tree(:treeData="getTree",@expand='expand')
    .gantt
      .ganttBody(:style='{ width: ganttWidth + "px" }')
        .head
          .month(v-for='month in getGanttMonths')
            .month-name {{fMonth(month.start)}}
            .dates
              .date(v-for='day in month.days') {{fDay(day)}}
        .body
          .task(v-for='bar in getGanttItems')
            .bar(:class='{ "proj-bar": bar.type=="proj" }' :style='{ width: bar.width + "px", marginLeft: bar.margin + "px" }')
</template>
<script>
/* eslint-disable */
import { uniqBy } from 'lodash'
import { 
  min,
  max,
  format,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  differenceInMonths,
  getDaysInMonth,
  differenceInDays,
  addDays,
  eachDay,
  differenceInCalendarDays
} from 'date-fns'

var ruLocale = require('date-fns/locale/ru')
const dayWidth = 35

export default {
  data(){
    return {
      expandProj: []
    }
  },
  methods: {
    fMonth: function (date) {
      return format(date,'MMMM', { locale: ruLocale })
    },
    fDay: function (date) {
      return format(date, 'D')
    },
    redrawGantt: function () {
      var gantt = new Gantt("#gantt", this.getGanttItems, {
        bar_height: 17,
        language: 'ru'
      })
    },
    expand: function (expandedKeys) {
      this.expandProj=expandedKeys
      this.redrawGantt()
    },
  },
  mounted() {
    
  },
  computed: {
    getGanttMonths: function() {
      const tasks = this.$store.state.tasks
      const minDate = startOfMonth(subMonths(min(...tasks.map(d=>d.dates[0])),1)),
        maxDate = endOfMonth(addMonths(max(...tasks.map(d=>d.dates[1])),1))
      let months = [],
        tempMonth = minDate
      
      while(differenceInMonths(maxDate, tempMonth)>=0){
        months.push({
          start: tempMonth,
          width: getDaysInMonth(tempMonth) * dayWidth,
          days: []
        })
        tempMonth = addMonths(tempMonth,1)
      }
      months.splice(-1, 1)
      months.map(month => {
        const monthEndDay = endOfMonth(month.start)
        month.days = eachDay(month.start, monthEndDay)
      })
      return months
    },
    ganttWidth: function () {
      return this.getGanttMonths.reduce((acc,item)=>{
        return acc+=item.width
      },0)
    },
    getTasks: function() {
      return this.$store.state.tasks.map(item=>{
        return item
      })
    },
    getTree: function() {
      let tree = []
      tree = this.$store.state.tasks.map(item => {
        return {
          title: item.project.name,
          key: item.project.name,
          children: [],
          class: 'gantt-node'
        }
      })
      tree = uniqBy(tree, 'key')
      this.$store.state.tasks.map(item=>{
        let projInd = tree.map(d=>d.key).indexOf(item.project.name)
        item.title=item.name
        tree[projInd].children.push(item)
      })
      return tree
    },
    getProj: function() {
      let list = {}
      this.$store.state.tasks.map(item=>{
        if(!list[item.project.name]) list[item.project.name] = []
        item.title=item.name
        item.class='gantt-node'
        list[item.project.name].push(item)
      })
      return list
    },
    getGanttItems: function() {
      let tasks = []
      for(const projKey in this.getProj){
        let momentsEnd = this.getProj[projKey].map(d => d.dates[1]),
          momentsStart = this.getProj[projKey].map(d => d.dates[0]),
          maxDate = max(...momentsEnd),
          minDate = min(...momentsStart)
        tasks.push({
          name: projKey,
          type: 'proj',
          end: maxDate,
          start: minDate,
          margin: differenceInCalendarDays(minDate, this.getGanttMonths[0].start) * dayWidth,
          width: differenceInCalendarDays(maxDate, minDate) * dayWidth + dayWidth,
        })
        if(this.expandProj.length>0&&this.expandProj.includes(projKey)){
          this.getProj[projKey].map(task => {
            task.start=task.dates[0]
            task.end=task.dates[1]
            task.margin = differenceInCalendarDays(task.start, this.getGanttMonths[0].start) * dayWidth
            task.width = differenceInCalendarDays(task.end, task.start) * dayWidth + dayWidth
            task.type='task'
            tasks.push(task)
          })
        }
      }
      return tasks
    }
  },
}
</script>
<style lang="sass" scoped>
.cont
  display: inline-flex
  width: 100%
  height: 100%
  .side
    flex: 1
    min-width: 250px
    max-width: 250px
    margin-top: 93px
    box-sizing: border-box
  .gantt
    flex: 1
    max-width: calc(100% - 250px)
    overflow-x: scroll
    .ganttBody
      .body
        .task
          height: 35px
          background: #fff
          display: flex
          align-items: center
          border-bottom: 1px solid #E9ECEF
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
        border: 1px solid #E9ECEF
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
            height: 60px
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

</style>
