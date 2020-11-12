<template>
<div class="itens">
</div>
</template>

<script>
export default {
  name: 'itens',
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.$app.emit('loading', {
        on: true
      });

      let {
        code,
        status,
        message,
        result
      } = await this.$app.request({
        url: '/itens',
        method: 'get'
      });

      console.log(code,
        status,
        message,
        result
      );
    }
  }
}
</script>

<style lang="scss">
.itens {
  width: 100%;
  height: 100%;
  background-color: rgba($color: #34495e, $alpha: 1);
}
</style>
