<template lang="pug">
.headline
  .filters
    .filter
      a-icon(type="filter")
      span.name СОРТИРОВКА:
      a-select.select(:defaultValue="0" @change="changeSort")
        a-select-option(v-for="(sortType, i) in sort" :key="`sort${i}`" :value="i") {{ sortType.name }}
      //- a-checkbox.ml-10(@change="changeImIn" :defaultChecked='true') Мои задачи
      a-cascader.ml-10(notFoundContent="Нет пользователей с таким именем" :options='users', :showSearch='{filter, limit: false}', @change='changeSortByUser', placeholder='Фильтр по польз.' :defaultValue='[$store.state.user.id, "all"]')
    //- .filter(v-if="$route.name !== 'Входящие')
    //-   a-icon(type="project")
    //-   span.name Проект:
    //-   a-select.select(defaultValue="datedesc")
    //-     a-select-option(value="datedesc") Любой
    //-     a-select-option(value="alphdesc") от А до Я
    //-     a-select-option(value="alphdesc") от Я до А
  .spacer
  .add(@click="addTask", v-if='!proj')
    i.la.icon 
    span НОВАЯ ЗАДАЧА
</template>

<script>
export default {
  props: ['proj'],
  data() {
    return {
      users: [],
      sort: [
        {
          name: 'По возрастанию дедлайна',
          type: 'date',
          desc: true,
        }, {
          name: 'По убыванию дедлайна',
          type: 'date',
          desc: false,
        }, {
          name: 'от А до Я',
          type: 'alphabet',
          desc: false,
        }, {
          name: 'от Я до А',
          type: 'alphabet',
          desc: true,
        },
      ],
    };
  },
  mounted() {
    const defaultPrefab = [
      {
        label: 'Все',
        value: 'all',
      }, {
        label: 'Постановщик',
        value: 'assignator',
      }, {
        label: 'Ответсвенный',
        value: 'resposible',
      }, {
        label: 'Соисполнитель',
        value: 'co-responsible',
      }, {
        label: 'Наблюдатель',
        value: 'observer',
      },
    ];
    this.axios.get('/users?limit=300').then((resp) => {
      this.users = resp.data.users.map((i) => ({
        value: i.id,
        label: `${i.first_name} ${i.last_name}`,
        children: defaultPrefab,
      }));
      this.users.unshift({
        label: 'Все',
        value: 'all',
      });
    });
  },
  methods: {
    filter(inputValue, path) {
      return path.some(
        (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
      );
    },
    changeSortByUser(val) {
      this.$emit('sortByUser', val);
    },
    changeImIn() {
      this.$emit('imInToggle');
    },
    changeSort(index) {
      this.$emit('sort', this.sort[index]);
    },
    addTask() {
      this.$store.dispatch('addTask');
    },
  },
};
</script>

<style lang="sass" scoped>
.ml-10
  margin-left: 10px
.headline
  display: flex
  .add
    display: flex
    align-items: center
    user-select: none
    color: $primary-color
    font-size: 12px
    i
      color: $primary-color
      font-size: 18px
    &:hover
      cursor: pointer
    span
      margin-left: 5px
      font-weight: 500
  .filters
    display: flex
    align-items: center
    .filter
      display: flex
      align-items: center
      font-size: 12px
      font-weight: 500
      margin-right: 23px
      i
        color: #778ca2
        font-size: 18px
      .name
        color: #778ca2
        margin-left: 6px
        margin-right: 10px
      .select
        min-width: 222px
</style>
