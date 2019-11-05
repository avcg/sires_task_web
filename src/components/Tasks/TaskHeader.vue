<template lang="pug">
.headline
  .filters
    .filter
      a-icon(type="filter")
      span.name СОРТИРОВКА:
      a-select.select(:defaultValue="0" @change="changeSort")
        a-select-option(v-for="(sortType, i) in sort" :key="`sort${i}`" :value="i") {{ sortType.name }}
      //- a-checkbox.ml-10(@change="changeImIn" :defaultChecked='true') Мои задачи
      a-input-group.ml-10(compact v-if='users')
        a-select(:defaultValue='defaultSortId', showSearch optionFilterProp="children" :filterOption="filterOption", style='width: 160px;' @change='changeSortUser')
          a-select-option(v-for='user in users' :value='user.value') {{user.label}}
        a-select(:defaultValue='defaultSortRole', style='width: 160px;' @change='changeSortRole')
          a-select-option(value='all') Все
          a-select-option(value='assignator') Постановщик
          a-select-option(value='observer') Наблюдатель
          a-select-option(value='co-responsible') Соисполнитель
          a-select-option(value='resposible') Ответсвенный
        //- a-cascader.ml-10(notFoundContent="Нет пользователей с таким именем" :options='users', :showSearch='{filter, limit: false}', @change='changeSortByUser', placeholder='Фильтр по польз.' v-model='sortRole')
        //-   a-input(placeholder='Фильтр по польз' v-model='cscInp' @focus='focusInput' @blur='blurInput')
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
      sortRole: [],
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
  computed: {
    defaultSortRole() {
      const local = localStorage[`ibmkfilter${this.$route.path}Role`];
      if (local) return local;
      return 'all';
    },
    defaultSortId() {
      const local = localStorage[`ibmkfilter${this.$route.path}Id`];
      if (local) {
        const parsed = parseInt(local, 10);
        if (isNaN(parsed)) return local;
        return parsed;
      }
      if (this.$store.state.user.role === 'admin') return 'all';

      return this.$store.state.user.id;
    },
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
      this.sortRole = [this.defaultSortId, this.defaultSortRole];
      this.users = resp.data.users.map((i) => ({
        value: i.id,
        label: `${i.first_name} ${i.last_name}`,
        children: defaultPrefab,
      }));
      this.users.unshift({
        label: 'Все',
        value: 'all',
      });

      this.$emit('sortByUser', this.sortRole);
    });
  },
  methods: {
    changeSortUser(val) {
      this.sortRole[0] = val;
      localStorage[`ibmkfilter${this.$route.path}Id`] = val;
      this.$emit('sortByUser', this.sortRole);
    },
    changeSortRole(val) {
      this.sortRole[1] = val;
      localStorage[`ibmkfilter${this.$route.path}Role`] = val;
      this.$emit('sortByUser', this.sortRole);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    changeSortByUser() {
      this.$emit('sortByUser', this.sortRole);
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
