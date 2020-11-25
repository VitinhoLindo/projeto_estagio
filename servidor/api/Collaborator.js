const { Router } = require('express');
const route = Router();
const CollaboratorController = require('../app/http/controllers/CollaboratorController');

route.get('/', (req, res) => {
  CollaboratorController.using(req, res).get();
});

route.get('/:id', (req, res) => {
  CollaboratorController.using(req, res).get();
});

route.put('/', (req, res) => {
  CollaboratorController.using(req, res).put();
});

route.post('/', (req, res) => {
  CollaboratorController.using(req, res).post();
});

route.delete('/', (req, res) => {
  CollaboratorController.using(req, res).delete();
});

module.exports = {
  route: '/collaborators',
  use: route
};
