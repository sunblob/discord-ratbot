const { MessageEmbed } = require('discord.js');
// const { PREFIX } = require('../../utils/constants');
const { prefix } = require('./../../config.json');
const { readdirSync } = require('fs');

module.exports = {
  config: {
    name: 'help',
    description: 'shows how to use the bot',
    usage: '_help',
    category: 'misc',
    aliases: ['h'],
  },
  execute(bot, message, args) {
    // const embed = new MessageEmbed().setTitle('Commands').addFields(
    //   {
    //     name: 'avatar',
    //     value: `${PREFIX}avatar <@username> | ${PREFIX}avatar`,
    //   },
    //   {
    //     name: 'roll',
    //     value: `${PREFIX}roll | ${PREFIX}roll <from> <to>`,
    //   },
    //   {
    //     name: 'play',
    //     value: `${PREFIX}play <youtube_link>`,
    //   },
    //   {
    //     name: 'stop',
    //     value: `${PREFIX}stop`,
    //   },
    //   {
    //     name: 'skip',
    //     value: `${PREFIX}skip`,
    //   },
    //   {
    //     name: 'define',
    //     value: `${PREFIX}define <word>`,
    //   }
    // );
    // message.channel.send(embed);
    const embed = new MessageEmbed()
      .setColor('#8d32a8')
      .setAuthor(
        `${message.guild.me.displayName} Help`,
        message.guild.iconURL()
      )
      .setThumbnail(bot.user.displayAvatarURL);

    if (!args[0]) {
      const categories = readdirSync('./commands/');

      embed.setDescription(
        `These are the avaliable commands for ${message.guild.me.displayName}\nThe bot prefix is: **${prefix}**`
      );
      embed.setFooter(
        `© ${message.guild.me.displayName} | Total Commands: ${bot.commands.size}`,
        bot.user.displayAvatarURL()
      );

      categories.forEach((category) => {
        const dir = bot.commands.filter((c) => c.config.category === category);
        const capitalise =
          category.slice(0, 1).toUpperCase() + category.slice(1);
        try {
          embed.addField(
            `❯ ${capitalise} [${dir.size}]:`,
            dir.map((c) => `\`${c.config.name}\``).join(' ')
          );
        } catch (e) {
          console.log(e);
        }
      });

      return message.channel.send(embed);
    } else {
      let command = bot.commands.get(
        bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase()
      );
      if (!command)
        return message.channel.send(
          embed
            .setTitle('Invalid Command.')
            .setDescription(
              `Do \`${prefix}help\` for the list of the commands.`
            )
        );
      command = command.config;

      embed.setDescription(`The bot's prefix is: \`${prefix}\`\n
        **Command:** ${
          command.name.slice(0, 1).toUpperCase() + command.name.slice(1)
        }
        **Description:** ${command.description || 'No Description provided.'}
        **Usage:** ${command.usage ? `\`${command.usage}\`` : 'No Usage'}
        **Aliases:** ${
          command.aliases ? command.aliases.join(', ') : 'None.'
        }`);

      return message.channel.send(embed);
    }
  },
};
