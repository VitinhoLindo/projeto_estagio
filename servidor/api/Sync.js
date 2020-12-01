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
  route: '/75c75efe327a8ef35a072f25117961f5b99e35035dc9bd86493dd29fd7bc07eb',
  use: route
};
