const BaseController = require('./MainController');
const Mark = require('../../Mark');

class MarkController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return MarkController;
  }

  async put() {
    let all = this.all();
    
    try {
      if (!this.cacheCrypto()) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      try {
        all = await this.encrytOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, {
        id: 'required|interger'
      });

      if (validator.fails()) throw { code: 400, message: 'bad request, check params' }

      let value = await Mark.instance().where({ 'column': 'id', value: all.id }).first();
      if (!value) throw { code: 400, message: 'bad request' }

      delete all.id;
      if (!Object.keys(all).length) throw { code: 400, message: 'bad request' };
      all   = await Mark.encryptOrDecrypt(all, this.app, 'encrypt', new Date());
      value = await Mark.encryptOrDecrypt(value, this.app, 'decrypt', new Date());

      for(let key in value) if (all[key]) value[key] = all[key];

      await value.save();
      value = await Mark.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at);
      value = await this.encrytOrDecrypt(value.toJSON(), 'encrypt');
      return this.defaultResponseJSON({ result: { ...value } });
    } catch (error) {
      console.log(error);
      return this.sendError(error);
    }
  }

  async delete() {
    let all = this.all(); 

    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      try {
        all = await this.encrytOrDecrypt(all, 'decrypt');
      } catch (error) {
        throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      }

      let validator = this.Validator.make(all, { 
        id: 'required|interger' 
      });

      if (validator.fails()) throw { code: 400, message: 'bad request' };

      let value = await Mark.instance().where({ 'column': 'id', value: all.id }).first();
      await value.delete();

      return this.defaultResponseJSON();
    } catch (error) {
      this.sendError(error);
    }
  }
  
  async get() {
    let all = this.all();

    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      if (!Object.keys(all).length) {
        let marks = await Mark.instance().get();
        await marks.decrypt(this.app, 'decrypt');
        
        try {
          return this.defaultResponseJSON({ result: await this.encrytOrDecrypt(marks.toArray(), 'encrypt') });
        } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
      }
 
      try {
        all = await this.encrytOrDecrypt(all, 'decrypt');
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
        mark = await this.encrytOrDecrypt(mark.first().toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...mark } }); 
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
    } catch(error) {
      return this.sendError(error);
    }
  }

  async post() {
    try {
      let all = this.all();
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
  
      try {
        all = await this.encrytOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      if (!Object.keys(all).length) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, Mark.getModel(), { 
        nome: {
          required: 'nome is required',
          string: 'nome type is string'
        } 
      });

      if (validator.fails()) throw validator.modelResponse();

      let data = Mark.getModel(all);
      data = await Mark.encryptOrDecrypt(data, this.app, 'encrypt', new Date());
      
      let inserted = await Mark.instance().insert(data);

      try {
        inserted = await this.encrytOrDecrypt(inserted.toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...inserted } });
      } catch (error) { throw { code: 500 }; }
    } catch (error) {
      return this.sendError(error);
    }
  }
}

module.exports = MarkController;