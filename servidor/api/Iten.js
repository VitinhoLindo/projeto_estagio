const { Router } = require('express');
const route = Router();
const ItenController = require('../app/http/controllers/ItenController');

route.options('/', (req, res) => {
  ItenController.using(req, res).option();
});

route.get('/', (req, res) => {
  ItenController.using(req, res).get();
});

route.get('/:id', (req, res) => {
  ItenController.using(req, res).get();
});

route.post('/', (req, res) => {
  ItenController.using(req, res).post();
});

route.put('/', (req, res) => {
  ItenController.using(req, res).put();
});

route.delete('/', (req, res) => {
  ItenController.using(req, res).delete();
});

module.exports = {
  route: '/it',
  use: route
};
