<template lang="pug">
  .add-comment
    a-comment
      div(slot='content')
        a-form-item
          a-textarea(:rows='4', v-model='text')
        a-form-item
          a-button(htmltype='submit', @click='sendComment', type='primary')
            | Добавить комментарий
</template>
<script>
import ru from '../../../../node_modules/date-fns/locale/ru'
import { format } from 'date-fns'

export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    sendComment: function () {
      const body = {
        text: this.text
      }
      this.$store.dispatch('addTaskComment', body)
      this.text = ''
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
