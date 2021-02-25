module.exports = {
  config: {
    name: 'duck',
    description: 'Sends a crazyduck gif',
    usage: '_duck',
    category: 'misc',
    aliases: ['duck'],
  },
  execute(bot, message, args) {
    message.channel.send(
      'https://media.discordapp.net/attachments/799749686314663979/804655013179555860/799480780576915488.gif'
    );
  },
};
