const BaseController = require('./MainController');
const Mark = require('../../Mark');

class MarkController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return MarkController;
  }

  async put() {
    try {
      if (!this.cacheCrypto()) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let all = this.all();
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, {
        id: 'required|interger'
      });

      if (validator.fails()) throw { code: 400, message: 'bad request, check params' }

      let value = await Mark.instance().where({ 'column': 'id', value: all.id }).first();
      if (!value) throw { code: 400, message: 'bad request' }

      delete all.id;
      if (!Object.keys(all).length) throw { code: 400, message: 'bad request' };
      value = await Mark.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at || value.created_at);
      for(let key in value) {
        if (all[key]) value[key] = all[key];
        else value[key] = value[key];
      };

      await Mark.encryptOrDecrypt(value, this.app, 'encrypt', new Date());
      await value.save();

      value = await Mark.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at);
      value = await this.encryptOrDecrypt(value.toJSON(), 'encrypt');

      return this.defaultResponseJSON({ result: { ...value } });
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
      } catch (error) {
        throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      }
      
      let validator = this.Validator.make(all, { 
        id: 'required|interger' 
      });
      
      if (validator.fails()) throw { code: 400, message: 'bad request' };
      
      let value = await Mark.instance().where({ 'column': 'id', value: all.id }).first();

      try {
        await value.delete();
  
        return this.defaultResponseJSON();
      } catch (error) {
        if (error.errno == 1451) {
          throw { code: 400, message: 'sorry not possible' };
        } else {
          throw { code: 400, message: 'bad request' };
        }
      }
    } catch (error) {
      return this.sendError(error);
    }
  }
  
  async get() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let all = this.all();
      
      if (!Object.keys(all).length) {
        let marks = await Mark.instance().get();
        await marks.decrypt(this.app, 'decrypt');
        
        try {
          return this.defaultResponseJSON({ result: await this.encryptOrDecrypt(marks.toArray(), 'encrypt') });
        } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
      }
 
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, { 
        id: 'required|interger|min:1' 
      }, { 
        id: {
          required: 'id is required',
          string: 'id type is string encrypted'
        } 
      });

      if (validator.fails()) throw validator.modelResponse();

      let mark = await Mark.instance().where({ column: 'id', value: parseInt(all.id) }).get();
      await mark.decrypt(this.app, 'decrypt');

      try {
        mark = await this.encryptOrDecrypt(mark.first().toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...mark } }); 
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
    } catch(error) {
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
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, {
        nome: 'required|string|min:5'
      }, { 
        nome: {
          required: 'nome is required',
          string: 'nome type is string'
        } 
      });

      if (validator.fails()) {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      all = await Mark.encryptOrDecrypt(all, this.app, 'encrypt', new Date());
      
      let inserted = await Mark.instance().insert(all);
      await Mark.encryptOrDecrypt(inserted, this.app, 'decrypt', inserted.updated_at || inserted.created_at);

      try {
        inserted = await this.encryptOrDecrypt(inserted.toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...inserted } });
      } catch (error) { throw { code: 500 }; }
    } catch (error) {
      return this.sendError(error);
    }
  }
}

module.exports = MarkController;