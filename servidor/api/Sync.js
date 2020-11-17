const { Router } = require('express');
const route = Router();
const SyncController = require('../app/http/controllers/SyncController');

route.get('/', (req, res) => {
  SyncController.using(req, res).get();
});

route.post('/', (req, res) => {
  SyncController.using(req, res).post();
});

module.exports = {
  route: '/sync',
  use: route
};
