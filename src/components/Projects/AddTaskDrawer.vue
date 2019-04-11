<template lang="pug">
  a-drawer(title='Добавить таск', placement='right', @close='close', :visible='open', width='500')
    a-row
      a-col
        a-input(value='Название проекта')
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
        a-textarea(placeholder='Опишите вашу задачу')
    a-row
      a-col
        .headline Приложения
    a-row
      a-col
        a-upload-dragger(name='file', :multiple='true')
          p.ant-upload-drag-icon
            a-icon(type='inbox')
          p.ant-upload-text Нажмите или перетащите файл в эту область
</template>
<script>
import AssignTabs from '../Tasks/view/AssignTabs.vue'

export default {
  props: [ 'open' ],
  components: { AssignTabs },
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
</style>
