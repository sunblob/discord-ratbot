const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'cat',
    description: 'sends a picture of a cat!',
    usage: '_cat',
    category: 'images',
    aliases: ['catto'],
  },
  execute: async (bot, message, args) => {
    let msg = await message.channel.send('Generating...');

    try {
      const { data } = await axios.get(`http://aws.random.cat/meow`);
      const embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setImage(data.file)
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
