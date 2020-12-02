<template>
<div>
  <app-menu v-if="authenticated" />
  <loading />
  <error />
  <div class="content-page" v-if="authenticated">
    <router-view />
  </div>
  <app-login v-if="!authenticated" />
</div>
</template>

<script>
export default {
  name: 'main',
  data() {
    return {
      authenticated: false
    }
  },
  mounted() {
    this.$app.on('authentication', this.auth);
    this.$app.emit('check-auth');
  },
  methods: {
    auth(bool) {
      this.authenticated = bool;
    }
  },
}
</script>

<style lang="scss">
html,
body {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;

  .content-page {
    position: absolute;
    top: calc(0px + 40px);
    left: 0px;
    width: 100%;
    height: calc(100% - 40px);
  }
}

.itens {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel {
  width: 95%;
  height: 95%;
}


*::-webkit-scrollbar-track {}
*::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background-color: #ffffff;
}
*::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px #aaaaaa;
    background-color: #aaaaaa;
}
</style>
