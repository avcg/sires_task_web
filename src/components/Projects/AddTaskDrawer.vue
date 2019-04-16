<template lang="pug">
  a-drawer(
    title='Добавить таск'
    placement='right'
    @close='close'
    :visible='open'
    width='500'
  )
    a-row
      a-col
        a-input(placeholder='Название проекта', v-model='name')
    a-row
      a-col
        AssignTabs
    a-row(type="flex" justify="space-between")
      a-col(:span='5')
        a-select(defaultValue='Входящие')
      a-col(:span='16')
        a-range-picker
    a-row
      a-col
        .headline Описание
    a-row
      a-col
        a-textarea(placeholder='Опишите вашу задачу', v-model='description')
    a-row
      a-col
        .headline Приложения
    a-row
      a-col
        a-upload-dragger(name='file', :multiple='true')
          p.ant-upload-drag-icon
            a-icon(type='inbox')
          p.ant-upload-text Нажмите или перетащите файл в эту область
    .actions
      a-button.cancel(@click='close') Отменить
      a-button(@click='onClose', type='primary', :disabled='!name', size='large') Добавить

</template>
<script>
import AssignTabs from '../Tasks/view/AssignTabs.vue'

export default {
  props: [ 'open' ],
  components: { AssignTabs },
  data() {
    return {
      name: null,
      dates: [new Date, new Date],
      description: null,

    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="sass" scoped>
.headline
  margin: 10px 0
  font-size: 18px
  color: #252631
.actions
  position: absolute
  left: 0
  bottom: 0
  width: 100%
  border-top: 1px solid #e9e9e9
  padding: 10px 16px
  background: #fff
  text-align: right
  .cancel
    margin-right: 8px
</style>
