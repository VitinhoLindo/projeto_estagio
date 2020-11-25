const BaseController = require('./MainController');
const Collaborator = require('../../Collaborator');

class CollaboratorController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return CollaboratorController;
  }

  async put() {
    let all = this.all();

    try {
      if (!this.cacheCrypto()) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, {
        id: 'required|interger'
      });

      if (validator.fails()) throw { code: 400, message: 'bad request, check params' };

      let value = await Collaborator.instance().where({ 'column': 'id', value: all.id }).first();
      if (!value) throw { code: 400, message: 'bad request' }

      delete all.id;
      if (!Object.keys(all).length) throw { code: 400, message: 'bad request' };
      

      await Collaborator.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at || value.created_at);
      for(let key in value) {
        if (all[key]) value[key] = all[key];
        else value[key] = value[key];
      };

      await Collaborator.encryptOrDecrypt(value, this.app, 'encrypt', new Date());
      await value.save();

      await Collaborator.encryptOrDecrypt(value, this.app, 'decrypt', value.updated_at || value.created_at);
      value = await this.encryptOrDecrypt(value.toJSON(), 'encrypt');

      return this.defaultResponseJSON({ result: { ...value } });
    } catch (error) {
      return this.sendError(error);
    }
  }

  async delete() {
    try {
      let all = this.all();

      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

      let validator = this.Validator.make(all, {
        id: 'required|interger'
      }, {
        id: {
          required: 'field id is required',
          interger: 'field id type is not interger'
        }
      });

      if (validator.fails()) {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      let value = await Collaborator.instance().where({ column: 'id', value: all.id }).first();
      await value.delete();

      return this.defaultResponseJSON();
    } catch (error) {
      return this.sendError(error);
    }
  }
  
  async get() {
    let all = this.all();

    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

      if (!Object.keys(all).length) {
        let collaborators = await Collaborator.instance().get();
        await collaborators.decrypt(this.app, 'decrypt');

        try {
          return this.defaultResponseJSON({ result: await this.encryptOrDecrypt(collaborators.toArray(), 'encrypt') });
        } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
      }
    } catch (error) {
      return this.sendError(error);
    }

    return this.defaultResponseJSON({ result: [] });
    // let all = this.all();

    // try {
    //   if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };

    //   if (!Object.keys(all).length) {
    //     let marks = await Mark.instance().get();
    //     await marks.decrypt(this.app, 'decrypt');
        
    //     try {
    //       return this.defaultResponseJSON({ result: await this.encryptOrDecrypt(marks.toArray(), 'encrypt') });
    //     } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
    //   }
 
    //   try {
    //     all = await this.encryptOrDecrypt(all, 'decrypt');
    //   } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }

    //   let validator = this.Validator.make(all, { 
    //     id: 'required|interger|min:1' 
    //   }, { 
    //     id: {
    //       required: 'id is required',
    //       string: 'id type is string encrypted'
    //     } 
    //   });

    //   if (validator.fails()) throw validator.modelResponse();

    //   let mark = await Mark.instance().where({ column: 'id', value: parseInt(all.id) }).get();
    //   await mark.decrypt(this.app, 'decrypt');

    //   try {
    //     mark = await this.encryptOrDecrypt(mark.first().toJSON(), 'encrypt');
    //     return this.defaultResponseJSON({ result: { ...mark } }); 
    //   } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } }; }
    // } catch(error) {
    //   return this.sendError(error);
    // }
  }

  async post() {
    try {
      let all = this.all();
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
  
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, Collaborator.getModel(), { 
        nome: {
          required: 'nome is required',
          string: 'nome type is string'
        },
        cpf: {
          required: 'cpf is required',
          string: 'cpf type is string'
        },
        email: {
          required: 'email is required',
          string: 'email type is string'
        }
      });

      if (validator.fails() && validator.failedField != 'id') {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      let data = Collaborator.getModel(all);
      data = await Collaborator.encryptOrDecrypt(data, this.app, 'encrypt', new Date());
      let inserted = await Collaborator.instance().insert(data);
      await Collaborator.encryptOrDecrypt(inserted, this.app, 'decrypt', inserted.created_at);

      try {
        inserted = await this.encryptOrDecrypt(inserted.toJSON(), 'encrypt');
        return this.defaultResponseJSON({ result: { ...inserted } });
      } catch (error) { throw { code: 500 }; }
    } catch (error) {
      return this.sendError(error);
    }
  }
}

module.exports = CollaboratorController;