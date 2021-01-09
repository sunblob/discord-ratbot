const { Client, Collection } = require('discord.js');

const { readdirSync } = require('fs');

module.exports = class extends (
  Client
) {
  constructor(config) {
    super({
      disableEveryone: true,
      disabledEvents: ['TYPING_START'],
    });

    this.commands = new Collection();

    this.queue = new Map();

    this.config = config;
  }

  load(dirs) {
    const commands = readdirSync(`./commands/${dirs}`).filter((d) =>
      d.endsWith('.js')
    );

    for (let file of commands) {
      let command = require(`../commands/${dirs}/${file}`);
      this.commands.set(command.config.name, command);
    }
  }

  initHandlers() {
    this.on('message', async (message) => {
      if (
        !message.content.startsWith(this.config.prefix) ||
        message.author.bot ||
        !message.guild
      )
        return;

      const args = message.content
        .slice(this.config.prefix.length)
        .trim()
        .split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = this.commands.get(commandName);

      if (!this.commands.has(commandName)) return;

      if (command.args && !args.length) {
        return message.channel.send(
          `You didn't provide any arguments, ${message.author}!`
        );
      }

      try {
        command.execute(this, message, args);
      } catch (error) {
        console.log(error);
      }
    });
  }

  initBot() {
    ['misc', 'images', 'music'].forEach((x) => this.load(x));
    this.once('ready', () => {
      console.log('Bot is ready!');
    });
    this.initHandlers();

    this.login(this.config.token)
      .then((_) => {
        // console.log('Ready!');
        this.user.setPresence({
          activity: {
            name: `${this.config.prefix}help | beep boop`,
            type: 'PLAYING',
          },
        });
      })
      .catch(console.log);
  }
};
