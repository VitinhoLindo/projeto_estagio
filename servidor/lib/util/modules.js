const MyEvent = require('./event')

class Modules extends MyEvent {
  process    = require('process');
  os         = require('os');
  http       = require('http');
  https      = require('https');
  fs         = require('fs');
  express    = require('express');
  bodyParser = require('body-parser');
  crypto     = require('crypto');
  app        = this.express();
  paths      = {};
  cache      = {};

  hashAlgorithm = 'sha256';

  serverKeyAlgorithm = 'RSA-OAEP';
  serverKeyHash      = 'SHA-256';
  publicExponent     = new Uint8Array([1,0,1]);
  modulusLength      = 2048;
  ivLen              = 16;

  exportPublicType   = 'spki';

  constructor() { super(); }
}

module.exports = Modules;