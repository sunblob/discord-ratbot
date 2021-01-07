const { MessageEmbed } = require('discord.js');
const { PREFIX } = require('./../utils/constants');

module.exports = {
  name: 'help',
  description: 'shows how to use the bot',
  execute(message, args) {
    const embed = new MessageEmbed().setTitle('Commands').addFields(
      {
        name: 'avatar',
        value: `${PREFIX}avatar <@username> | ${PREFIX}avatar`,
      },
      {
        name: 'roll',
        value: `${PREFIX}roll | ${PREFIX}roll <from> <to>`,
      },
      {
        name: 'play',
        value: `${PREFIX}play <youtube_link>`,
      },
      {
        name: 'stop',
        value: `${PREFIX}stop`,
      },
      {
        name: 'skip',
        value: `${PREFIX}skip`,
      },
      {
        name: 'define',
        value: `${PREFIX}define <word>`,
      }
    );
    message.channel.send(embed);
  },
};
