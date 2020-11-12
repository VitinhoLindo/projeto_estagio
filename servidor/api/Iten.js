const { Router } = require('express');
const route = Router();
const ItenController = require('../app/http/controllers/ItenController');

route.get('/', (req, res) => {
  ItenController.using(req, res).get();
});

route.get('/:id', (req, res) => {
  ItenController.using(req, res).get();
});

module.exports = {
  route: '/itens',
  use: route
};
