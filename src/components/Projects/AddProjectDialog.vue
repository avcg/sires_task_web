<template lang="pug">
a-modal(:visible="open" title="Добавить проект"
        cancelText="Отменить" okText="Добавить"
        @cancel="closeDialog" @ok="addProject")
  a-input(v-model="name" size="large" placeholder="Название проекта")
</template>

<script>
export default {
  computed: {
    open() {
      return this.$store.state.projectDialog;
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit('closeProjectDialog');
    },
    addProject() {
      this.$store.dispatch('addProject', this.name);
      this.closeDialog();
    },
  },
  data() {
    return {
      name: '',
      dateStart: '',
      dateEnd: '',
      weekdaysTranslate: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      monthsTranslate: [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
      ],
      users: [
        'Максим Зуевский',
        'Владимир Трояновский',
        'Антон Подосинников',
        'Анастасия Хвостова',
      ],
    };
  },
};
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
