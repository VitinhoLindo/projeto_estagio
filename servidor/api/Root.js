const { Router } = require('express');
const route = Router();
const RootController = require('../app/http/controllers/RootController');

route.get('/', (req, res) => {
  RootController.using(req, res).get();
});

module.exports = {
  route: '/',
  use: route
};
