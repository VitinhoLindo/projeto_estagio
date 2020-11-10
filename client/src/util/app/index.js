import Cache from './Cache'

class App extends Cache {

  constructor() { super(); }

  async build() {
  }
}

export default async function (Vue) {
  const app = new App()
  await app.build()
  Vue.config.globalProperties.$app = app
}