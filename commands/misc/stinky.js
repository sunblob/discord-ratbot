const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'stinky',
    description: 'shows dima',
    usage: '_stinky',
    category: 'misc',
    aliases: ['stinky'],
  },
  execute(bot, message, args) {
    const embed = new MessageEmbed()
      // .attachFiles(['../assets/burb.jpg'])
      .setImage(
        'https://memepedia.ru/wp-content/uploads/2019/10/stinki-manki.jpg'
      )
      .setTitle('Dima');
    message.channel.send(embed);
  },
};
