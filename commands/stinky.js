const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'stinky',
  execute(message, args) {
    const embed = new MessageEmbed()
      // .attachFiles(['../assets/burb.jpg'])
      .setImage(
        'https://memepedia.ru/wp-content/uploads/2019/10/stinki-manki.jpg'
      )
      .setTitle('Dima');
    message.channel.send(embed);
  },
};
