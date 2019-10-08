<template lang="pug">
  .add
    .header(:style='{ paddingTop: proj?"0px": "22px"}')
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
        .headline Описание
        a-textarea(placeholder='Опишите вашу задачу' autosize v-model='taskDesc' :disabled='!isTaskAdmin')

      .attachments
        .headline Приложения
        a-upload-dragger(name='file',:defaultFileList="getAttach", :multiple='true', :customRequest='handleSendFile' :disabled='!isTaskAdmin')
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
import AssignTabs from './AssignTabs.vue'
import AddComment from './AddComment.vue'
import Activity from './Activity.vue'
import ruRU from 'ant-design-vue/lib/locale-provider/ru_RU'
import axios from 'axios'

export default {
  props: ['proj'],
  components: { AssignTabs, AddComment, Activity },
  computed: {
    isTaskAdmin() {
      if (this.$store.state.user.role == 'admin') return true
      if (this.actualTask.members.length>0 && this.actualTask.members.filter(i => i.role == "assignator").length>0) {
        return this.actualTask.members.filter(i => i.role == "assignator")[0].user.id == this.$store.state.user.id
      }else {
        return false
      }

    },
    taskDesc: {
      get(){
        return this.actualTask.description
      },
      set(val) {
        this.$store.dispatch('updateDescription', val)
      }
    },
    taskName: {
      get() {
        return this.actualTask.name
      },
      set(val) {
        this.$store.dispatch('updateName', val)
      }
    },
    actualTask() {
      return this.$store.state.actualTask
    },
    getAttach: function () {
      return this.$store.state.actualTask.attachments.map(i => {
        let attach = i.last_version
        attach.name = decodeURIComponent(attach.url).split('/').pop()
        attach.uid = attach.id
        attach.url = 'https://api.avcg.ru/' + attach.url
        return attach
      })
    },
    allProjects: function () {
      return this.$store.state.projects
    },
    allTags: function () {
      return this.$store.state.tags
    },
    taskMembers () { return this.$store.state.actualTask.members},
    assignor: function () {
      return this.filterByRole('assignator')
    },
    responsible: function () {
      return this.filterByRole('responsible')
    },
    coresponsibles: function () {
      return this.filterByRole('co-responsible')
    },
    observers: function () {
      return this.filterByRole('observer')
    }
  },
  mounted() {
    this.updateMembers(this.actualTask.project.id)
  },
  methods: {
    updateAssign(type, id) {
      let body = {
        task_id: this.actualTask.id,
        role: type,
      }
      if (Array.isArray(id)) {
        body.user_ids = id.map(i => (i))
      }else {
        body.user_ids = [id]
      }
      this.$store.dispatch('updateAssign', body)
    },
    filterByRole: function (type) {
      return this.taskMembers.filter(i => i.role === type).map(i => i.user.id)
    },
    handleSendFile({ onSuccess, onError, file }) {
      let body = new FormData()
      body.set(`task[attachments][${this.getAttach.length}][file]`, file)
      return axios({
        method: 'put',
        url: '/tasks/' +  this.actualTask.id,
        data: body,
        header: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      }).then(()=> {
        onSuccess(null, file)
        this.$store.dispatch('reloadTask', this.actualTask.id)
      }).catch(err=> {
        onError(err)
      })
    },
    handleChangeUpload(info) {
      const status = info.file.status;
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    dateChange: function (val) {
      this.$store.dispatch('updateTaskDates', val)
    },
    parseForLabelAndProj: function (e) {
      this.projects = [ ...this.projects, ...e.target.value.match(/#[a-z\d-]+/ig) ]
      this.$store.commit('updateName', e.target.value.replace(/#[a-z\d-]+/ig, ''))
    },
    setTaskProject: function (id) {
      this.$store.dispatch('setTaskProject', id)
      this.updateMembers(id)
    },
    addDoc: function (e) {
      this.$store.dispatch('addTaskAttachment', {
        file: e.target.files[0]
      })
    },
    updateMembers: function (id) {
      axios.get('/projects/' + id).then(res => {
        this.users = res.data.project.members
      })
    },
    addTag: function (tag) {
      this.$store.dispatch('addTagTask', tag)
    },
    close: function () {
      this.$store.commit('closeTaskViewAndAdd')
    },
    deleteTask: function () {
      this.$store.dispatch('deleteTask')
    }
  },
  data () {
    return {
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
