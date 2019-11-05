<template lang="pug">
.activity
  .activity-body
    a-list.comment-list(:header="`${comments.length} ответ`" itemLayout="horizontal" :dataSource="comments" :key='tik')
      a-list-item(slot="renderItem" slot-scope="item, index")
        a-comment(:author="`${item.author.first_name} ${item.author.middle_name} ${item.author.last_name}`" :key='`list-item-${index}-${item.edit}`')
          span(slot="actions" @click='editComment(item)') {{item.edit?"Сохранить":"Редактировать"}}
          span(slot="actions" @click='deleteComment(item)') Удалить
          div(slot='content')
            p(v-if='item.edit==false') {{ item.text }}
            div(v-else)
              a-textarea(placeholder="Комментарий" v-model='item.text' :autosize="{ minRows: 1 }")
          a-tooltip(slot="datetime" :title="moment(item.inserted_at).format('DD-MM-YYYY HH:mm:ss')")
            span {{ moment(item.inserted_at).fromNow() }}
    //- .activity-item(v-for="item in items")
    //-   .pin
    //-     img(src="/history_pin.svg")
    //-   .head
    //-     .name {{ item.author.email }}
    //-     .text(v-if="item.type !== 1") {{ item.text }}
    //-     .date {{ fDate(item.updated_at) }}
    //-   .comment(v-if="item.type === 1")
    //-     p {{ item.text }}
</template>

<script>
import { format } from 'date-fns';

export default {
  props: ['items', 'task_id'],
  data() {
    return {
      comments: this.items.map((i) => {
        i.edit = false;
        return i;
      }),
      tik: false,
    };
  },
  watch: {
    items(val) {
      this.comments = val.map((i) => {
        i.edit = false;
        return i;
      });
    },
  },
  methods: {
    deleteComment(item) {
      this.axios.delete(`/tasks/${this.task_id}/comments/${item.id}`).then(() => {
        this.$store.dispatch('reloadTask', this.task_id);
      });
    },
    editComment(item) {
      if (item.edit) {
        this.axios.put(`/tasks/${this.task_id}/comments/${item.id}`, {
          comment: {
            text: item.text,
          },
        });
        item.edit = !item.edit;
        this.tik = !this.tik;
      } else {
        item.edit = !item.edit;
        this.tik = !this.tik;
      }
    },
    fDate(date) {
      return format(date, 'DD-MM-YYYY');
    },
  },
};
</script>

<style lang="sass" scoped>
  .mt-10
    margin-top: 10px
  .activity
    &-body
      margin-top: 20px
      // margin-left: 12px
      // border-left: 3px solid #E9ECEF
    &-item
      padding: 25px 0
      padding-left: 30px
      position: relative
      min-height: 78px
      display: flex
      justify-content: center
      flex-direction: column
      .head
        display: flex
        align-items: center
        .text
          white-space: normal
          margin-left: 5px
      .comment
        margin-left: 45px
        margin-top: 12px
        width: fit-content
        background-color: #f8fafb
        border-radius: 4px
        padding: 12px 15px
        color: #7B8CA0
        p
          white-space: normal
      .name
        margin-left: 10px
        font-weight: 500
      .date
        font-size: 12px
        color: #7B8CA0
        margin-left: 10px
        transform: translateY(2px)
      .pin
        position: absolute
        left: -10px
        top: calc(50% - 39px)
      .user
        width: 36px
        height: 36px
        background-position: center center
        background-size: 100% auto
        border-radius: 50%
    .title
      font-size: 18px
      color: #252631
</style>
