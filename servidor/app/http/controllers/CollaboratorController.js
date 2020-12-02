const BaseController = require('./MainController');
const Collaborator = require('../../Collaborator');

class CollaboratorController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return CollaboratorController;
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
  
  async get() {
    try {
      if (!this.cacheCrypto()) throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } };
      if (!(await this.authentication())) {
        return this.defaultResponseJSON({ code: 403, message: 'authentication expired', result: { authentication: true } });
      }

      let collaborators = await Collaborator.instance().get();
      await collaborators.decrypt(this.app, 'decrypt');

      try {
        return this.defaultResponseJSON({ result: await this.encryptOrDecrypt(collaborators.toArray(), 'encrypt') });
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
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, {
        nome: 'required|string',
        cpf: 'required|string',
        email: 'required|string'
      }, { 
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

      if (validator.fails()) {
        let model = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      all = await Collaborator.encryptOrDecrypt(all, this.app, 'encrypt', new Date());
      let inserted = await Collaborator.instance().insert(all);
      await Collaborator.encryptOrDecrypt(inserted, this.app, 'decrypt', inserted.updated_at || inserted.created_at);

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