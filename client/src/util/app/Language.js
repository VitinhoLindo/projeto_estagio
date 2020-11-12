import Cache from './Cache'

class Language extends Cache {
  constructor() { super(); }

  async getLang() {
    let { message, result, code, status } = await this.request({
      url: this.paths.language.path,
      method: this.paths.language.method,
      params: { lang: this.language.lang }
    });

    if (status == 'error') {
      return;
    }

    this.language.labels = result;
  }

  navigatorLanguage() {
    this.language.lang = this.window.navigator.language;
    this.getLang();
  }
}

export default Language;