<template lang="pug">
  .body
    .labels
      a-tag(v-for='taskLabel in actualTask.tags', color="orange") {{taskLabel.name}}
      a-popover(placement='bottomLeft',title="Добавить тег")
        a-tag(@click='tagPopover=true') +
        div()
          a-tag(v-for='taskLabel in actualTask.tags', color="orange") {{taskLabel.name}}
    .head-input
      input.input-name(placeholder='Название задачи', v-model='taskName' @keyup.enter='parseForLabelAndProj')
    AssignTabs(
      :users='users',
      :assignor='assignor',
      :coresponsibles='coresponsibles',
      :observers='observers',
      :responsible='responsible'
      @changeAssign='updateAssign'
    )
    .fl-jsb
      a-select(:defaultValue='actualTask.project.id' @change='setTaskProject')
        a-select-option(v-for='proj in allProjects',:value='proj.id', :key='proj.id') {{proj.name}}
      a-locale-provider(:locale='locale')
        a-range-picker(
          format='DD MMM YYYY',
          :allowClear="false",
          :value='[moment(actualTask.start_time, "YYYY-MM-DD"), moment(actualTask.finish_time, "YYYY-MM-DD")]',
          @change='dateChange'
        )
    
    .desc-input
      .headline Описание
      a-textarea(placeholder='Опишите вашу задачу' autosize :value='actualTask.description' @change="updateDescription")
    //- .check-input
    //-   .headline Чек-лист
    //-   transition-group(name="list-complete", enter-active-class="animated fast slideInRight")
    //-     .check-item(v-for='item,index in actualTask.checks', :key='item.id')
    //-       .check(@click='checkSubtask(item.id)', :style='{ backgroundColor: item.checked ? "$primary-color" : "#e8ecef" }')
    //-         i.la.icon(v-if='item.checked') &#xf17b;
    //-       .name
    //-         input(:value='item.name' @input='updateCheckName($event, item.id)' placeholder='Введите название подзадачи')
    //-     .check-item.add-check(@click='addCheck', key='add123')
    //-       i.la.icon 
    //-       .name Добавить
    .attachments
      .headline Приложения
      a-upload-dragger(name='file', :multiple='true', :customRequest='handleSendFile', @change='handleChangeUpload')
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
  components: { AssignTabs, AddComment, Activity },
  computed: {
    taskName: {
      get() {
        return this.actualTask.name
      },
      set(val) {
        this.$store.dispatch('updateName', val)
      }
    },
    actualTask: function () {
      return this.$store.state.actualTask
    },
    allProjects: function () {
      return this.$store.state.projects
    },
    allTags: function () {
      return this.$store.state.tags
    },
    assignor: function () {
      return this.$store.state.actualTask.members.map(i => {
        if(i.role === 'assignor') {
          return i.user.id
        }
      })
    },
    responsible: function () {
      return this.$store.state.actualTask.members.map(i => {
        if(i.role === 'responsible') {
          return i.user.id
        }
      })
    },
    coresponsibles: function () {
      return this.$store.state.actualTask.members.map(i => {
        if(i.role === 'co-responsible') {
          return i.user.id
        }
      })
    },
    observers: function () {
      return this.$store.state.actualTask.members.map(i => {
        if(i.role === 'observer') {
          return i.user.id
        }
      })
    }
  },
  mounted() {
    this.updateMembers(this.actualTask.id)
  },
  methods: {
    updateAssign(type, id) {
      console.log('hi')
      console.log(type)
      console.log(id)
      // this.$store.dispatch('')
    },
    handleSendFile(file, fileList) {
      const json = JSON.stringify(this.actualTask);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      const data = new FormData();
      data.append("file",file)
      data.append("task", blob);
      axios({
        method: 'put',
        url: '/tasks/' +  this.actualTask.id,
        data: data,
        header: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      })
    },
    handleChangeUpload(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
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
    addTaskLabel: function (label) {
      this.$store.commit('addTaskLabel', label)
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
    getUrl: function (file) {
      var blob = new Blob([file])
      var url = URL.createObjectURL(blob)
      return url
    },
    checkSubtask: function (checkId) {
      this.$store.commit('checkSubtask', checkId)
    },
    updateCheckName: function (e, checkId) {
      this.$store.commit('updateCheckName', {val: e.target.value, checkId})
    },
    assignToTask: function (val) {
      this.$store.commit('assignToTask', val)
    },
    close: function () {
      this.$store.commit('closeTaskViewAndAdd')
    },
    updateDeadline: function (val) {
      this.$store.commit('updateDeadline', val)
    },
    deleteTask: function () {
      this.$store.commit('deleteTask')
    },
    updateDescription: function (e) {
      this.$store.commit('updateDescription', e.target.value)
    },
    addCheck: function () {
      this.$store.commit('addCheck')
    },
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
</style>
