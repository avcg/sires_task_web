<template lang='pug'>
div(v-if="$auth.ready()")
  add-label-dialog(v-if='$auth.check()')
  add-project-dialog(v-if='$auth.check()')
  #app
    transition(name="tool" enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp" mode="out-in")
      Toolbar(v-if='$auth.check()')
    .fl
      transition(name="side" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight" mode="out-in")
        SideMenu(v-if='$auth.check()')
      .router-cont(v-if='$store.state.user')
        transition(name="route" enter-active-class="animated fast fadeIn" leave-active-class="animated fast fadeOut" mode="out-in")
          router-view(:key="$route.fullPath")
</template>
<script>
import { Socket } from 'phoenix';
import Toolbar from './components/Toolbar';
import SideMenu from './components/SideMenu';
import AddProjectDialog from './components/Projects/AddProjectDialog.vue';
import AddLabelDialog from './components/Labels/AddLabelDialog.vue';

export default {
  components: {
    Toolbar, SideMenu, AddProjectDialog, AddLabelDialog,
  },
  name: 'App',
  computed: {
    isLoggined() {
      return this.$store.state.authenticated;
    },
    isDialogOpen() {
      const { state } = this.$store;
      return state.labelDialog || state.projectDialog;
    },
  },
  mounted() {
    if (this.$route.name !== 'login') {
      this.$store.dispatch('getProjects');
      this.$store.dispatch('getTags');
      this.$store.dispatch('getUser');
      this.$store.dispatch('getUsers');
    }
    this.axios.get('/current_user').then((resp) => {
      const socket = new Socket('ws://api.avcg.ru/socket', { params: { token: resp.data.ws_token } });
      socket.connect();
      socket.onError(() => console.log('there was an error with the connection!'));
      socket.onClose(() => console.log('the connection dropped'));
      console.log(socket);
      const channel = socket.channel('tasks', {});
      channel.onError(() => console.log('there was an error!'));
      channel.onClose(() => console.log('the channel has gone away gracefully'));
      channel.join()
        .receive('ok', ({ messages }) => console.log('catching up', messages))
        .receive('error', ({ reason }) => console.log('failed join', reason))
        .receive('timeout', () => console.log('Networking issue. Still waiting...'));
      channel.on('create', (msg) => {
        this.$notification.info({
          message: 'Задача успешно создана',
        });
      });
      channel.on('update', (msg) => {
        this.$notification.info({
          message: `Задача "${msg.task.name}" обновлена`,
        });
      });
      channel.on('toggle_done', (msg) => {
        this.$notification.info({
          message: `Задача "${msg.task.name}" выполнена`,
        });
      });
      channel.on('add_member', (msg) => console.log('add_memberd', msg));
      channel.on('add_attachment', (msg) => console.log('add_attachmentd', msg));
      channel.on('add_comment', (msg) => console.log('add_attachmentd', msg));
      // create, update, delete, toggle_done, add_member,
      // remove_member, add_attachment, add_attachment_version,
      // delete_attachment_version, add_comment, change_comment, remove_comment, add_reference, remove_reference
    });
  },
  data() {
    return {
      inVal: '',
    };
  },
};
</script>

<style lang='sass'>
body
  font-family: 'Rubik', sans-serif
  margin: 0
.fl
  display: flex
#app
  color: #2c3e50
  height: 100vh
  width: 100vw
  overflow: hidden
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
