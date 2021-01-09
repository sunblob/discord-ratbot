const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'avatar',
    description: 'sends a picture of users avatar!',
    usage: '_avatar',
    category: 'misc',
    aliases: ['a'],
  },
  execute(bot, message, args) {
    if (args.length == 0) {
      //   console.log(message.author);
      const embed = new MessageEmbed()
        .setTitle(message.author.username)
        .setImage(message.author.displayAvatarURL());

      message.channel.send(embed);
    } else {
      //   console.log(message.mentions.users);
      const user = message.mentions.users.values().next().value;
      //   console.log(user);
      const embed = new MessageEmbed()
        .setTitle(user.username)
        .setImage(user.displayAvatarURL());

      message.channel.send(embed);
    }
  },
};
