const { MessageEmbed } = require('discord.js');
const axios = require('axios').default;
const moment = require('moment');

const {
  steam: { token },
} = require('./../../config.json');

module.exports = {
  config: {
    name: 'steam',
    description: 'shows user information',
    usage: '_steam <name>',
    category: 'misc',
    aliases: ['дым'],
  },
  async execute(bot, message, args) {
    const mode = ['link', 'id'];

    try {
      if (!args[0] && !mode.includes(args[0])) {
        return message.channel.send(
          `Please provide a search mode: "link" | "id"`
        );
      }

      if (!args[1]) {
        return message.channel.send('Please provide an account name!');
      }

      let steamId = '';

      if (args[0] === 'link') {
        const { data } = await axios.get(
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${token}&vanityurl=${args[1]}`
        );

        if (data.response.success === 42) {
          return message.channel.send(
            'I was unable to find a steam profile with that name'
          );
        }

        const id = data.response.steamid;
        steamId = id;
      } else {
        steamId = args[1];
      }

      //   console.log(steamId);

      const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${steamId}`;
      const b = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${token}&steamids=${steamId}`;
      const g = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${token}&steamid=${steamId}&format=json`;

      const {
        data: { response: sums },
      } = await axios.get(summaries);

      if (!sums) {
        return message.channel.send(
          'I was unable to find a steam profile with that name'
        );
      }

      const {
        personaname,
        avatarfull,
        profileurl,
        lastlogoff,
        timecreated,
      } = sums.players[0];

      const {
        data: { response: games },
      } = await axios.get(g);

      if (!games) {
        return message.channel.send(
          'I was unable to find a steam profile with that name'
        );
      }

      const { game_count } = games;

      const { data: bans } = await axios.get(b);

      if (!b) {
        return message.channel.send(
          'I was unable to find a steam profile with that name'
        );
      }

      const { NumberOfVACBans, NumberOfGameBans } = bans.players[0];

      const embed = new MessageEmbed()
        .setAuthor(`Steam Services | ${personaname}`, avatarfull)
        .setThumbnail(avatarfull)
        .setDescription(
          `
                **Account Created:** ${moment(
                  new Date(timecreated * 1000)
                ).format('MMMM Do YYYY')}
                **Games:** ${game_count}
                **Last Time Online:** ${moment(
                  new Date(lastlogoff * 1000)
                ).format('MMMM Do YYYY')}
                **Bans:** Vac: ${NumberOfVACBans}, Game: ${NumberOfGameBans}
                **Link:** [link to profile](${profileurl})
                `
        )
        .setTimestamp();

      message.channel.send(embed);
    } catch (error) {
      console.log(error);
      message.channel.send('Some error!');
    }
  },
};
