const _ = require('lodash');
const axios = require('axios').default;
const querystring = require('querystring');
const { MessageEmbed } = require('discord.js');
const { trim } = require('../../utils/utils');

module.exports = {
  // args: true,
  config: {
    name: 'define',
    description: 'defines something on urbandictionary.com',
    usage: '_define',
    category: 'misc',
    aliases: ['d'],
  },
  async execute(bot, message, args) {
    try {
      const query = querystring.stringify({ term: args.join(' ') });
      const {
        data: { list },
      } = await axios.get(`https://api.urbandictionary.com/v0/define?${query}`);

      if (!list.length) {
        return message.channel.send(
          `No results found for **${args.join(' ')}**.`
        );
      }

      const sorted = _.sortBy(list, [
        function (o) {
          return o.thumbs_up;
        },
      ]);
      const answer = sorted[sorted.length - 1];

      const embed = new MessageEmbed()
        .setColor('#FF69B4')
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addFields(
          {
            name: 'Definition',
            value: trim(answer.definition, 1024),
          },
          { name: 'Example', value: trim(answer.example, 1024) },
          { name: 'Author', value: answer.author },
          {
            name: 'Rating',
            value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
          }
        );

      message.channel.send(embed);
    } catch (error) {
      message.channel.send(error.message);
      console.log(error.message, error.stack);
    }
  },
};
