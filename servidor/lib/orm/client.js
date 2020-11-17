const mysql = require('mysql2')
const process = require('process');
const fs = require('fs');
const Validator = require('../http/Validator');

class Connect {
  table = '';
  model = {};
  selectFields = [];
  whereFields = [];

  constructor(table, model) {
    this.table = table;
    this.model = model;
  }

  async getConfig() {
    return {
      HOST: process.env.MYSQL_HOST,
      PORT: process.env.MYSQL_PORT,
      USER: process.env.MYSQL_USER,
      PASS: process.env.MYSQL_PASS,
      DB: process.env.MYSQL_DB,
      ssl: {
        ca: await fs.readFileSync(__dirname + '/ssl/ca.pem'),
        key: await fs.readFileSync(__dirname + '/ssl/client-key.pem'),
        cert: await fs.readFileSync(__dirname + '/ssl/client-cert.pem')
      }
    }
  }

  async connect() {
    let config = await this.getConfig();

    return new Promise((resolve, reject)=> {
      this.client = mysql.createConnection({
        host: config.HOST,
        port: config.PORT,
        user: config.USER,
        password: config.PASS,
        database: config.DB,
        ssl: config.ssl,
        connectTimeout: 15000,
      });

      this.client.connect((err) => { 
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.client.end((err) => {
        if (err) return reject(err);
        delete this.client;
        return resolve(true);
      });
    });
  }

  validateData(model, data) {
    let _data = {};

    if (!model) throw 'model of data is not defined';

    let validator = Validator.make(data, model);

    if (validator.fails()) {
      throw `message: ${validator.message}\nrule: ${validator.rule}`;
    }

    for (let key in model) {
      if (!data[key]) continue;
      _data[key] = data[key];
    }

    return _data;
  }

  async insert(data) {
    try {
      if (!this.client) await this.connect();
    } catch (error) {
      throw error;
    }

    try {
      data = this.validateData(this.model, data);

      return new Promise((resolve, reject) => {
        this.client.query(`INSERT INTO \`${this.table}\` SET ?`, data, async (err, result) => {
          await this.disconnect();
          if (err) {
            return reject(err);
          }

          data.id = result.insertId;
          return resolve(data);
        });
      });
    } catch (error) {
      await this.disconnect();
    }
  }

  whereNotNull(opt = { column: '' }) {
    if (!opt.column) throw "";
    let query = `${opt.column} is not Null`;
    this.whereFields.push(query);
    return this;
  }

  where(opt = { column: '', comparison: '=', value: '' }) {
    if (!opt.column)     throw 'column is required';
    if (!opt.comparison) opt.comparison = '=';
    if (!opt.value)      opt.value = null; 
    let query = `${opt.column} ${opt.comparison} ${mysql.escape(opt.value)}`;
    this.whereFields.push(query);
    return this;
  }

  select(...args) {
    this.selectFields = this.selectFields.concat(args);
    return this;
  }

  getWhereFields() {
    let where = this.whereFields.slice();
    this.whereFields = [];

    let query = '';
    for(let x in where) {
      if (x > 0) query += ` AND ${where[x]}`;
      else query += `${where[x]}`;      
    }

    return query;
  }

  async get() {
    try {
      if (!this.client) await this.connect();
    } catch (error) {
      throw error;
    }

    let query = '';
    try {
      query = `SELECT ${this.selectFields.length ? this.getFields(): '*'} FROM \`${this.table}\` ${this.whereFields.length ? 'WHERE ' + this.getWhereFields() : ''};`
    } catch (error) {
      throw error;      
    }

    return new Promise((resolve, reject) => {
      this.client.query({
        sql: query
      }, async (err, data) => {
        await this.disconnect();
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }
}

module.exports = Connect;