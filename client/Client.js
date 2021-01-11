const { Client, Collection } = require('discord.js');
const { Manager } = require('erela.js');

const { readdirSync } = require('fs');

const nodes = [
  {
    host: 'localhost',
    password: 'youshallnotpass',
    port: 2333,
  },
];

module.exports = class extends (
  Client
) {
  constructor(config) {
    super({
      disableEveryone: true,
      disabledEvents: ['TYPING_START'],
    });

    this.commands = new Collection();

    this.aliases = new Collection();

    this.queue = new Map();

    this.config = config;

    this.manager = new Manager({
      nodes,
      send: (id, payload) => {
        const guild = this.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  }

  load(dirs) {
    const commands = readdirSync(`./commands/${dirs}`).filter((d) =>
      d.endsWith('.js')
    );

    for (let file of commands) {
      let command = require(`../commands/${dirs}/${file}`);
      this.commands.set(command.config.name, command);

      if (command.config.aliases) {
        command.config.aliases.forEach((a) =>
          this.aliases.set(a, command.config.name)
        );
      }
    }
  }

  initCommands() {
    ['misc', 'images', 'music'].forEach((x) => this.load(x));

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

      const command =
        this.commands.get(commandName) ||
        this.commands.get(this.aliases.get(commandName));

      if (!command) return;

      try {
        command.execute(this, message, args);
      } catch (error) {
        console.log(error);
      }
    });
  }

  ready() {
    this.manager
      .on('nodeConnect', (node) => {
        console.log(`Node "${node.options.identifier}" connected.`);
      })
      .on('nodeError', (node, error) => {
        console.log(
          `Node "${node.options.identifier}" encountered an error: ${error.message}.`
        );
      })
      .on('trackStart', (player, track) => {
        this.channels.cache
          .get(player.textChannel)
          .send(`Now playing: ${track.title}`)
          .then((msg) => msg.delete({ timeout: 30000 }));
      })
      .on('queueEnd', (player) => {
        this.channels.cache
          .get(player.textChannel)
          .send('Queue has ended.')
          .then((msg) => msg.delete({ timeout: 30000 }));

        player.destroy();
      });

    // Here we send voice data to lavalink whenever the bot joins a voice channel to play audio in the channel.
    this.on('raw', (d) => this.manager.updateVoiceState(d));

    this.once('ready', () => {
      console.log('Bot is ready.');
      this.manager.init(this.user.id);
    });
  }

  async loginBot() {
    await this.login(this.config.token)
      .then((_) => {
        this.user.setPresence({
          activity: {
            name: `${this.config.prefix}help | beep boop`,
            type: 'PLAYING',
          },
        });
      })
      .catch(console.log);
  }

  async startBot() {
    this.ready();

    this.initCommands();

    await this.loginBot();
  }
};
