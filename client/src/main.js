import { createApp } from 'vue'
import Main from './Main.vue'
import Component from './util/component'
import Router from './util/router'
import App from './util/app'

const build = async function () {
  const main = createApp(Main);
  
  main.use(Router);

  /**
   * @param GlobalComponents
   * 
   * 1° qr-code
   */
  Component(main);

  // app is assinconous function;
  await App(main);

  main.mount('#app');
}

build();
