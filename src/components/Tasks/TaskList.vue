<template lang="pug">
  transition-group.task-list(name="list-complete", tag="div")
    .task(v-for='item, index in tasks', :key='item.id', @click='showTask(item.id)', :class='{ "completed": item.done }')
      .task-inner
        .check(@click='checkClick($event, item.id, item.done)')
          i.la.icon(v-if='item.done') &#xf17b;
        span {{item.name}}
        .spacer
        span {{fDate(item.finish_time)}}
      .task-divider
</template>
<script>
import { format } from 'date-fns'

export default {
  props: [ 'tasks' ],
  methods: {
    fDate(val) {
      return format(val, 'DD.MM.YYYY')
    },
    checkClick: function (e, id, done) {
      e.stopPropagation()
      if(done){
        this.$store.dispatch('toggleTaskUndone', id)
      }else{
        this.$store.dispatch('toggleTaskDone', id)
      }
      
    },
    showTask: function (id) {
      this.$store.dispatch('showTask', id)
    }
  }
}
</script>
<style lang="sass" scoped>
  .task-list
    height: calc(100vh - 172px)
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
          background-color: #e8ecef
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
      .check
        background-color: $primary-color
      span
        color: #778ca2
</style>
