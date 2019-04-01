<template lang="pug">
  transition-group.task-list(name="list-complete", tag="div")
    .task(v-for='item, index in getTasks', :key='item.id', @click='showTask(item.id)', :class='{ "completed": item.completed }')
      .task-inner
        .check(@click='checkClick($event,index)', :style='{ backgroundColor: item.completed ? "$primary-color" : "#e8ecef" }')
          i.la.icon(v-if='item.completed') &#xf17b;
        span {{item.name}}
        .spacer
        .label BIM
      .task-divider
</template>
<script>
import {differenceInCalendarDays, isThisWeek} from 'date-fns'
export default {
  props: [ 'sortDate' ],
  computed: {
    getTasks: function () {
      if(this.$route.name==='Входящие'){
        return this.$store.state.tasks.filter(item=> item.project.name==='Входящие')
      }
      if(this.$route.name==='Сегодня'){
        return this.$store.state.tasks.filter(item=> {
          if(
            differenceInCalendarDays(item.start,new Date())>=0
            &&
            differenceInCalendarDays(item.end,new Date())<=0
          ) return item
        })
      }
      if(this.$route.name==='Неделя'){
        return this.$store.state.tasks.filter(item=> {
          if(
            isThisWeek(item.start)
            &&
            isThisWeek(item.end)
          ) return item
        })
      }
      if(this.sortDate){
        return this.$store.state.tasks.filter(item=>{
          if(
            differenceInCalendarDays(item.start,this.sortDate)>=0
            &&
            differenceInCalendarDays(item.end,this.sortDate)<=0
          ) return item
        })
      }else {
        return this.$store.state.tasks
      }
      
    }
  },
  methods: {
    checkClick: function (e, index) {
      e.stopPropagation()
      this.$store.commit('toggleTask', index)
    },
    showTask: function (id) {
      this.$store.commit('showTaskView', id)
    }
  }
}
</script>
<style lang="sass" scoped>
  .task-list
    height: calc(100% - 21px)
    background: #fff
    padding: 10px 4px
    box-sizing: border-box
    overflow-x: hidden
    position: relative
    .task
      height: 58px
      width: 100%
      transition: all .5s
      padding: 0 21px
      box-sizing: border-box
      &:hover
        cursor: pointer
        background-color: #F8FAFB
      &-inner
        display: flex
        width: 100%
        box-sizing: border-box
        height: 57px
        align-items: center
        .label
          background-color: #FEF9EF
          border-radius: 5px
          padding: 8px 19px
          box-sizing: border-box
          color: #ffab2b
          font-size: 14px
        .check
          border-radius: 3px
          width: 20px
          height: 20px
          display: flex
          align-items: center
          justify-content: center
          user-select: none
          transition: background-color .3s
          i
            color: #fff
            font-size: 16px
        span
          transition: color .3s
          font-size: 16px
          color: #252631
          margin-left: 12px
      &-divider
        height: 1px
        background-color: #E8ECEF
        width: 100%
        transition: background-color .3s
    .completed
      span
        color: #778ca2
</style>
