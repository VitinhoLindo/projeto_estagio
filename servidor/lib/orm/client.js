const mysql = require('mysql2')
const process = require('process');
const fs = require('fs');
const Validator = require('../http/Validator');
const Collection = require('./Collection');
const { Console } = require('console');

var selectFields = [];
var whereFields = [];

class Connect {

  constructor() { }

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

  static async encryptOrDecrypt(data, app, funcName, date) {
    if (!this.getEncrypt) throw 'getEncrypt is not defined';
    let encrytData = this.getEncrypt();
    for(let key of encrytData) {
      if (data[key]) data[key] = await app[funcName](data[key], date);
    }

    return data;
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

  validateData(data) {
    let model = this.constructor.getModel();
    let _data = {};

    if (!model) throw 'model of data is not defined';

    for (let key in model) {
      if (!data[key]) continue;
      _data[key] = data[key];
    }

    if (this.constructor.getTimestamp()) {
      if (_data.id) {
        delete _data.id;
        delete _data.created_at;
        _data.updated_at = new Date();
      } else {
        _data.created_at = new Date();
      }
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
      var table = this.constructor.getTable();
      data = this.validateData(data);
      console.log(data);

      return new Promise((resolve, reject) => {
        this.client.query(`INSERT INTO \`${table}\` SET ?`, data, async (err, result) => {
          await this.disconnect();
          if (err) {
            return reject(err);
          }

          data.id = result.insertId;
          data = Collection.instance([data], this).first();
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
    whereFields.push(query);
    return this;
  }

  where(opt = { column: '', comparison: '=', value: '' }) {
    if (!opt.column)     throw 'column is required';
    if (!opt.comparison) opt.comparison = '=';
    if (!opt.value)      opt.value = null; 
    let query = `${opt.column} ${opt.comparison} ${mysql.escape(opt.value)}`;
    whereFields.push(query);
    return this;
  }

  select(...args) {
    selectFields = selectFields.concat(args);
    return this;
  }

  getWhereFields() {
    let where = whereFields.slice();
    whereFields = [];

    if (!where.length) return '';

    let query = '';
    for(let x in where) {
      if (x > 0) query += ` AND ${where[x]}`;
      else query += `${where[x]}`;      
    }

    return `WHERE (${query})`;
  }

  getSelectFields() {
    let selectQuery = '';
    let _selectFields = selectFields.slice();
    selectFields = [];

    if (!_selectFields.length) return '*';

    for(let index in _selectFields) {
      if (index == 0) {
        selectQuery += `\`${_selectFields[index]}\``
      } else {
        selectQuery += `, \`${_selectFields[index]}\``
      }
    }
  
    return selectQuery;
  }

  /**
   * select query
   * 
   * return Promise[Collection]
   */
  get() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.client) await this.connect();
    
        let query = '';
    
        let table = this.constructor.getTable();
        query = `SELECT ${this.getSelectFields()} FROM \`${table}\` ${this.getWhereFields()};`
        
        this.client.query({
          sql: query
        }, async (err, data) => {
          await this.disconnect();
          if (err) return reject(err);
          return resolve(Collection.instance(data, this));
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  save() {
    return new Promise(async (resolve,reject) => {
      let data = {};
      let table = this.constructor.getTable();
      for(let key in this) data[key] = this[key];
      data = this.validateData(data);
      this.where({ column: 'id', value: this.id });
      if (!this.client) await this.connect();

      this.client.query(`UPDATE ${table} SET ? ${this.getWhereFields()};`, data, async (err, data) => {
        await this.disconnect();
        if (err) return reject(err);
        return resolve(data);
      });
    });  
  }

  async first() {
    let res = await this.get();

    return res.first();
  }

  async delete() {
    return new Promise(async (resolve, reject) => {
      try {
        let id = this.id;
        if (!id) return reject(`inpossible delete data, first get instance data to delete`);

        this.where({ column: 'id', value: id });
        
        let table = this.constructor.getTable();
        let sql = `DELETE FROM ${table} ${this.getWhereFields()}`;

        if (!this.client) await this.connect();

        this.client.query({
          sql: sql
        }, async (err, data) => {
          await this.disconnect();

          if (err) return reject(err);
          return resolve(data);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  toJSON() {
    return Object.assign({}, this);
  }
}

module.exports = Connect;