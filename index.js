//native node modules
const fs = require('fs');

//additional modules
require('dotenv').config();

const config = require('./config.json');

//project specific modules & variables
const { Collection } = require('discord.js');
const Client = require('./client/Client');

const client = new Client(config);

// const PREFIX = process.env.PREFIX || '_';
const PREFIX = config.prefix;

client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', async (message) => {
  if (
    !message.content.startsWith(PREFIX) ||
    message.author.bot ||
    !message.guild
  )
    return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!client.commands.has(commandName)) return;

  if (command.args && !args.length) {
    return message.channel.send(
      `You didn't provide any arguments, ${message.author}!`
    );
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.log(error);
  }
});

client
  .login(config.token)
  .then((_) => {
    // console.log('Ready!');
    client.user.setPresence({
      activity: {
        name: `${PREFIX}help | beep boop`,
        type: 'PLAYING',
      },
    });
  })
  .catch(console.log);

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
