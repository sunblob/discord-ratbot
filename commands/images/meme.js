const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'meme',
    description: 'sends a picture of a meme!',
    usage: '_meme',
    category: 'images',
    aliases: ['mem'],
  },
  execute: async (bot, message, args) => {
    let msg = await message.channel.send('Generating...');

    try {
      const { data } = await axios.get(`https://meme-api.herokuapp.com/gimme`);
      const embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setImage(data.url)
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
