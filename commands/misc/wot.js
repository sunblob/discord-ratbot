const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;
const {
  wot: { token },
} = require('./../../config.json');

module.exports = {
  config: {
    name: 'gay',
    description: 'Information about wot',
    usage: '_gay <username>',
    category: 'misc',
    aliases: ['wot'],
  },
  async execute(bot, message, args) {
    if (!args[0]) {
      return message.channel
        .send('Please supply a username.')
        .then((msg) => msg.delete({ timeout: 15000 }));
    }

    try {
      const { data } = await axios.get(
        `https://api.worldoftanks.ru/wot/account/list/?application_id=${token}&search=${args[0]}`
      );

      if (!data.meta.count) {
        return message.channel
          .send('Didnt find any user with provided username.')
          .then((msg) => msg.delete({ timeout: 15000 }));
      }

      const id = data.data[0].account_id;

      const { data: userInfo } = await axios.get(
        `https://api.worldoftanks.ru/wot/account/info/?application_id=${token}&account_id=${id}`
      );

      //   console.log(userInfo);
      const user = userInfo.data[`${id}`];
      const embed = new MessageEmbed()
        .setAuthor(`WoT | ${user.nickname}`)
        .setDescription(
          `
        **Battles:** ${user.statistics.all.battles}
        **Wins:** ${user.statistics.all.wins}
        **Loses:** ${user.statistics.all.losses}
        **Max frags:** ${user.statistics.all.max_frags}
      `
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
