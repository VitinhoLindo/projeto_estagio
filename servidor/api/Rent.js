const { Router } = require('express');
const route = Router();
const RentController = require('../app/http/controllers/RentController');

route.options('/', (req, res) => {
  RentController.using(req, res).option();
});

route.get('/', (req, res) => {
  RentController.using(req, res).get();
});

route.get('/:id', (req, res) => {
  RentController.using(req, res).get();
});

route.post('/', (req, res) => {
  RentController.using(req, res).post();
});

route.put('/', (req, res) => {
  RentController.using(req, res).put();
});

module.exports = {
  route: '/re',
  use: route
};
