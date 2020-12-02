const BaseController = require('./MainController');
const Login = require('../../Login');

class AuthController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return AuthController;
  }

  //
  async post() {
    try {
      let all = this.all();
      
      try {
        all = await this.encryptOrDecrypt(all, 'decrypt');
      } catch (error) { throw { code: 500, message: 'encrypt expired', result: { expiredCrypto: true } } }

      let validator = this.Validator.make(all, {
        email: 'required|string',
        senha: 'required|string'
      });

      if (validator.fails()) {
        let model    = validator.modelResponse();
        model.result = await this.encryptOrDecrypt(model.result, 'encrypt');
        throw model;
      }

      let login = await Login.instance().where({ column: 'email', value: all.email }).first();
      if (!login) throw { code: 400, message: 'bad request', result: { error: { email: 'user not exists' } } };

      if (login.email == all.email && login.senha == all.senha) {
        let auth;
        try {
          auth = await this.app.encrypt(
            JSON.stringify({
              date: new Date(),
              id: login.id
            })
          );
        } catch (error) { throw { code: 500, message: 'internal server error' }; }
        return this.defaultResponseJSON({ result: await this.encryptOrDecrypt({ auth }, 'encrypt') });
      } else {
        throw { code: 400, message: 'bad request', result: { error: { email: 'user not exists' } } }
      }
    } catch (error) {
      return this.sendError(error);
    }
  }
}

module.exports = AuthController;