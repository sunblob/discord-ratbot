const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
  config: {
    name: 'userinfo',
    description: 'Pulls the userinfo of yourself or a user!',
    usage: '!userinfo (@mention)',
    category: 'miscellaneous',
    accessableby: 'Members',
    aliases: ['ui'],
  },
  execute: async (bot, message, args) => {
    let uEmbed = new MessageEmbed()
      .setColor('#f94343')
      .setTitle('User Info')
      .setThumbnail(message.guild.iconURL())
      .setAuthor(
        `${message.author.username} Info`,
        message.author.displayAvatarURL()
      )
      .addField('**Username:**', `${message.author.username}`, true)
      .addField('**Discriminator:**', `${message.author.discriminator}`, true)
      .addField('**ID:**', `${message.author.id}`, true)
      .addField('**Status:**', `${message.author.presence.status}`, true)
      .addField(
        '**Created At:**',
        `${moment(message.author.createdAt).format('MMMM Do YYYY')}`,
        true
      )
      .setFooter(`Ratbot`, bot.user.displayAvatarURL());

    message.channel.send(uEmbed);
  },
};
