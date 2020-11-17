const { Router } = require('express');
const route = Router();
const MarkController = require('../app/http/controllers/MarkController');

route.get('/', (req, res) => {
  MarkController.using(req, res).get();
});

route.post('/', (req, res) => {
  MarkController.using(req, res).post();
});

route.put('/', (req, res) => {
  MarkController.using(req, res).put();
});

route.delete('/', (req, res) => {
  MarkController.using(req, res).delete();
});

module.exports = {
  route: '/mark',
  use: route
};
