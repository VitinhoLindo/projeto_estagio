<template>
  <div class="marks">
    <app-add @add-click="click" />

    <create-mark v-if="createMark" @created-mark="created" @cancel="cancel" />
  </div>
</template>

<script>
export default {
  name: 'Mark',
  mounted() {
    this.getData();
  },
  data() {
    return {
      createMark: false      
    }
  },
  methods: {
    async getData() {},
    async created(event, resouce) {
      console.log(event, resouce);
      this.createMark = false;
      await this.$app.sleep(5);
      this.$app.emit('loading', { on: false });
    },
    click(event) {
      this.createMark = true;
    },
    cancel(event) {
      this.createMark = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.marks {
  width: 100%;
  height: 100%;
  background-color: rgba($color: #34495e, $alpha: 1);
}
</style>