import Language from './Language'

class App extends Language {

  constructor() { super(); }

  checkAuth() {
    this.emit('authentication', !!this.auth);
  }

  /**
   * funções que necessitam ser carregadas na inicialização do app
   * 
   * this.navigatorLanguage()[Promise]["obtem linguagem padrão do navegador e busca 
   *                                    labels com a linguagem configurada, se não
   *                                    tiver retorna o padrão dos servidor que é
   *                                    pt-BR"];
   * this.generateKeys()     [Promise]["cria uma chave publica e privada para o app"]
   */
  async build() {
    await this.navigatorLanguage()
    await this.generateKeys()
    await this.sync({ build: true });

    this.on('check-auth', () => this.checkAuth());

    this.window.onresize = (event) => {
      this.resize(event);
    };
  }
}

export default async function (Vue) {
  const app = new App()
  await app.build()

  Vue.config.globalProperties.$app = app
}