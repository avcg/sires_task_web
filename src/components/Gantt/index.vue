<template lang="pug">
  .cont
    svg#gantt
</template>
<script>
/* eslint-disable */
export default {
  computed: {
    getTasks: function() {
      return this.$store.state.tasks.map(item=>{
        item.progress=100
        return item
      })
    }
  },
  mounted() {
    var tasks = this.getTasks
    var gantt = new Gantt("#gantt", tasks);
  }
}
</script>
<style lang="sass" scoped>

</style>
