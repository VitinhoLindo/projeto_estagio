const BaseController = require('./MainController');

class ItenController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return ItenController;
  }
  
  //
  async get() {
    return this.defaultResponseJSON({ message: 'success' });
  }
}

module.exports = ItenController;