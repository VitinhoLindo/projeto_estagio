const BaseController = require('./MainController');
const Mark = require('../../Mark');

class MarkController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return MarkController;
  }
  
  //
  async get() {
    let marks = await Mark.instance().get();
    return this.defaultResponseJSON({ result: { marcas: marks } });
  }

  async post() {
    let cache = this.app.getCache(this.request.socket.remoteAddress);

    if (!cache || !cache.cryptoGenerate) {
      return this.defaultResponseJSON({ code: 500, message: 'encrypt expired', result: { expiredCrypto: true } });
    }

    let all = this.all();
    let decrypted = {};

    try {
      decrypted = await this.decryptObject(all);
    } catch (error) {  }

    if (Object.keys(all).length > Object.keys(decrypted).length) {
      return this.defaultResponseJSON({ code: 500, message: 'encrypt expired', result: { expiredCrypto: true } });
    }

    let validator = this.Validator.make(decrypted, Mark.getModel(), { 
      nome: {
        required: 'nome is required',
        string: 'nome type is string'
      } 
    });

    if (validator.fails()) {
      return this.defaultResponseJSON(validator.modelResponse());
    }
    
    let inserted = await Mark.instance().insert(decrypted);
    inserted = await this.encryptObject(inserted);

    return this.defaultResponseJSON({ result: { ...inserted } });
  }
}

module.exports = MarkController;