const { Router } = require('express');
const route = Router();
const LanguageController = require('../app/http/controllers/LanguageController');

route.options('/', (req, res) => {
  LanguageController.using(req, res).option();
});

route.get('/', (req, res) => {
  LanguageController.using(req, res).get();
});

module.exports = {
  route: '/translate',
  use: route
};
