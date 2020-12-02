class Config {

  static get() {
    let model = {
      type: 'http',
      listen: {
        host: '127.0.0.1',
        port: '80'
      },
      ssl: {
        key: '',
        cert: ''
      }
    }

    try {
      throw '';
      const fs = require('fs');

      let key  = fs.readFileSync(`${__dirname}/ssl/server.key`);
      let cert = fs.readFileSync(`${__dirname}/ssl/server.cert`);

      model.ssl = { key, cert };
      model.type = 'https'
    } catch (error) { }

    try {
      const process = require('process');
      if (process.env.HOST) model.listen.host = process.env.HOST;
      if (process.env.PORT) model.listen.port = process.env.PORT; 
    } catch (error) { }

    return model;
  }
}

module.exports = Config;
