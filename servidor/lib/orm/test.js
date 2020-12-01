const Client = require('./client');

(async () => {
  const client = new Client();

  try {
    await client.connect();
  } catch (error) {
    console.log(error);
  }

  try {
    await client.disconnect();
  } catch (error) {
    console.log(error);
  }
})();