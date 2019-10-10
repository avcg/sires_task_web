<template lang="pug">
  .add
    .header(:style='{ paddingTop: proj?"0px": "22px"}')
      a-button.mr-10(size='small' @click='openPrev', v-if='this.actualTask.parent_references && this.actualTask.parent_references.length>0') Назад
      a-tag(v-for='tagSelected in actualTask.tags', color="orange") {{tagSelected.name}}
      a-popover(placement='bottomLeft',title="Добавить тег" v-if='isTaskAdmin')
        a-tag(@click='tagPopover=true') +
        div(slot='content')
          a-tag(v-for='tag in allTags', color="orange", @click='addTag(tag)') {{tag.name}}
      .spacer
      a-popconfirm( placement="bottomRight" title='Вы точно хотите удалить задачу?' @confirm='deleteTask' okText='Да' cancelText='Нет' v-if='isTaskAdmin')
        .delete
          a-icon(type='delete')
      .close(@click='close' v-if='!proj')
        a-icon(type='close')
    .divider
    .body
      .head-input
        input.input-name(placeholder='Название задачи', v-model='taskName' @keyup.enter='parseForLabelAndProj' :disabled='!isTaskAdmin')
      AssignTabs(
        v-if='actualTask.project.name != "Inbox" && actualTask.project.name != "Входящие"'
        :users='users',
        :assignor='assignor',
        :coresponsibles='coresponsibles',
        :observers='observers',
        :responsible='responsible'
        @changeAssign='updateAssign'
      )
      .fl-jsb
        a-select(:defaultValue='actualTask.project.id' @change='setTaskProject' :disabled='!isTaskAdmin')
          a-select-option(v-for='proj in allProjects',:value='proj.id', :key='proj.id') {{proj.name}}
        a-locale-provider(:locale='locale')
          a-range-picker(
            :disabled='!isTaskAdmin'
            format='DD MMM YYYY',
            :allowClear="false",
            :value='[moment(actualTask.start_time, "YYYY-MM-DD"), moment(actualTask.finish_time, "YYYY-MM-DD")]',
            @change='dateChange'
          )
      .desc-input
        .headline Подзадачи
          a-button(@click='addSubtask' v-if='isTaskAdmin') Добавить подзадачу
        .task(v-for='item, index in actualTask.child_references', :key='item.task.id', @click='showTask(item.task.id)', :class='{ "completed": item.task.done }')
          .task-inner
            .check(@click='checkClick($event, item.task.id, item.task.done)')
              i.la.icon(v-if='item.task.done') &#xf17b;
            span {{item.task.name}}
            .spacer
            span {{fDate(item.task.finish_time)}}
          .task-divider
      .desc-input
        .headline Описание
        a-textarea(placeholder='Опишите вашу задачу' autosize v-model='taskDesc' :disabled='!isTaskAdmin')

      .attachments
        .headline Приложения
        a-upload-dragger(name='file',:fileList="attach", :multiple='true', :customRequest='handleSendFile' :disabled='!isTaskAdmin' :remove='deleteFile')
          p.ant-upload-drag-icon
            a-icon(type='inbox')
          p.ant-upload-text Нажмите или перетащите файл в эту область
        //- a.attachment(v-for='item in actualTask.attachments' :href='getUrl(item.file)' :download='item.name')
        //-   i.la.icon &#xf1ec;
        //-   span {{item.name}}
        //- input(type="file" @change='addDoc' ref="file" style="display: none")
        //- .addAttach(@click="$refs.file.click()")
        //-   i.la.icon 
        //-   span Прикрепить файл
      activity(:items='actualTask.comments')
      add-comment
</template>
<script>
import ruRU from 'ant-design-vue/lib/locale-provider/ru_RU';
import axios from 'axios';
import { startOfDay, endOfDay, format } from 'date-fns';
import Activity from './Activity.vue';
import AddComment from './AddComment.vue';
import AssignTabs from './AssignTabs.vue';

export default {
  props: ['proj'],
  components: { AssignTabs, AddComment, Activity },
  computed: {
    isTaskAdmin() {
      if (this.users && this.users.filter((u) => u.role == 'admin').length > 0 && this.users.filter((u) => u.role == 'admin')[0].user.id == this.$store.state.user.id) return true;
      if (this.$store.state.user.role == 'admin') return true;
      if (this.actualTask.members.length > 0 && this.actualTask.members.filter((i) => i.role == 'assignator').length > 0) {
        return this.actualTask.members.filter((i) => i.role == 'assignator')[0].user.id == this.$store.state.user.id;
      }
      return false;
    },
    taskDesc: {
      get() {
        return this.actualTask.description;
      },
      set(val) {
        if (val != this.actualTask.description) {
          this.$store.dispatch('updateDescription', val);
        }
      },
    },
    taskName: {
      get() {
        return this.actualTask.name;
      },
      set(val) {
        if (val != this.actualTask.name) {
          this.$store.dispatch('updateName', val);
        }
      },
    },
    actualTask() {
      return this.$store.state.actualTask;
    },
    allProjects() {
      return this.$store.state.projects;
    },
    allTags() {
      return this.$store.state.tags;
    },
    taskMembers() { return this.$store.state.actualTask.members; },
    assignor() {
      return this.filterByRole('assignator');
    },
    responsible() {
      return this.filterByRole('responsible');
    },
    coresponsibles() {
      return this.filterByRole('co-responsible');
    },
    observers() {
      return this.filterByRole('observer');
    },
  },
  mounted() {
    this.updateMembers(this.actualTask.project.id);
    this.attach = this.$store.state.actualTask.attachments.map((i) => {
      const attach = i.last_version;
      attach.name = decodeURIComponent(attach.url).split('/').pop();
      attach.uid = attach.id;
      attach.url = `https://api.avcg.ru/${attach.url}`;
      return attach;
    });
  },
  methods: {
    checkClick(e, id, done) {
      e.stopPropagation();
      if (done) {
        this.$store.dispatch('toggleTaskUndone', id).then(() => this.$store.dispatch('reloadTask', this.actualTask.id));
      } else {
        this.$store.dispatch('toggleTaskDone', id).then(() => this.$store.dispatch('reloadTask', this.actualTask.id));
      }
    },
    showTask(id) {
      if (this.proj) {
        this.$emit('selectTask');
      }
      this.$store.dispatch('showTask', id);
    },
    fDate(val) {
      return format(val, 'DD.MM.YYYY');
    },
    addSubtask() {
      this.axios.post('/tasks', {
        task: {
          finish_time: endOfDay(new Date()).toISOString(),
          name: 'Новая подзадача',
          project_id: this.actualTask.project.id,
          start_time: startOfDay(new Date()).toISOString(),
        },
      }).then((res) => {
        this.axios.post(`/tasks/${res.data.task.id}/references`, {
          reference: {
            reference_type: 'subtask',
            task_id: this.actualTask.id,
          },
        }).then(() => {
          this.$store.dispatch('reloadTask', this.actualTask.id);
        });
      });
    },
    openPrev() {
      this.$store.dispatch('showTask', this.actualTask.parent_references[0].task.id);
    },
    deleteFile(file) {
      const version = this.actualTask.attachments.filter((f) => f.id == file.id)[0].last_version.id;
      this.axios.delete(`/tasks/${this.actualTask.id}/attachments/${file.id}/versions/${version}`).then((resp) => {
        this.$store.dispatch('reloadTask', this.actualTask.id);
      });
    },
    updateAssign(type, id) {
      const body = {
        task_id: this.actualTask.id,
        role: type,
      };
      if (Array.isArray(id)) {
        body.user_ids = id.map((i) => (i));
      } else {
        body.user_ids = [id];
      }
      this.$store.dispatch('updateAssign', body);
    },
    filterByRole(type) {
      return this.taskMembers.filter((i) => i.role === type).map((i) => i.user.id);
    },
    handleSendFile({
      onSuccess, onError, file, onProgress,
    }) {
      const body = new FormData();
      body.set('attachment[file]', file);
      return axios({
        method: 'post',
        url: `/tasks/${this.actualTask.id}/attachments`,
        data: body,
        header: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          onProgress({ percent: (e.loaded / e.total) * 100 });
        },
      }).then(() => {
        onSuccess(null, file);
        this.$store.dispatch('reloadTask', this.actualTask.id);
      }).catch((err) => {
        onError(err);
      });
    },
    handleChangeUpload(info) {
      const { status } = info.file;
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    dateChange(val) {
      this.$store.dispatch('updateTaskDates', val);
    },
    parseForLabelAndProj(e) {
      this.projects = [...this.projects, ...e.target.value.match(/#[a-z\d-]+/ig)];
      this.$store.commit('updateName', e.target.value.replace(/#[a-z\d-]+/ig, ''));
    },
    setTaskProject(id) {
      this.$store.dispatch('setTaskProject', id);
      this.updateMembers(id);
    },
    addDoc(e) {
      this.$store.dispatch('addTaskAttachment', {
        file: e.target.files[0],
      });
    },
    updateMembers(id) {
      axios.get(`/projects/${id}`).then((res) => {
        this.users = res.data.project.members;
      });
    },
    addTag(tag) {
      this.$store.dispatch('addTagTask', tag);
    },
    close() {
      this.$store.commit('closeTaskViewAndAdd');
    },
    deleteTask() {
      this.$store.dispatch('deleteTask');
      this.$emit('close');
    },
  },
  watch: {
    'actualTask.attachments': function (val) {
      if (val) {
        this.attach = this.$store.state.actualTask.attachments.map((i) => {
          const attach = i.last_version;
          attach.name = decodeURIComponent(attach.url).split('/').pop();
          attach.uid = attach.id;
          attach.url = `https://api.avcg.ru/${attach.url}`;
          return attach;
        });
      }
    },
  },
  data() {
    return {
      attach: [],
      users: [],
      locale: ruRU,
      projects: [],
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
.mr-10
  margin-right: 10px
.task
  height: 48px
  width: 100%
  transition: all .5s
  padding: 0 10px
  box-sizing: border-box
  &:hover
    cursor: pointer
    background-color: #F8FAFB
  &-inner
    display: flex
    width: 100%
    box-sizing: border-box
    height: 100%
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
.fl-jsb
  display: flex
  justify-content: space-between
  width: 100%
.add
  overflow: hidden
  display: flex
  flex-direction: column
  white-space: nowrap
  height: 100%
  .actions
    display: flex
    padding-top: 11px
    padding-bottom: 29px
    padding-right: 24px
  .body
    padding: 26px 23px
    overflow-y: auto
    flex: 1
    position: relative
    .headline
      font-size: 18px
      color: #252631
      display: flex
      justify-content: space-between
      width: 100%
    .attachments
      margin-top: 25px
      .headline
        margin-bottom: 10px
      .attachment
        display: flex
        align-items: center
        margin-bottom: 13px
        span
          color: #778ca2
          margin-left: 4px
        i
          font-size: 18px
          color: #778ca2
      .addAttach
        display: flex
        align-items: center
        &:hover
          cursor: pointer
        span
          margin-left: 14px
          font-size: 14px
          padding-top: 2px
          color: #778ca2
        i
          font-size: 18px
          color: #778ca2
    .check-input
      margin-top: 25px
      .headline
        margin-bottom: 20px
      .add-check
        &:hover
          cursor: pointer
      .check-item
        display: flex
        align-items: center
        margin-bottom: 14px
        transition: all .5s
        .name
          font-size: 14px
          color: #778ca2
          margin-left: 14px
          input
            font-size: 14px
            color: #778ca2
            border: 0
            width: 200px
            outline: none
            padding: 0
            &::placeholder
              color: #c8d1d9
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
    .desc-input
      margin-top: 25px
      .headline
        margin-bottom: 10px
    .block
      flex: 1
      .subtitle
        font-size: 14px
        line-height: 1.5
        color: #98a9bc
        margin-bottom: 13px
      .date
        display: flex
        align-items: center
        height: 35px
        margin-right: 10px
        span
          margin-left: 10px
          font-size: 12px
          font-weight: 500
          color: #252631
    .labels
      margin-bottom: 15px
      display: flex
      position: absolute
      flex-direction: column
      align-items: flex-end
      right: 0
      z-index: 10
      .add-label
        background-color: #F2F4F6
        border-radius: 5px
        padding: 8px 19px
        width: fit-content
        margin-right: 10px
        i
          font-size: 14px
          color: #778CA2
      .label
        background-color: #FEF9EF
        border-radius: 5px
        padding: 8px 19px
        color: #ffab2b
        font-size: 14px
        width: fit-content
        margin-right: 10px
        margin-bottom: 10px
    .project
      flex: 1
      &-inner
        margin-top: 25px
        width: 250px
        display: flex
        align-items: center
        span
          flex: 1
          padding-left: 1px
          padding-right: 5px
        i
          font-size: 16px
          padding-right: 10px
    .head-input
      margin-bottom: 15px
      .input-name
        border: 0
        font-size: 20px
        color: #252631
        outline: none
        width: 300px
      .proj
        font-size: 12px
        color: #7B8CA0
        padding-left: 1px
        i
          font-size: 12px
          color: #7B8CA0
          margin-left: 3px
  .header
    padding: 17px 22px
    display: flex
    align-items: center
    .clock
      margin-right: 10px
      user-select: none
      &:hover
        cursor: pointer
        i
          color: $primary-color
    .delete
      margin-right: 10px
      user-select: none
      &:hover
        cursor: pointer
        i
          color: #FE4D97
    .close
      user-select: none
      &:hover
        cursor: pointer
        i
          color: $primary-color
    .title
      display: flex
      align-items: center
      i
        font-size: 18px
        color: #778ca2
      span
        font-size: 12px
        font-weight: 500
        color: #778ca2
        margin-left: 7px
</style>
