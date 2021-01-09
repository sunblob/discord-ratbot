const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'dog',
    description: 'sends a picture of a dog!',
    usage: '_dog',
    category: 'images',
    aliases: ['doge'],
  },
  execute: async (bot, message, args) => {
    let msg = await message.channel.send('Generating...');

    try {
      const { data } = await axios.get(
        `https://dog.ceo/api/breeds/image/random`
      );
      const embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setImage(data.message)
        .setTimestamp()
        .setFooter(
          message.author.username.toUpperCase(),
          message.author.displayAvatarURL()
        );

      message.channel.send(embed);
      msg.delete();
    } catch (error) {
      message.reply("whoops! I've broke, try again!");
    }
  },
};
