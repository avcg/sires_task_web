<template lang="pug">
  s-dialog(:open='open', title='Добавить проект', @close='closeDialog')
    template
      s-input(v-model='name', label='Название проекта')
      s-select(label='Пригласить участников', :items='users')
      .block
        .label Срок прокета
        .fl
          s-menu.date-cont(disableInnerClick, right)
            .date
              span(v-if='dateStart') {{dateStart.split('-').reverse().join('.')}}
              span(v-else) Дата начала
              i.la.icon 
            template(v-slot:menu='')
              date-pick(
                @input='updateStart'
                :hasInputElement="false",
                nextMonthCaption='След месяц',
                prevMonthCaption=' Пред месяц',
                :weekdays='weekdaysTranslate',
                :months='monthsTranslate')
          s-menu.date-cont(disableInnerClick, right)
            .date
              span(v-if='dateEnd') {{dateEnd.split('-').reverse().join('.')}}
              span(v-else) Дата конца
              i.la.icon 
            template(v-slot:menu='')
              date-pick(
                @input='updateDeadline'
                :hasInputElement="false",
                nextMonthCaption='След месяц',
                prevMonthCaption=' Пред месяц',
                :weekdays='weekdaysTranslate',
                :months='monthsTranslate')
    template(v-slot:actions='')
      .spacer
      s-btn(:disabled='!name&&!dateStart&&!dateEnd', @click='addProject') Добавить
</template>
<script>
export default {
  computed: {
    open: function () {
      return this.$store.state.projectDialog
    }
  },
  methods: {
    closeDialog: function () {
      this.$store.commit('closeProjectDialog')
    },
    updateDeadline: function (val) {
      this.dateEnd = val
    },
    updateStart: function (val) {
      this.dateStart = val
    },
    addProject: function () {
      const body = {
        name: this.name,
        deadline: this.dateEnd,
        start: this.dateStart
      }
      this.$store.commit('addProject', body)
      this.closeDialog()
    }
  },
  data () {
    return {
      name: '',
      dateStart: '',
      dateEnd: '',
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
      ],
      users: [
        'Максим Зуевский',
        'Владимир Трояновский',
        'Антон Подосинников',
        'Анастасия Хвостова'
      ]
    }
  }
}
</script>
<style lang="sass" scoped>
  .label
    font-size: 14px
    color: #252631
    margin-bottom: 13px
  .block
    width: 100%
  .date
    height: 52px
    border-width: 0
    border: solid 1px #e8ecef
    background-color: #ffffff
    display: flex
    align-items: center
    box-sizing: border-box
    background: #fff
    font-size: 14px
    font-weight: 500
    color: #1b1e24
    border-radius: 4px
    outline: none
    margin-bottom: 21px
    justify-content: space-between
    padding: 0 16px
    flex: 1
    &-cont
      flex: 1
</style>
