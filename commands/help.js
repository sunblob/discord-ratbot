const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'shows how to use the bot',
  execute(message, args) {
    const embed = new MessageEmbed().setTitle('Commands').addFields(
      {
        name: 'avatar',
        value: 'rat avatar <@username> | rat avatar',
      },
      {
        name: 'roll',
        value: 'rat roll | rat roll <from> <to>',
      },
      {
        name: 'play',
        value: 'rat play <youtube_link>',
      },
      {
        name: 'define',
        value: 'rat define <word>',
      }
    );
    message.channel.send(embed);
  },
};
