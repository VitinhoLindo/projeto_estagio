const BaseController = require('./MainController');
const Iten = require('../../Iten');

class ItenController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return ItenController;
  }

  async get() {
    let itens = Iten.instance();
    let iten = await itens.get();
    return this.defaultResponseJSON({ result: { iten } });
  }

  async post() {
    let validator = this.Validator.make(this.all(), Iten.getModel());

    if (validator.fails()) {
      return this.defaultResponseJSON(validator.modelResponse());
    }

    return this.defaultResponseJSON();
  }
}

module.exports = ItenController;