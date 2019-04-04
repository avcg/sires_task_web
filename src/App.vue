<template lang='pug'>
div
  add-label-dialog
  add-project-dialog
  #app(:style='{ filter: isDialogOpen ? "blur(2px)" : "none", pointerEvents: isDialogOpen ? "none" : "auto" }')
    transition(name="tool" enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp" mode="out-in")
      Toolbar(v-if='isLoggined')
    .fl
      transition(name="side" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight" mode="out-in")
        SideMenu(v-if='isLoggined')
      .router-cont
        transition(name="route" enter-active-class="animated fast fadeIn" leave-active-class="animated fast fadeOut" mode="out-in")
          router-view
</template>
<script>
import Toolbar from './components/Toolbar'
import SideMenu from './components/SideMenu'
import AddProjectDialog from './components/Projects/AddProjectDialog.vue'
import AddLabelDialog from './components/Labels/AddLabelDialog.vue'

export default {
  components: { Toolbar, SideMenu, AddProjectDialog, AddLabelDialog },
  name: 'App',
  computed: {
    isLoggined: function () {
      return this.$store.state.authenticated
    },
    isDialogOpen: function () {
      const state = this.$store.state
      return state.labelDialog || state.projectDialog
    }
  },
  data () {
    return {
      inVal: ''
    }
  },
  mounted () {
    if (!this.isLoggined) {
      this.$router.replace({ name: 'login' })
    }
  }
}
</script>

<style lang='sass'>
body
  font-family: 'Rubik', sans-serif
  margin: 0
.fl
  display: flex
#app
  color: #2c3e50
  transition: filter .3s
.icon
  color: #778ca2
  transition: color .3s
  font-size: 22px
a
  text-decoration: none
  &:active
    text-decoration: none
.bar-label
  font-weight: 400!important
.bar-proj
  pointer-events: none
  .bar-progress
    fill: #4e6abe
.bar-task
  pointer-events: none
  .bar-progress
    fill: #7191ef
.gantt-node
  box-sizing: border-box
  padding: 0!important
  background: #fff
  span
    line-height: 35px!important
    height: 35px!important
    box-sizing: border-box
p
  margin: 0
input, textarea
  outline: none
  border-width: 0
h1,h2,h3,h4,h5,h6
  margin: 0
.divider
  width: 100%
  background-color: #f2f4f6
  height: 1px
.spacer
  flex: 1
.router-cont
  flex: 1
  overflow-x: hidden
  padding: 28px
  min-height: calc(100vh - 65px)
  width: 100%
  background-color: #F8FAFB
  box-sizing: border-box
.list-complete-item
  transition: all 1s
  display: inline-block
  margin-right: 10px
.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateX(30px)
.list-complete-leave-active
  position: absolute
.dialog-enter-active, .dialog-leave-active
  transition: opacity .5s
.dialog-enter, .dialog-leave-to
  opacity: 0
  .cont
    transform: scale(0.5)
.gantt-elastic__main-view
  background: transparent!important
.gantt-elastic__chart-graph
  background: #fff!important
.gantt-elastic__main-container
  width: auto!important
.gantt-elastic__task-list-items
  background: #fff!important
</style>
