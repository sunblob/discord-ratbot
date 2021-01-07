const { Client } = require('./../client/Client');
const { prefix, token } = require('./../config.json');

const PREFIX = prefix;
const TOKEN = token;
const client = Client;

module.exports = {
  PREFIX,
  TOKEN,
  client,
};
