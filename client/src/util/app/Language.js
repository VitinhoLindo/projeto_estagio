import Cache from './Cache'

class Language extends Cache {
  constructor() { super(); }

  $lang() {
    return this.language;
  }

  $langs() {
    return this.languages;
  }

  async setLanguageOptions() {
    let { message, result, code, status } = await this.request({
      url: this.paths.language.path,
      method: this.paths.language.method,
    });

    this.languages = result;
  }

  async getLang(lang) {
    let { message, result, code, status } = await this.request({
      url: this.paths.language.path,
      method: this.paths.language.method,
      params: { lang: lang }
    });

    if (status == 'error') {
      return;
    }

    this.language = result;
    this.emit('language-changed');
  }

  async navigatorLanguage() {
    this.language.lang = this.window.navigator.language;
    await this.getLang(this.language.lang);
    await this.setLanguageOptions();
  }
}

export default Language;