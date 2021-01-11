const _ = require('lodash');

module.exports = {
  config: {
    name: 'volume',
    description: 'Changes volume of a track!',
    usage: '_volume <number>',
    category: 'music',
    aliases: ['v'],
  },
  execute: async (bot, message, args) => {
    if (!args[0] || !_.inRange(args[0], 1, 200)) {
      return message.channel
        .send('Volume must be in a range of 1 and 200')
        .then((msg) => msg.delete({ timeout: 15000 }));
    }

    const player = bot.manager.get(message.guild.id);

    player.setVolume(args[0]);

    message.channel
      .send(`Volume set to ${args[0]}`)
      .then((msg) => msg.delete({ timeout: 15000 }));
  },
};
