import Language from './Language'

class App extends Language {

  constructor() { super(); }

  /**
   * 
   */
  // listen() {
  //   setInterval(async () => {
  //     try {
  //       let { status, code, message, result } = await this.request({
  //         url: '/sync',
  //         method: 'GET'
  //       })
  
  //       if (status == 'error') {
  //         throw message;
  //       }

  //       if (!result.auth) this.sync({ build: true });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, 30000);
  // }

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

    this.window.onresize = (event) => {
      this.resize(event);
    };
    // this.listen();
  }
}

export default async function (Vue) {
  const app = new App()
  await app.build()
  Vue.config.globalProperties.$app = app
}