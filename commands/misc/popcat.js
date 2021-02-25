module.exports = {
  config: {
    name: 'popcat',
    description: 'Sends a popcat gif',
    usage: '_popcat',
    category: 'misc',
    aliases: ['pq'],
  },
  execute(bot, message, args) {
    message.channel.send(
      'https://media.discordapp.net/attachments/586588877582631060/779754500596563978/image0.gif'
    );
  },
};
