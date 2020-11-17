<template>
<div>
  <app-menu />
  <div class="content-page">
    <loading />
    <error />
    <router-view />
  </div>
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

.itens {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel {
  // .add {
  //   width: 95%;
  //   height: 45px;
  //   display: flex;
  //   // justify-content: center;
  //   align-items: center;

  //   div {
  //     border-top-left-radius: 5px;
  //     border-top-right-radius: 5px;
  //     width: 100px;
  //     height: 35px;
  //     margin: auto 5px;
  //     background-color: #ffffff;
  //   }
  // }
  // margin: 2.5%;
  width: 95%;
  height: 95%;
}
</style>
