const Config  = require('./http/config');
const Storage = require('../lib/util/storage');
const Route   = require('../route');

class App extends Storage {
  constructor() { super(); }

  async listen() {
    // obtem as configurações do servidor
    let options = Config.get();

    Route(this, this.app);
    let server = null;

    // options.type = 'http' || 'https'
    switch (options.type) {
      case 'http':
        server = this.http.createServer(this.app);
        break;
      case 'https':
        server = this.http.createServer(options.ssl, this.app);
        break;
    }

    // server listen
    server.listen(options.listen, this.print([{ message: `${options.type}://${options.listen.host}:${options.listen.port}`, color: 'blue' }]));
  }
}

module.exports = function (__dir) {
  try {
    require('dotenv').config();
  } catch (error) {
    throw `plase run 'npm install --save dotenv'`
  }
  
  let app = new App();
  app.setDir(__dir);

  return app;
};