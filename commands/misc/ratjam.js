module.exports = {
  config: {
    name: 'ratjam',
    description: 'Sends a ratjam gif',
    usage: '_ratjam',
    category: 'misc',
    aliases: ['rat'],
  },
  execute(bot, message, args) {
    message.channel.send(
      'https://media.discordapp.net/attachments/677766236876046373/785157956991844362/ratjam.gif'
    );
  },
};
