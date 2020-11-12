const BaseController = require('./MainController');

class RootController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return RootController;
  }
  
  //
  async get() {
    return this.defaultResponseJSON({ message: 'success' });
  }
}

module.exports = RootController;