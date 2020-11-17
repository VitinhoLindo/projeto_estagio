const crypto = require('crypto');

const hash = crypto.createHash('sha256');

let hashable = hash.update('10189727Jv!').digest('hex');

console.log(hashable);