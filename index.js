//native node modules
const fs = require('fs');

//additional modules
require('dotenv').config();

const config = require('./config.json');

//project specific modules & variables
const Client = require('./client/Client');

const client = new Client(config);

client.initBot();

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
