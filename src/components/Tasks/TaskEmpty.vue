<template lang="pug">
.empty
  .cont
    img(src="@/assets/img/tasks-empty.svg")
    h2 Не нашли задач?
    p Попробуйте назначить больше задач для сотрудников или создать проект
</template>

<script>
export default {
};
</script>

<style lang="sass" scoped>
.empty
  height: calc(100% - 21px)
  display: flex
  transition: width .5s
  align-items: center
  justify-content: center
  h2
    font-size: 20px
    font-weight: normal
    text-align: center
    color: #252631
    margin-top: 41px
  p
    margin: 0 auto
    margin-top: 8px
    max-width: 369px
    font-family: Rubik
    font-size: 18px
    font-weight: 300
    line-height: 1.39
    text-align: center
    color: #778ca2
</style>
