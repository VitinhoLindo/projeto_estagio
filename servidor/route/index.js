const App = require('../app');
const Middlaware = require('../app/http/middleware');
const Api = require('../api');
const express = require('express');
const Login = require('../app/Login');

module.exports = function (app = App(), server = express()) {

  server.use('/', express.static(app.__dirname + '/public/html'));
  server.use('/js', express.static(app.__dirname + '/public/js'));
  server.use('/css', express.static(app.__dirname + '/public/css'));
  server.use('/ico', express.static(app.__dirname + '/public/ico'));
  server.use('/image', express.static(app.__dirname + '/public/image'));

  const credential = (request = express.request, response = express.response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Credentials', false);
    response.setHeader('Server', 'Nodejs');

    request.getUser = async () => {
      let auth = request.headers['authorization'];

      if (!auth) return null;
      else {
        try {
          auth = auth.replace('Bearer ', '');
          auth = await app.decrypt(auth);
          auth = JSON.parse(auth);

          let mt = app.getMtDate(new Date(auth.date));

          if (new Date() >= mt.addHours(5).get()) {
            return null;
          }

          return await Login.instance().where({ column: 'id', value: auth.id }).first();
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    }
    request.getApp = () => {
      return app;
    };
    next();
  }

  const loggable = function (request = express.request, response = express.response, next) {
    let url = request.url.split(/\?/);
    app.emit('print', [{ message: 'new request:', color: 'green' }, { message: ` ${request.method} `, color: 'yellow' }, { message: url[0], color: 'white' }])
    next();
  }

  let middlaware = Middlaware.get();

  middlaware.setMaxRequests(app.process.env.MAXREQUEST);
  middlaware.setTimeListenUsingMinute(app.process.env.RESETINTERVALMINUTE);
  middlaware.listen();

  server.use(app.bodyParser.urlencoded({ extended: true }));
  server.use(app.bodyParser.json());
  server.use((r, s, n) => credential(r, s, n));
  server.use(loggable);
  server.use((r, s, n) => middlaware.validate(r, s, n));

  for(let api of Api) {
    if (!api.route || !api.use) continue;

    server.use(api.route, api.use);
  }

  server.use(function(req, res, next) {
    res.write(`
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <img src="/image/77ec380c9b1860955a475d0002b0d0af.gif" width="250px" height="250px">
          <h1>404 don\'t found</h1>
        <div>
      </div>
    `);

    res.status(404);
    res.end();
  });

  return server;
}
