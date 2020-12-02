const BaseController = require('./MainController');
const Iten = require('../../Iten');

class ItenController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return ItenController;
  }

  async option() {
    return this.defaultResponseJSON();
  }
  
  async get() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let itens = await Iten.instance().get();
      await itens.decrypt(this.app, 'decrypt');
      try {
        itens = await this.encryptOrDecrypt(itens.toArray(), 'encrypt');
        return this.defaultResponseJSON({ result: itens });
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
    } catch (error) {
      return this.sendError(error);      
    }
  }

  async post() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let all = this.all();
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, Iten.getModel());

      if (validator.fails() && validator.failedField != 'id') {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      let data = Iten.getModel(all);
      data = await Iten.encryptOrDecrypt(data, this.app, 'encrypt', new Date());
      let inserted = await Iten.instance().insert(data);
      await Iten.encryptOrDecrypt(inserted, this.app, 'decrypt', inserted.updated_at || inserted.created_at);

      try {
        inserted = await this.encryptOrDecrypt(inserted.toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...inserted } });
      } catch (error) { throw  { code: 500 }; }
    } catch (error) {
      return this.sendError(error);
    }
  }

  async put() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let all = this.all();
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');        
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, {
        id: 'required|interger'
      });

      if (validator.fails()) {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      const id = all.id;
      delete all.id;
      if (!Object.keys(all).length) throw { code: 400, message: 'bad request' };

      let value = await Iten.instance().where({ column: 'id', value: id }).first();
      if (!value) throw { code: 404, message: 'don\'t found' };
      await Iten.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at || value.created_at);
      for(let key in value) {
        if (all[key]) value[key] = all[key];
        else value[key] = value[key];
      };

      await Iten.encryptOrDecrypt(value, this.app, 'encrypt', new Date());
      await value.save();
      
      await Iten.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at);
      value = await this.encryptOrDecrypt(value.toJSON(), 'encrypt');

      return this.defaultResponseJSON({result: { ...value } });
    } catch (error) {
      return this.sendError(error);
    }
  }

  async delete() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let all = this.all();
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, {
        id: 'required|interger'
      });

      if (validator.fails()) {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        return this.defaultResponseJSON(model);
      }

      let value = await Iten.instance().where({ column: 'id', value: all.id }).first();
      if (!value) throw { code: 404, message: 'don\'t found' };

      try {
        await value.delete();
      } catch (error) {
        if (error.errno == 1451) {
          throw { code: 400, message: 'sorry not possible' };
        } else {
          throw { code: 400, message: 'bad request' };
        }
      }

      return this.defaultResponseJSON();
    } catch (error) {
      return this.sendError(error);
    }
  }
}

module.exports = ItenController;