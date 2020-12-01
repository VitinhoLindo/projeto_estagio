const BaseController = require('./MainController');
const Rent = require('../../Rent');

class RentController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return RentController;
  }

  async option() {
    return this.defaultResponseJSON();
  }
  
  async get() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      let rents = await Rent.instance().get();  
      await rents.decrypt(this.app,'decrypt');

      try {
        rents = await this.encryptOrDecrypt(rents.toArray(), 'encrypt');
  
        return this.defaultResponseJSON({ result: rents });
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
    } catch (error) {
      return this.sendError(error);
    }
  }

  async post() {
    try {
      let all = this.all();

      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let model = Rent.getModel();
      delete model.id;
      let validator = this.Validator.make(all, model);

      if (validator.fails() && validator.failedField != 'id') {
        model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      all.expiration_at = new Date(all.expiration_at);
      all = await Rent.encryptOrDecrypt(all, this.app, 'encrypt', new Date());
      let inserted = await Rent.instance().insert(all);
      await Rent.encryptOrDecrypt(inserted, this.app, 'decrypt', inserted.updated_at || inserted.created_at);

      try {
        inserted = await this.encryptOrDecrypt(inserted.toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...inserted } });
      } catch (error) { throw { code: 500, message: 'Internal server error' }; }
    } catch (error) {
      return this.sendError(error);
    }
  }

  async put() {
    try {
      let all = this.all();
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, {
        id: 'required|interger',
        expiration_at: 'required|datetime'
      });

      if (validator.fails()) {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      let value = await Rent.instance().where({ column: 'id', value: all.id }).first();
      if (!value) throw { code: 404, message: 'don\'t found' };
      
      await Rent.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at || value.created_at);
      value.expiration_at = new Date(all.expiration_at);
      await Rent.encryptOrDecrypt(value, this.app, 'encrypt', value.updated_at || value.created_at);
      await value.save();

      try {
        await Rent.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at || value.created_at);
        value = await this.encryptOrDecrypt(value.toJSON(), 'encrypt');

        return this.defaultResponseJSON({ result: { ...value } });
      } catch (error) { throw { code: 500, message: 'bad encrypt' }; }
    } catch (error) {
      return this.sendError(error);
    }
  }

  async delete() {
    // try {
    //   let all = this.all();
  
    //   if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

    //   try {
    //     all = await this.encryptOrDecrypt(all, 'decrypt');
    //   } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

    //   let validator = this.Validator.make(all, {
    //     id: 'required|interger'
    //   });

    //   if (validator.fails()) {
    //     let model = validator.modelResponse();
    //     model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
    //     return this.defaultResponseJSON(model);
    //   }

    //   let value = await Iten.instance().where({ column: 'id', value: all.id }).first();
    //   if (!value) throw { code: 404, message: 'don\'t found' };
    //   await value.delete();

    //   return this.defaultResponseJSON();
    // } catch (error) {
    //   return this.sendError(error);
    // }
  }
}

module.exports = RentController;