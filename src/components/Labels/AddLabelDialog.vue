<template lang="pug">
  a-modal(:visible="open" title="Добавить тег"
          cancelText="Отменить" okText="Добавить"
          @cancel="closeDialog" @ok="addLabel")
    a-input(v-model="name" size="large" placeholder="Название проекта")
</template>

<script>
export default {
  computed: {
    open() {
      return this.$store.state.labelDialog;
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit('closeLabelDialog');
    },
    addLabel() {
      this.$store.dispatch('addTag', this.name);
      this.closeDialog();
    },
  },
  data() {
    return {
      name: '',
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
