const { Router } = require('express');
const route = Router();
const AuthController = require('../app/http/controllers/AuthController');

route.post('/', (req, res) => {
  AuthController.using(req, res).post();
});

module.exports = {
  route: '/auth',
  use: route
};
