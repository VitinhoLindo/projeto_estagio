import Language from './Language'

class App extends Language {

  constructor() { super(); }

  async build() {
    await this.navigatorLanguage()
  }
}

export default async function (Vue) {
  const app = new App()
  await app.build()
  Vue.config.globalProperties.$app = app
}