<template lang="pug">
  .add
    .header
      .title
        i.la.icon 
        span ОТМЕТИТЬ КАК СДЕЛАННОЕ
      .spacer
      .delete(@click='deleteTask')
        i.la.icon &#xf34c;
      .close(@click='close')
        i.la.icon &#xf191;
    .divider
    .body
      .labels
        a-tag(v-for='taskLabel in actualTask.labels', color="orange") {{taskLabel.name}}
        a-popover(placement='bottomLeft',title="Добавить тег")
          a-tag(@click='tagPopover=true') +
          div()
            a-tag(v-for='taskLabel in actualTask.labels', color="orange") {{taskLabel.name}}
      .head-input
        input.input-name(placeholder='Название задачи' :value="actualTask.name" @input="updateName" @keyup.enter='parseForLabelAndProj')
      .fl-jsb
        a-select( defaultValue='Входящие' @change='setTaskProject')
          a-select-option(v-for='proj in allProjects',:value='proj', :key='proj.name') {{proj.name}}
        a-locale-provider(:locale='locale')
          a-range-picker(
            format='DD MMM YYYY',
            :allowClear="false",
            :value='[moment(actualTask.dates[0], "YYYY-MM-DD"), moment(actualTask.dates[1], "YYYY-MM-DD")]',
            @change='dateChange'
          )
      AssignTabs
      .desc-input
        .headline Описание
        textarea-autosize(placeholder='Опишите вашу задачу' :value='actualTask.description' @input.native="updateDescription")
      .check-input
        .headline Чек-лист
        transition-group(name="list-complete", enter-active-class="animated fast slideInRight")
          .check-item(v-for='item,index in actualTask.checks', :key='item.id')
            .check(@click='checkSubtask(item.id)', :style='{ backgroundColor: item.checked ? "$primary-color" : "#e8ecef" }')
              i.la.icon(v-if='item.checked') &#xf17b;
            .name
              input(:value='item.name' @input='updateCheckName($event, item.id)' placeholder='Введите название подзадачи')
          .check-item.add-check(@click='addCheck', key='add123')
            i.la.icon 
            .name Добавить
      .attachments
        .headline Приложения
        a.attachment(v-for='item in actualTask.docs' :href='getUrl(item.file)' :download='item.name')
          i.la.icon &#xf1ec;
          span {{item.name}}
        input(type="file" @change='addDoc' ref="file" style="display: none")
        .addAttach(@click="$refs.file.click()")
          i.la.icon 
          span Прикрепить файл
      activity(:items='actualTask.activity')
      add-comment
</template>
<script>
import AssignTabs from './view/AssignTabs.vue'
import AddComment from './view/AddComment.vue'
import Activity from './view/Activity.vue'
import ruRU from 'ant-design-vue/lib/locale-provider/ru_RU'

export default {
  components: { AssignTabs, AddComment, Activity },
  computed: {
    actualTask: function () {
      return this.$store.getters.actualTask
    },
    allProjects: function () {
      return this.$store.state.projects
    },
    allLabels: function () {
      return this.$store.state.labels
    }
  },
  methods: {
    changeProj: function (val) {
      console.log(val)
    },
    dateChange: function (val) {
      this.$store.commit('updateTaskDates', val)
    },
    parseForLabelAndProj: function (e) {
      this.projects = [ ...this.projects, ...e.target.value.match(/#[a-z\d-]+/ig) ]
      this.$store.commit('updateName', e.target.value.replace(/#[a-z\d-]+/ig, ''))
    },
    addTaskLabel: function (label) {
      this.$store.commit('addTaskLabel', label)
    },
    setTaskProject: function (project) {
      this.$store.commit('setTaskProject', project)
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
    updateName: function (e) {
      this.$store.commit('updateName', e.target.value)
    },
    addCheck: function () {
      this.$store.commit('addCheck')
    },
    addDoc: function (e) {
      this.$store.commit('addDocument', {
        name: e.target.files[0].name,
        file: e.target.files[0]
      })
    }
  },
  data () {
    return {
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
  height: calc(100vh - 172px)
  background-color: #ffffff
  transition: width .5s
  overflow: hidden
  display: flex
  flex-direction: column
  white-space: nowrap
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
      margin-top: 30px
      .headline
        margin-bottom: 20px
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
      textarea
        margin-top: 14px
        white-space: nowrap
        padding: 0
        border: 0
        resize: none
        width: 100%
        outline: none
        font-size: 14px
        line-height: 1.5
        color: #252631
        &::placeholder
          color: #98a9bc
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
