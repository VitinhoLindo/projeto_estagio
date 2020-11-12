const MyEvent = require('./event')

class Modules extends MyEvent {
  process    = require('process');
  os         = require('os');
  http       = require('http');
  https      = require('https');
  fs         = require('fs');
  express    = require('express');
  app        = this.express();
  bodyParser = require('body-parser');
  paths      = {};

  constructor() { super(); }
}

module.exports = Modules;