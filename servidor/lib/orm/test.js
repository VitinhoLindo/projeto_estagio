require('dotenv').config();
const Client = require('./client');

(async () => {
  const client = new Client();

  try {
    await client.connect();
    await client.disconnect();
  } catch (error) {
    console.log(error);
  }
})();
