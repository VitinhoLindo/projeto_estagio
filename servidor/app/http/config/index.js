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
      const fs = require('fs');
      
      let key  = fs.readFileSync('./ssl/key.pem', { encoding: 'utf-8' });
      let cert = fs.readFileSync('./ssl/cert.pem', { encoding: 'utf-8' });

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