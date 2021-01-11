const { MessageEmbed } = require('discord.js');
// const axios = require('axios').default;
const got = require('got');

const {
  apex: { token },
} = require('./../../config.json');

module.exports = {
  config: {
    name: 'apex',
    description: `Information about apex legends user's stats`,
    usage: '_apex <username>',
    category: 'misc',
    aliases: ['ax'],
  },
  async execute(bot, message, args) {
    if (!args[0]) {
      return message.channel
        .send('Please supply a username.')
        .then((msg) => msg.delete({ timeout: 15000 }));
    }

    if (!args[1])
      return message.channel.send(
        'Please supply a platform to check. `origin | pc`, `xbl | xbox` or `psn | ps`'
      );

    if (args[1] === 'pc') {
      args[1] = 'origin';
    } else if (args[1] === 'xbox') {
      args[1] = 'xbl';
    } else if (args[1] === 'ps') {
      args[1] = 'psn';
    }

    try {
      const res = await got(
        `https://public-api.tracker.gg/v2/apex/standard/profile/${args[1]}/${args[0]}`,
        {
          headers: {
            'TRN-Api-Key': `${token}`,
          },
        }
      ).json();

      const {
        data: {
          platformInfo: { platformUserIdentifier, avatarUrl },
        },
      } = res;

      const rank = res.data.segments[0].stats.rankScore.metadata;
      const kills = res.data.segments[0].stats.kills.value;
      const level = res.data.segments[0].stats.level.value;
      const damage = res.data.segments[0].stats.damage.value;

      const embed = new MessageEmbed()
        .setAuthor(`Apex Legends | ${platformUserIdentifier}`, avatarUrl)
        .setThumbnail(rank.iconUrl)
        .setDescription(
          `
        **Rank:** ${rank.rankName}
        **Level:** ${level}
        **Kills:** ${kills}
        **Damage:** ${damage}`
        )
        .setTimestamp();
      message.channel.send(embed);
    } catch (error) {
      console.log(error);
      message.channel
        .send('Some error!')
        .then((msg) => msg.delete({ timeout: 15000 }));
    }
  },
};
