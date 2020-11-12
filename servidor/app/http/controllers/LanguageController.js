const BaseController = require('./MainController');

class LanguageController extends BaseController {
  defaultLang = 'pt-BR';

  constructor(req, res) { super(req, res); }

  static estance() {
    return LanguageController;
  }
  
  async option() {
    return this.defaultResponseJSON({ result: { lang: 'string' } });
  }
  //
  async get() {
    let all = this.all();
    let validator = this.Validator.make(all, { lang: 'string' }, { lang: { string: 'locale format ex: \'pt-BR\',\'en\' ' } });

    if (validator.fails()) {
      return this.defaultResponseJSON(validator.modelResponse());
    }

    if (all.lang) {
      try {
        let dir = this.app.getLangDir(`${all.lang}.json`);
        let file = await this.app.getFile(dir);
  
        return this.defaultResponseJSON({ result: { lang: all.lang, labels: JSON.parse(file) } });
      } catch (error) {
        let dir = this.app.getLangDir(`${this.defaultLang}.json`);
        let file = await this.app.getFile(dir);
  
        return this.defaultResponseJSON({ result: { lang: this.defaultLang, labels: JSON.parse(file) } });
      }
    } else {
      let dir = this.app.getLangDir();
      dir = await this.app.readdir(dir);

      return this.defaultResponseJSON({ result: dir });
    }
  }
}

module.exports = LanguageController;