<template>
<div class="itens">
  <div class="panel">
    <app-add @add-click="click"></app-add>
    <create-item v-if="createItem" @created-item="created" @cancel="cancel"></create-item>
    
    <div class="content">
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'itens',
  mounted() {
    this.getData();
  },
  data() {
    return {
      createItem: false
    }
  },
  methods: {
    async click(event) {
      this.createItem = true;
    },
    cancel() {
      this.createItem = false;
    },
    created() {
      this.getData();
    },
    async getData() {
      this.$app.emit('loading', { on: true });

      let {
        code,
        status,
        message,
        result
      } = await this.$app.request({
        url: '/itens',
        method: 'get'
      });

      await this.$app.sleep(2);
      this.$app.emit('loading', { on: false });
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
