<template>
<app-menu />
<loading />
<error />
<div class="content-page">
  <router-view />
</div>
</template>

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
</style>
