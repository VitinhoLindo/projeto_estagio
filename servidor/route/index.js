const App = require('../app');
const Middlaware = require('../app/http/middleware');
const Api = require('../api');
const express = require('express');

module.exports = function (app = App(), server = express()) {
  const credential = (request = express.request, response = express.response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Credentials', false);
    response.setHeader('Server', 'Nodejs');

    request.getApp = () => {
      return app;
    };
    next();
  }

  const loggable = function (request = express.request, response = express.response, next) {
    app.emit('print', [{ message: 'new request:', color: 'green' }, { message: ` ${request.method} `, color: 'yellow' }, { message: request.url, color: 'white' }])
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

  server.use(Api.Root.route, Api.Root.use);
  server.use(Api.Language.route, Api.Language.use);
  server.use(Api.Iten.route, Api.Iten.use);
  server.use(Api.Sync.route, Api.Sync.use);
  server.use(Api.Mark.route, Api.Mark.use);

  return this;
}